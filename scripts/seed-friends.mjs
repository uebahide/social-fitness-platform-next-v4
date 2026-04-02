import { createClient } from "@supabase/supabase-js";
import { seedFriendships } from "./seed-users-data.mjs";

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "http://127.0.0.1:54321";

const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.PUBLISHABLE_KEY;
const defaultPassword = process.env.SEED_USER_PASSWORD || "password";
const seedReaderEmail = "hidekazu.ueba@example.com";

if (!publishableKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required to seed friends.",
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

function toDirectedKey(userId, friendId) {
  return `${userId}:${friendId}`;
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

async function main() {
  const supabase = await signIn(seedReaderEmail);
  const requiredEmails = [
    ...new Set(
      seedFriendships.flatMap(({ userEmail, friendEmail }) => [
        userEmail,
        friendEmail,
      ]),
    ),
  ];

  console.log("requiredEmails", requiredEmails);

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email, display_name")
    .in("email", requiredEmails);

  if (profilesError) {
    throw profilesError;
  }

  console.log("profiles", profiles);

  const profilesByEmail = new Map(
    (profiles ?? []).map((profile) => [profile.email, profile]),
  );

  const missingEmails = requiredEmails.filter(
    (email) => !profilesByEmail.has(email),
  );

  if (missingEmails.length > 0) {
    throw new Error(
      `Missing seeded profiles for: ${missingEmails.join(", ")}. Run npm run seed:users first.`,
    );
  }

  const profileIds = [
    ...new Set((profiles ?? []).map((profile) => profile.id)),
  ];

  const { data: existingFriends, error: existingFriendsError } = await supabase
    .from("friends")
    .select("user_id, friend_id")
    .in("user_id", profileIds);

  if (existingFriendsError) {
    throw existingFriendsError;
  }

  const existingKeys = new Set(
    (existingFriends ?? []).map((friendship) =>
      toDirectedKey(friendship.user_id, friendship.friend_id),
    ),
  );

  const friendshipsToInsert = [];

  for (const { userEmail, friendEmail } of seedFriendships) {
    const userProfile = profilesByEmail.get(userEmail);
    const friendProfile = profilesByEmail.get(friendEmail);

    const directedPairs = [
      {
        user_id: userProfile.id,
        friend_id: friendProfile.id,
      },
      {
        user_id: friendProfile.id,
        friend_id: userProfile.id,
      },
    ];

    for (const pair of directedPairs) {
      const key = toDirectedKey(pair.user_id, pair.friend_id);

      if (existingKeys.has(key)) {
        continue;
      }

      existingKeys.add(key);
      friendshipsToInsert.push(pair);
    }
  }

  if (friendshipsToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("friends")
      .insert(friendshipsToInsert);

    if (insertError) {
      throw insertError;
    }
  }

  const hidekazuEmail = "hidekazu.ueba@example.com";
  const hidekazuProfile = profilesByEmail.get(hidekazuEmail);
  const hidekazuFriendCount = seedFriendships.filter(
    ({ userEmail, friendEmail }) =>
      userEmail === hidekazuEmail || friendEmail === hidekazuEmail,
  ).length;

  console.table(
    seedFriendships.map(({ userEmail, friendEmail }) => {
      const userProfile = profilesByEmail.get(userEmail);
      const friendProfile = profilesByEmail.get(friendEmail);

      return {
        user: userProfile.display_name,
        friend: friendProfile.display_name,
      };
    }),
  );

  console.log(
    `Seeded ${seedFriendships.length} undirected friendships (${friendshipsToInsert.length} rows inserted).`,
  );
  console.log(
    `Hidekazu Ueba now has ${hidekazuFriendCount} seeded friends (profile id: ${hidekazuProfile.id}).`,
  );

  await supabase.auth.signOut();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
