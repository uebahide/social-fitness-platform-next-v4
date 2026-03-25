import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "http://127.0.0.1:54321";

const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.PUBLISHABLE_KEY;
const defaultPassword = process.env.SEED_USER_PASSWORD || "password";

if (!publishableKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required to seed local users.",
  );
}

const users = [
  ["Hidekazu", "Ueba"],
  ["Alex", "Walker"],
  ["Mia", "Summers"],
  ["Noah", "Brooks"],
  ["Emma", "Parker"],
  ["Liam", "Reed"],
  ["Sofia", "Hayes"],
  ["Ethan", "Foster"],
  ["Ava", "Morris"],
  ["Lucas", "Bennett"],
  ["Harper", "Cole"],
  ["Mason", "Price"],
  ["Isla", "Ward"],
  ["Logan", "Powell"],
  ["Chloe", "Diaz"],
  ["Elijah", "Russell"],
  ["Grace", "Long"],
  ["James", "Kelly"],
  ["Lily", "Cooper"],
  ["Benjamin", "Bailey"],
  ["Zoe", "Rivera"],
].map(([firstName, lastName], index) => {
  const emailLocalPart = `${firstName}_${lastName}`
    .toLowerCase()
    .replace(/[^a-z_]/g, "");
  const email = `${emailLocalPart}@example.com`;

  return {
    email,
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`,
  };
});

function createPublicClient() {
  return createClient(supabaseUrl, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

async function ensureSignedInUser(user) {
  const supabase = createPublicClient();

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: user.email,
    password: defaultPassword,
    options: {
      data: {
        first_name: user.firstName,
        last_name: user.lastName,
        display_name: user.displayName,
      },
    },
  });

  if (!signUpError && signUpData.user) {
    return {
      supabase,
      authUser: signUpData.user,
      authStatus: "created",
    };
  }

  const alreadyExists =
    signUpError?.message?.toLowerCase().includes("already") ||
    signUpError?.message?.toLowerCase().includes("registered");

  if (!alreadyExists) {
    throw signUpError;
  }

  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: user.email,
      password: defaultPassword,
    });

  if (signInError || !signInData.user) {
    throw signInError ?? new Error(`Could not sign in ${user.email}`);
  }

  return {
    supabase,
    authUser: signInData.user,
    authStatus: "existing",
  };
}

async function ensureProfile(supabase, userId, user) {
  const { data: existingProfiles, error: selectError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .limit(1);

  if (selectError) {
    throw selectError;
  }

  const profilePayload = {
    user_id: userId,
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    display_name: user.displayName,
  };

  if (existingProfiles.length === 0) {
    const { error: insertError } = await supabase
      .from("profiles")
      .insert(profilePayload);

    if (insertError) {
      throw insertError;
    }

    return "created";
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(profilePayload)
    .eq("id", existingProfiles[0].id);

  if (updateError) {
    throw updateError;
  }

  return "updated";
}

async function main() {
  const results = [];

  for (const user of users) {
    const { supabase, authUser, authStatus } = await ensureSignedInUser(user);
    const profileStatus = await ensureProfile(supabase, authUser.id, user);

    results.push({
      email: user.email,
      authStatus,
      confirmed: Boolean(authUser.email_confirmed_at),
      profileStatus,
    });

    await supabase.auth.signOut();
  }

  console.table(results);
  console.log(
    `Seeded ${users.length} users. Shared password: ${defaultPassword}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
