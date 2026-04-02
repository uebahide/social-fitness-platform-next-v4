import { createClient } from "@supabase/supabase-js";
import { seedUsers as users } from "./seed-users-data.mjs";

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "http://127.0.0.1:54321";

const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.PUBLISHABLE_KEY;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SECRET_KEY;
const defaultPassword = process.env.SEED_USER_PASSWORD || "password";

if (!serviceRoleKey) {
  throw new Error(
    "SUPABASE_SECRET_KEY, SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY, or SERVICE_ROLE_KEY is required to seed users.",
  );
}

function createAdminClient() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

function createPublicClient() {
  if (!publishableKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or PUBLISHABLE_KEY is required for public auth fallback.",
    );
  }

  return createClient(supabaseUrl, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

async function ensureAuthUserWithAdminClient(supabase, user) {
  const { data: listedUsers, error: listUsersError } =
    await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

  if (listUsersError) {
    throw listUsersError;
  }

  const existingUser = listedUsers.users.find(
    (authUser) => authUser.email?.toLowerCase() === user.email.toLowerCase(),
  );

  const userPayload = {
    email: user.email,
    password: defaultPassword,
    email_confirm: true,
    user_metadata: {
      first_name: user.firstName,
      last_name: user.lastName,
      display_name: user.displayName,
    },
  };

  if (!existingUser) {
    const { data: createdUserData, error: createUserError } =
      await supabase.auth.admin.createUser(userPayload);

    if (createUserError || !createdUserData.user) {
      throw createUserError ?? new Error(`Could not create ${user.email}`);
    }

    return {
      authUser: createdUserData.user,
      authStatus: "created",
    };
  }

  const { data: updatedUserData, error: updateUserError } =
    await supabase.auth.admin.updateUserById(existingUser.id, userPayload);

  if (updateUserError || !updatedUserData.user) {
    throw updateUserError ?? new Error(`Could not update ${user.email}`);
  }

  return {
    authUser: updatedUserData.user,
    authStatus: "existing",
  };
}

async function ensureAuthUserWithPublicClient(user) {
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

  await supabase.auth.signOut();

  return {
    authUser: signInData.user,
    authStatus: "existing",
  };
}

async function ensureAuthUser(adminSupabase, user) {
  try {
    return await ensureAuthUserWithAdminClient(adminSupabase, user);
  } catch (error) {
    const isBadJwt =
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "bad_jwt";

    if (!isBadJwt) {
      throw error;
    }

    return await ensureAuthUserWithPublicClient(user);
  }
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
  const supabase = createAdminClient();
  const results = [];

  for (const user of users) {
    const { authUser, authStatus } = await ensureAuthUser(supabase, user);
    const profileStatus = await ensureProfile(supabase, authUser.id, user);

    results.push({
      email: user.email,
      authStatus,
      confirmed: Boolean(authUser.email_confirmed_at),
      profileStatus,
    });
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
