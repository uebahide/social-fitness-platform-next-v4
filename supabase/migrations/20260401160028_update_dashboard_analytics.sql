drop function if exists "public"."get_dashboard_analytics"();

CREATE UNIQUE INDEX room_user_room_id_user_id_key ON public.room_user USING btree (room_id, user_id);

alter table "public"."room_user" add constraint "room_user_room_id_user_id_key" UNIQUE using index "room_user_room_id_user_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_dashboard_analytics(p_category text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
  v_auth_user_id uuid := auth.uid();
  v_profile_id bigint;
  v_category_id bigint;
  v_category text := nullif(trim(p_category), '');
  result jsonb;
begin
  if v_auth_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select p.id
    into v_profile_id
  from public.profiles p
  where p.user_id = v_auth_user_id;

  if v_profile_id is null then
    raise exception 'Profile not found';
  end if;

  if v_category is not null then
    select c.id
      into v_category_id
    from public.categories c
    where c.name = v_category;

    if v_category_id is null then
      raise exception 'Category not found';
    end if;
  end if;

  with
  filtered_activities as (
    select a.*
    from public.activities a
    where a.user_id = v_profile_id
      and (v_category_id is null or a.category_id = v_category_id)
  ),

  filtered_activity_details as (
    select
      a.id,
      a.category_id,
      a.created_at,
      ad.distance,
      ad.duration
    from filtered_activities a
    join public.activity_details ad
      on ad.activity_id = a.id
  ),

  activity_counts as (
    select jsonb_build_object(
      'last7DaysActivityTotal',
        count(*) filter (
          where created_at between now() - interval '7 days' and now()
        ),
      'last30DaysActivityTotal',
        count(*) filter (
          where created_at between now() - interval '30 days' and now()
        ),
      'last60DaysActivityTotal',
        count(*) filter (
          where created_at between now() - interval '60 days' and now()
        ),
      'last90DaysActivityTotal',
        count(*) filter (
          where created_at between now() - interval '90 days' and now()
        )
    ) as data
    from filtered_activities
  ),

  summary_metrics as (
    select jsonb_build_object(
      'longestDistance', coalesce(max(distance), 0),
      'longestDuration', coalesce(max(duration), 0),
      'totalDuration', coalesce(sum(duration), 0),
      'averageDistance', coalesce(avg(distance), 0),
      'averageDuration', coalesce(avg(duration), 0),
      'activeDays', coalesce(count(distinct date(created_at)), 0),
      'latestActivityDate', max(created_at)
    ) as data
    from filtered_activity_details
  ),

  most_frequent_category as (
    select c.name as category
    from filtered_activities a
    join public.categories c
      on c.id = a.category_id
    group by c.name
    order by count(*) desc, c.name asc
    limit 1
  ),

  category_counts as (
    select
      period_days,
      c.id as category_id,
      c.name as category,
      count(*) as total
    from (
      select 7 as period_days
      union all select 30
      union all select 60
      union all select 90
    ) periods
    join filtered_activities a
      on a.created_at between now() - (periods.period_days || ' days')::interval and now()
    join public.categories c
      on c.id = a.category_id
    group by period_days, c.id, c.name
  ),

  category_7 as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'category_id', category_id,
          'category', category,
          'total', total
        )
        order by category_id
      ),
      '[]'::jsonb
    ) as data
    from category_counts
    where period_days = 7
  ),

  category_30 as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'category_id', category_id,
          'category', category,
          'total', total
        )
        order by category_id
      ),
      '[]'::jsonb
    ) as data
    from category_counts
    where period_days = 30
  ),

  category_60 as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'category_id', category_id,
          'category', category,
          'total', total
        )
        order by category_id
      ),
      '[]'::jsonb
    ) as data
    from category_counts
    where period_days = 60
  ),

  category_90 as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'category_id', category_id,
          'category', category,
          'total', total
        )
        order by category_id
      ),
      '[]'::jsonb
    ) as data
    from category_counts
    where period_days = 90
  ),

  raw_daily as (
    select
      date(created_at) as activity_date,
      coalesce(sum(distance), 0) as distance,
      coalesce(sum(duration), 0) as duration
    from filtered_activity_details
    where created_at between date_trunc('day', now() - interval '90 days')
                        and now()
    group by date(created_at)
  ),

  filled_daily as (
    select
      d::date as activity_date,
      coalesce(r.distance, 0) as distance,
      coalesce(r.duration, 0) as duration
    from generate_series(
      date_trunc('day', now() - interval '90 days')::date,
      current_date,
      interval '1 day'
    ) as d
    left join raw_daily r
      on r.activity_date = d::date
    order by d
  ),

  daily_json as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'date', activity_date,
          'distance', distance,
          'duration', duration
        )
        order by activity_date
      ),
      '[]'::jsonb
    ) as data
    from filled_daily
  ),

  activity_dates as (
    select distinct date(created_at) as activity_date
    from filtered_activities
  ),

  streak_anchor as (
    select
      case
        when exists (
          select 1 from activity_dates where activity_date = current_date
        ) then current_date
        when exists (
          select 1 from activity_dates where activity_date = current_date - 1
        ) then current_date - 1
        else null
      end as anchor_date
  ),

  streak_series as (
    select
      ad.activity_date,
      sa.anchor_date,
      (sa.anchor_date - ad.activity_date) as day_gap,
      row_number() over (order by ad.activity_date desc) - 1 as rn
    from activity_dates ad
    cross join streak_anchor sa
    where sa.anchor_date is not null
      and ad.activity_date <= sa.anchor_date
  ),

  current_streak_calc as (
    select coalesce(count(*), 0) as total
    from streak_series
    where day_gap = rn
  )

  select jsonb_build_object(
    'last7DaysActivityTotal',  (activity_counts.data->>'last7DaysActivityTotal')::int,
    'last30DaysActivityTotal', (activity_counts.data->>'last30DaysActivityTotal')::int,
    'last60DaysActivityTotal', (activity_counts.data->>'last60DaysActivityTotal')::int,
    'last90DaysActivityTotal', (activity_counts.data->>'last90DaysActivityTotal')::int,
    'longestDistance', (summary_metrics.data->>'longestDistance')::numeric,
    'longestDuration', (summary_metrics.data->>'longestDuration')::numeric,
    'totalDuration', (summary_metrics.data->>'totalDuration')::numeric,
    'averageDistance', (summary_metrics.data->>'averageDistance')::numeric,
    'averageDuration', (summary_metrics.data->>'averageDuration')::numeric,
    'activeDays', (summary_metrics.data->>'activeDays')::int,
    'latestActivityDate', summary_metrics.data->'latestActivityDate',
    'currentStreak', current_streak_calc.total,
    'mostFrequentCategory', (
      select category
      from most_frequent_category
    ),
    'last7DaysCategoryActivityTotal',  category_7.data,
    'last30DaysCategoryActivityTotal', category_30.data,
    'last60DaysCategoryActivityTotal', category_60.data,
    'last90DaysCategoryActivityTotal', category_90.data,
    'dailyDistanceAndDurationValues', daily_json.data
  )
  into result
  from activity_counts,
       summary_metrics,
       current_streak_calc,
       category_7,
       category_30,
       category_60,
       category_90,
       daily_json;

  return result;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_or_create_private_room(user1_id bigint, user2_id bigint)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_user_a bigint := least(user1_id, user2_id);
  v_user_b bigint := greatest(user1_id, user2_id);
  v_room_id bigint;
begin
  if user1_id is null or user2_id is null then
    raise exception 'user ids are required';
  end if;

  if user1_id = user2_id then
    raise exception 'cannot create a private room with the same user';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(
      format('private-room:%s:%s', v_user_a, v_user_b),
      0
    )
  );

  select r.id
    into v_room_id
  from public.rooms r
  join public.room_user ru
    on ru.room_id = r.id
  where r.type = 'private'
  group by r.id
  having count(*) = 2
     and count(*) filter (where ru.user_id = v_user_a) = 1
     and count(*) filter (where ru.user_id = v_user_b) = 1
  order by r.id
  limit 1;

  if v_room_id is null then
    insert into public.rooms (type)
    values ('private')
    returning id into v_room_id;

    insert into public.room_user (room_id, user_id)
    values
      (v_room_id, v_user_a),
      (v_room_id, v_user_b);
  end if;

  return v_room_id;
end;
$function$
;


