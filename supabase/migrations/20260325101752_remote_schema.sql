


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."gender" AS ENUM (
    'male',
    'female',
    'other'
);


ALTER TYPE "public"."gender" OWNER TO "postgres";


CREATE TYPE "public"."status" AS ENUM (
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE "public"."status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."are_users_in_same_room"("user1_id" bigint, "user2_id" bigint) RETURNS boolean
    LANGUAGE "sql"
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM room_user ru1
    JOIN room_user ru2
      ON ru1.room_id = ru2.room_id
    WHERE ru1.user_id = user1_id
      AND ru2.user_id = user2_id
  );
$$;


ALTER FUNCTION "public"."are_users_in_same_room"("user1_id" bigint, "user2_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_activity_total_count"() RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
declare
  v_auth_user_id uuid := auth.uid();
  v_profile_id bigint;
  total_count integer;
begin
  if v_auth_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- profile取得
  select p.id
    into v_profile_id
  from public.profiles p
  where p.user_id = v_auth_user_id;

  if v_profile_id is null then
    raise exception 'Profile not found';
  end if;

  -- count
  select count(*)
    into total_count
  from public.activities a
  where a.user_id = v_profile_id;

  return total_count;
end;
$$;


ALTER FUNCTION "public"."get_activity_total_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_activity_total_count"("p_user_id" bigint) RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
declare
  total_count integer;
begin
  select count(*)
    into total_count
  from public.activities a
  where a.user_id = p_user_id;

  return total_count;
end;
$$;


ALTER FUNCTION "public"."get_activity_total_count"("p_user_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_dashboard_analytics"() RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
declare
  v_auth_user_id uuid := auth.uid();
  v_profile_id bigint;
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

  with
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
    from public.activities
    where user_id = v_profile_id
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
  join public.activities a
    on a.user_id = v_profile_id
   and a.created_at between now() - (periods.period_days || ' days')::interval and now()
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
      date(a.created_at) as activity_date,
      coalesce(sum(ad.distance), 0) as distance,
      coalesce(sum(ad.duration), 0) as duration
    from public.activities a
    join public.activity_details ad
      on ad.activity_id = a.id
    where a.user_id = v_profile_id
      and a.created_at between date_trunc('day', now() - interval '90 days')
                          and now()
    group by date(a.created_at)
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
  )

  select jsonb_build_object(
    'last7DaysActivityTotal',  (activity_counts.data->>'last7DaysActivityTotal')::int,
    'last30DaysActivityTotal', (activity_counts.data->>'last30DaysActivityTotal')::int,
    'last60DaysActivityTotal', (activity_counts.data->>'last60DaysActivityTotal')::int,
    'last90DaysActivityTotal', (activity_counts.data->>'last90DaysActivityTotal')::int,
    'last7DaysCategoryActivityTotal',  category_7.data,
    'last30DaysCategoryActivityTotal', category_30.data,
    'last60DaysCategoryActivityTotal', category_60.data,
    'last90DaysCategoryActivityTotal', category_90.data,
    'dailyDistanceAndDurationValues', daily_json.data
  )
  into result
  from activity_counts, category_7, category_30, category_60, category_90, daily_json;

  return result;
end;
$$;


ALTER FUNCTION "public"."get_dashboard_analytics"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_latest_activity"() RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
declare
  v_auth_user_id uuid := auth.uid();
  v_profile_id bigint;
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

  select jsonb_build_object(
    -- Activity
    'id', a.id::text,
    'category', jsonb_build_object(
      'id', c.id::text,
      'name', c.name
    ),
    'title', a.title,
    'description', a.description,
    'created_at', a.created_at,

    -- User
    'user', jsonb_build_object(
      'id', p.id,
      'display_name', coalesce(p.display_name, concat_ws(' ', p.first_name, p.last_name)),
      'email', p.email,
      'image_path', p.image_path,
      'created_at', p.created_at
    ),

    -- Details
    'details', jsonb_build_object(
      'distance', ad.distance,
      'duration', ad.duration,
      'location', ad.location
    )
  )
  into result
  from public.activities a
  left join public.activity_details ad
    on ad.activity_id = a.id
  join public.categories c
    on c.id = a.category_id
  join public.profiles p
    on p.id = a.user_id
  where a.user_id = v_profile_id
  order by a.created_at desc, a.id desc
  limit 1;

  return coalesce(result, '{}'::jsonb);
end;
$$;


ALTER FUNCTION "public"."get_latest_activity"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."activities" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "description" "text",
    "category_id" bigint NOT NULL,
    "user_id" bigint NOT NULL
);


ALTER TABLE "public"."activities" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_latest_activity"("p_user_id" bigint) RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'id', a.id::text,
    'category', jsonb_build_object(
      'id', c.id::text,
      'name', c.name
    ),
    'title', a.title,
    'description', a.description,
    'created_at', a.created_at,
    'user', jsonb_build_object(
      'id', p.id,
      'display_name', coalesce(p.display_name, concat_ws(' ', p.first_name, p.last_name)),
      'email', p.email,
      'image_path', p.image_path,
      'created_at', p.created_at
    ),
    'details', jsonb_build_object(
      'distance', ad.distance,
      'duration', ad.duration,
      'location', ad.location
    )
  )
    into result
  from public.activities a
  left join public.activity_details ad
    on ad.activity_id = a.id
  join public.categories c
    on c.id = a.category_id
  join public.profiles p
    on p.id = a.user_id
  where a.user_id = p_user_id
  order by a.created_at desc, a.id desc
  limit 1;

  return coalesce(result, '{}'::jsonb);
end;
$$;


ALTER FUNCTION "public"."get_latest_activity"("p_user_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."messages_broadcast"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  perform realtime.broadcast_changes(
    'channel:' || NEW.room_id::text,
    'INSERT',
    'INSERT',
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    null
  );

  return null;
end;
$$;


ALTER FUNCTION "public"."messages_broadcast"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "display_name" "text",
    "user_id" "uuid" NOT NULL,
    "image_path" "text",
    "email" character varying NOT NULL,
    "last_name" "text",
    "first_name" "text",
    "about" "text",
    "gender" "public"."gender",
    "nationality" "text",
    "website" "text"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


ALTER TABLE "public"."profiles" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Profiles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."activities" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."activities_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."activity_details" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "category" "text" NOT NULL,
    "activity_id" bigint NOT NULL,
    "duration" bigint,
    "distance" bigint,
    "location" "text"
);


ALTER TABLE "public"."activity_details" OWNER TO "postgres";


ALTER TABLE "public"."activity_details" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."activity_details_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


ALTER TABLE "public"."categories" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."friend_requests" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sender_id" bigint NOT NULL,
    "receiver_id" bigint NOT NULL,
    "status" "public"."status" NOT NULL
);


ALTER TABLE "public"."friend_requests" OWNER TO "postgres";


ALTER TABLE "public"."friend_requests" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."friend_requests_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."friends" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" bigint NOT NULL,
    "friend_id" bigint NOT NULL
);


ALTER TABLE "public"."friends" OWNER TO "postgres";


ALTER TABLE "public"."friends" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."friends_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "room_id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "body" "text" NOT NULL
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


ALTER TABLE "public"."messages" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."room_user" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "room_id" bigint NOT NULL,
    "user_id" bigint NOT NULL
);


ALTER TABLE "public"."room_user" OWNER TO "postgres";


ALTER TABLE "public"."room_user" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."room_user_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."rooms" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "type" "text"
);


ALTER TABLE "public"."rooms" OWNER TO "postgres";


ALTER TABLE "public"."rooms" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."rooms_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "Profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."activities"
    ADD CONSTRAINT "activities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."activity_details"
    ADD CONSTRAINT "activity_details_activity_id_key" UNIQUE ("activity_id");



ALTER TABLE ONLY "public"."activity_details"
    ADD CONSTRAINT "activity_details_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."friend_requests"
    ADD CONSTRAINT "friend_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."room_user"
    ADD CONSTRAINT "room_user_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "rooms_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "handle_messages_insert" AFTER INSERT ON "public"."messages" FOR EACH ROW EXECUTE FUNCTION "public"."messages_broadcast"();



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "Profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."activities"
    ADD CONSTRAINT "activities_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."activities"
    ADD CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."activity_details"
    ADD CONSTRAINT "activity_details_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."activity_details"
    ADD CONSTRAINT "activity_details_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."categories"("name");



ALTER TABLE ONLY "public"."friend_requests"
    ADD CONSTRAINT "friend_requests_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friend_requests"
    ADD CONSTRAINT "friend_requests_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."room_user"
    ADD CONSTRAINT "room_user_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."room_user"
    ADD CONSTRAINT "room_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE "public"."activities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."activity_details" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "all" ON "public"."activities" USING (true) WITH CHECK (true);



CREATE POLICY "all" ON "public"."activity_details" USING (true) WITH CHECK (true);



CREATE POLICY "all" ON "public"."friend_requests" USING (true) WITH CHECK (true);



CREATE POLICY "all" ON "public"."friends" USING (true) WITH CHECK (true);



CREATE POLICY "all" ON "public"."messages" USING (true) WITH CHECK (true);



CREATE POLICY "all" ON "public"."profiles" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "all" ON "public"."room_user" USING (true) WITH CHECK (true);



CREATE POLICY "all" ON "public"."rooms" USING (true) WITH CHECK (true);



ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."friend_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."friends" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."room_user" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rooms" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "select" ON "public"."categories" FOR SELECT USING (true);





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."are_users_in_same_room"("user1_id" bigint, "user2_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."are_users_in_same_room"("user1_id" bigint, "user2_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."are_users_in_same_room"("user1_id" bigint, "user2_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_activity_total_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_activity_total_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_activity_total_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_activity_total_count"("p_user_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_activity_total_count"("p_user_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_activity_total_count"("p_user_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_dashboard_analytics"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_dashboard_analytics"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_dashboard_analytics"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_latest_activity"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_latest_activity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_latest_activity"() TO "service_role";



GRANT ALL ON TABLE "public"."activities" TO "anon";
GRANT ALL ON TABLE "public"."activities" TO "authenticated";
GRANT ALL ON TABLE "public"."activities" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_latest_activity"("p_user_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_latest_activity"("p_user_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_latest_activity"("p_user_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."messages_broadcast"() TO "anon";
GRANT ALL ON FUNCTION "public"."messages_broadcast"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."messages_broadcast"() TO "service_role";


















GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Profiles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Profiles_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."activities_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."activities_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."activities_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."activity_details" TO "anon";
GRANT ALL ON TABLE "public"."activity_details" TO "authenticated";
GRANT ALL ON TABLE "public"."activity_details" TO "service_role";



GRANT ALL ON SEQUENCE "public"."activity_details_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."activity_details_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."activity_details_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."friend_requests" TO "anon";
GRANT ALL ON TABLE "public"."friend_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."friend_requests" TO "service_role";



GRANT ALL ON SEQUENCE "public"."friend_requests_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."friend_requests_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."friend_requests_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."friends" TO "anon";
GRANT ALL ON TABLE "public"."friends" TO "authenticated";
GRANT ALL ON TABLE "public"."friends" TO "service_role";



GRANT ALL ON SEQUENCE "public"."friends_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."friends_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."friends_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."room_user" TO "anon";
GRANT ALL ON TABLE "public"."room_user" TO "authenticated";
GRANT ALL ON TABLE "public"."room_user" TO "service_role";



GRANT ALL ON SEQUENCE "public"."room_user_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."room_user_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."room_user_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."rooms" TO "anon";
GRANT ALL ON TABLE "public"."rooms" TO "authenticated";
GRANT ALL ON TABLE "public"."rooms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."rooms_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."rooms_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."rooms_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


  create policy "Authenticated users can receive broadcasts 2"
  on "realtime"."messages"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated users can receive broadcasts"
  on "realtime"."messages"
  as permissive
  for select
  to authenticated
using (true);



  create policy "room members can receive broadcasts"
  on "realtime"."messages"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM (public.room_user ru
     JOIN public.profiles pr ON ((ru.user_id = pr.id)))
  WHERE ((pr.user_id = auth.uid()) AND (ru.room_id = (replace(realtime.topic(), 'channel:'::text, ''::text))::bigint)))));



  create policy "Allow users all actions 1oj01fe_0"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'avatars'::text));



  create policy "Allow users all actions 1oj01fe_1"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'avatars'::text));



  create policy "Allow users all actions 1oj01fe_2"
  on "storage"."objects"
  as permissive
  for delete
  to public
using ((bucket_id = 'avatars'::text));



  create policy "Allow users all actions 1oj01fe_3"
  on "storage"."objects"
  as permissive
  for update
  to public
using ((bucket_id = 'avatars'::text));

