import { createClient } from "@supabase/supabase-js";
import { seedUsers } from "./seed-users-data.mjs";

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "http://127.0.0.1:54321";

const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.PUBLISHABLE_KEY;
const defaultPassword = process.env.SEED_USER_PASSWORD || "password";
const activitiesPerUser = 50;

if (!publishableKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required to seed activities.",
  );
}

function createPublicClient() {
  return createClient(supabaseUrl, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

function hashString(value) {
  let hash = 0;

  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash || 1;
}

function createRng(seedValue) {
  let seed = seedValue >>> 0;

  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function randomBetween(rng, min, max, digits = 1) {
  const factor = 10 ** digits;
  const value = min + (max - min) * rng();
  return Math.round(value * factor) / factor;
}

function intBetween(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function shiftDate(date, daysAgo, hour) {
  const shifted = new Date(date);
  shifted.setUTCDate(shifted.getUTCDate() - daysAgo);
  shifted.setUTCHours(hour, intBetween(createRng(daysAgo + hour), 0, 59), 0, 0);
  return shifted.toISOString();
}

const hikingLocations = [
  "Takao Trail",
  "Mount Rokko",
  "Lake District Loop",
  "Blue Ridge Ridgeway",
  "Hakone Old Tokaido",
  "Cotswold Way",
  "Peak District Circuit",
  "Yatsugatake Trail",
];

function buildRunningEntry(rng, createdAt) {
  const distance = intBetween(rng, 5, 14);
  const pace = randomBetween(rng, 5.0, 6.4, 2);
  const duration = Math.round(distance * pace);
  const variants = [
    ["Morning tempo run", "Held a steady effort and finished feeling smooth."],
    [
      "Easy evening run",
      "Kept the pace comfortable and focused on relaxed form.",
    ],
    [
      "Riverside progression run",
      "Started easy and picked it up over the final kilometers.",
    ],
    [
      "Lunch break run",
      "Shorter outing to keep the legs fresh during the day.",
    ],
  ];
  const [title, description] =
    variants[intBetween(rng, 0, variants.length - 1)];

  return {
    activity: {
      title,
      description,
      created_at: createdAt,
    },
    details: {
      category: "running",
      distance,
      duration,
      created_at: createdAt,
    },
  };
}

function buildWalkingEntry(rng, createdAt) {
  const distance = intBetween(rng, 3, 8);
  const pace = randomBetween(rng, 10.5, 14.0, 2);
  const duration = Math.round(distance * pace);
  const variants = [
    [
      "Evening walk",
      "Used this as a light recovery session and to get extra steps in.",
    ],
    [
      "Park walk",
      "Kept it easy and consistent with a relaxed pace throughout.",
    ],
    ["Neighborhood walk", "Nice low-intensity outing to reset after work."],
    ["Sunset walk", "Comfortable walk with a few small hills mixed in."],
  ];
  const [title, description] =
    variants[intBetween(rng, 0, variants.length - 1)];

  return {
    activity: {
      title,
      description,
      created_at: createdAt,
    },
    details: {
      category: "walking",
      distance,
      duration,
      created_at: createdAt,
    },
  };
}

function buildCyclingEntry(rng, createdAt) {
  const distance = intBetween(rng, 15, 68);
  const speed = randomBetween(rng, 21, 29, 2);
  const duration = Math.round((distance / speed) * 60);
  const variants = [
    [
      "Weekend ride",
      "Mostly steady riding with a few stronger efforts on open roads.",
    ],
    ["Endurance ride", "Focused on smooth cadence and steady aerobic work."],
    [
      "After-work spin",
      "Kept the effort controlled with a few rolling climbs.",
    ],
    [
      "Long bike ride",
      "Good endurance session with a comfortable overall pace.",
    ],
  ];
  const [title, description] =
    variants[intBetween(rng, 0, variants.length - 1)];

  return {
    activity: {
      title,
      description,
      created_at: createdAt,
    },
    details: {
      category: "cycling",
      distance,
      duration,
      created_at: createdAt,
    },
  };
}

function buildSwimmingEntry(rng, createdAt) {
  const distance = intBetween(rng, 1, 3);
  const pacePerKm = randomBetween(rng, 24, 34, 2);
  const duration = Math.round(distance * pacePerKm);
  const variants = [
    ["Pool session", "Mixed steady laps with short rest between sets."],
    [
      "Technique swim",
      "Focused on relaxed breathing and clean form in the water.",
    ],
    ["Endurance swim", "Longer continuous effort with even pacing."],
    ["Recovery swim", "Easy session to loosen up without much impact."],
  ];
  const [title, description] =
    variants[intBetween(rng, 0, variants.length - 1)];

  return {
    activity: {
      title,
      description,
      created_at: createdAt,
    },
    details: {
      category: "swimming",
      distance,
      duration,
      created_at: createdAt,
    },
  };
}

function buildHikingEntry(rng, createdAt) {
  const distance = intBetween(rng, 6, 17);
  const pace = randomBetween(rng, 12.5, 20.0, 2);
  const duration = Math.round(distance * pace);
  const location =
    hikingLocations[intBetween(rng, 0, hikingLocations.length - 1)];
  const variants = [
    [
      "Day hike",
      "Longer outing with a few climbs and plenty of steady hiking.",
    ],
    [
      "Trail hike",
      "Kept a sustainable pace and took in a good amount of elevation.",
    ],
    [
      "Weekend hike",
      "Comfortable trail day with a mix of flats and uphill sections.",
    ],
    [
      "Scenic hike",
      "Solid hiking session with a few stops for views along the route.",
    ],
  ];
  const [title, description] =
    variants[intBetween(rng, 0, variants.length - 1)];

  return {
    activity: {
      title,
      description,
      created_at: createdAt,
    },
    details: {
      category: "hiking",
      distance,
      duration,
      location,
      created_at: createdAt,
    },
  };
}

const builders = {
  running: buildRunningEntry,
  walking: buildWalkingEntry,
  cycling: buildCyclingEntry,
  swimming: buildSwimmingEntry,
  hiking: buildHikingEntry,
};

function buildActivityPlan(profile) {
  const rng = createRng(hashString(profile.email));
  const now = new Date();
  const categories = [
    "running",
    "running",
    "walking",
    "cycling",
    "running",
    "running",
    "walking",
    "cycling",
    "hiking",
    "running",
    "walking",
    "running",
    "cycling",
    "hiking",
    "running",
    "walking",
    "cycling",
    "running",
    "running",
    "cycling",
    "hiking",
    "walking",
    "running",
    "running",
    "walking",
    "cycling",
    "running",
    "running",
    "running",
    "walking",
    "cycling",
    "running",
    "running",
    "walking",
    "running",
    "running",
    "running",
    "cycling",
    "running",
    "running",
    "walking",
    "running",
    "running",
  ];

  let daysAgo = intBetween(rng, 2, 5);

  return categories.map((category, index) => {
    if (index > 0) {
      daysAgo += intBetween(rng, 2, 8);
    }

    const createdAt = shiftDate(now, daysAgo, intBetween(rng, 6, 20));
    return builders[category](rng, createdAt);
  });
}

async function fetchCategoriesByName() {
  const supabase = createPublicClient();
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name");

  if (categoriesError) {
    throw categoriesError;
  }

  return new Map(categories.map((category) => [category.name, category.id]));
}

async function signIn(email) {
  const supabase = createPublicClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: defaultPassword,
  });

  if (error || !data.user) {
    throw error ?? new Error(`Could not sign in ${email}`);
  }

  return supabase;
}

async function getCurrentProfile(supabase, email) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name, display_name")
    .eq("email", email)
    .limit(1)
    .single();

  if (error || !profile) {
    throw error ?? new Error(`Could not fetch profile for ${email}`);
  }

  return profile;
}

async function seedActivitiesForProfile(supabase, profile, categoriesByName) {
  const { count, error: countError } = await supabase
    .from("activities")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id);

  if (countError) {
    throw countError;
  }

  if ((count ?? 0) >= activitiesPerUser) {
    return {
      email: profile.email,
      status: "skipped",
      reason: `already has ${count} activities`,
    };
  }

  const existingCount = count ?? 0;
  const plan = buildActivityPlan(profile).slice(
    existingCount,
    activitiesPerUser,
  );

  for (const item of plan) {
    const categoryId = categoriesByName.get(item.details.category);

    if (!categoryId) {
      throw new Error(`Missing category: ${item.details.category}`);
    }

    const { data: activity, error: activityError } = await supabase
      .from("activities")
      .insert({
        title: item.activity.title,
        description: item.activity.description,
        category_id: categoryId,
        user_id: profile.id,
        created_at: item.activity.created_at,
      })
      .select("id")
      .single();

    if (activityError) {
      throw activityError;
    }

    const { error: detailsError } = await supabase
      .from("activity_details")
      .insert({
        activity_id: activity.id,
        category: item.details.category,
        distance: item.details.distance,
        duration: item.details.duration,
        location: item.details.location ?? null,
        created_at: item.details.created_at,
      });

    if (detailsError) {
      throw detailsError;
    }
  }

  return {
    email: profile.email,
    status: "seeded",
    reason: `${plan.length} activities added`,
  };
}

async function main() {
  const categoriesByName = await fetchCategoriesByName();
  const results = [];

  for (const user of seedUsers) {
    try {
      const signedInSupabase = await signIn(user.email);
      const profile = await getCurrentProfile(signedInSupabase, user.email);
      const result = await seedActivitiesForProfile(
        signedInSupabase,
        profile,
        categoriesByName,
      );
      results.push(result);
      await signedInSupabase.auth.signOut();
    } catch (error) {
      results.push({
        email: user.email,
        status: "failed",
        reason: serializeError(error),
      });
    }
  }

  console.table(results);
  console.log(`Processed ${seedUsers.length} profiles.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

function serializeError(error) {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const message =
      "message" in error && typeof error.message === "string"
        ? error.message
        : JSON.stringify(error);
    const details =
      "details" in error && typeof error.details === "string"
        ? ` (${error.details})`
        : "";

    return `${message}${details}`;
  }

  return String(error);
}
