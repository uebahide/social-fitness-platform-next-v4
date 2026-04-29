import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { actors, scenarios } from "../tests/e2e/data/scenarios.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "http://127.0.0.1:54321";

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SECRET_KEY;

const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.PUBLISHABLE_KEY;

const defaultPassword = process.env.SEED_USER_PASSWORD || "password";

if (!publishableKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or PUBLISHABLE_KEY is required.",
  );
}

if (!serviceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY, SERVICE_ROLE_KEY, SUPABASE_SECRET_KEY, or SECRET_KEY is required.",
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
  return createClient(supabaseUrl, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

async function signInAsActor(actorKey) {
  const actor = actors[actorKey];

  if (!actor) {
    throw new Error(`Unknown actor key: ${actorKey}`);
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: actor.email,
    password: defaultPassword,
  });

  if (error || !data.user) {
    throw error ?? new Error(`Could not sign in as ${actor.email}`);
  }

  return supabase;
}

function unique(values) {
  return [...new Set(values)];
}

function pairKey(leftId, rightId) {
  return `${leftId}:${rightId}`;
}

function scenarioBaseTime(scenarioKey) {
  const base = Date.UTC(2026, 0, 1, 9, 0, 0);
  let hash = 0;

  for (const char of scenarioKey) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return base + hash * 1000;
}

function collectReferencedActorKeys() {
  const keys = [];

  for (const scenario of Object.values(scenarios)) {
    keys.push(scenario.actor);

    if (scenario.friend) {
      keys.push(scenario.friend);
    }

    for (const message of scenario.room?.messages ?? []) {
      keys.push(message.sender);
    }

    for (const notification of scenario.notification ?? []) {
      keys.push(notification.sender);
    }
  }

  return unique(keys);
}

async function loadProfilesByActorKey(supabase) {
  const actorKeys = collectReferencedActorKeys();
  const emails = actorKeys.map((actorKey) => actors[actorKey].email);

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, display_name")
    .in("email", emails);

  if (error) {
    throw error;
  }

  const profilesByEmail = new Map(
    (data ?? []).map((profile) => [profile.email, profile]),
  );

  const profilesByActorKey = new Map();

  for (const actorKey of actorKeys) {
    const actor = actors[actorKey];
    const profile = profilesByEmail.get(actor.email);

    if (!profile) {
      throw new Error(
        `Missing profile for ${actorKey} (${actor.email}). Run npm run seed:users first.`,
      );
    }

    profilesByActorKey.set(actorKey, profile);
  }

  return profilesByActorKey;
}

async function ensureFriendship(supabase, leftProfileId, rightProfileId) {
  const { data, error } = await supabase
    .from("friends")
    .select("user_id, friend_id")
    .in("user_id", [leftProfileId, rightProfileId]);

  if (error) {
    throw error;
  }

  const existing = new Set(
    (data ?? []).map((row) => pairKey(row.user_id, row.friend_id)),
  );

  const rows = [];

  if (!existing.has(pairKey(leftProfileId, rightProfileId))) {
    rows.push({
      user_id: leftProfileId,
      friend_id: rightProfileId,
    });
  }

  if (!existing.has(pairKey(rightProfileId, leftProfileId))) {
    rows.push({
      user_id: rightProfileId,
      friend_id: leftProfileId,
    });
  }

  if (rows.length === 0) {
    return;
  }

  const { error: insertError } = await supabase.from("friends").insert(rows);

  if (insertError) {
    throw insertError;
  }
}

async function getOrCreatePrivateRoomId(
  actorKey,
  leftProfileId,
  rightProfileId,
) {
  const supabase = await signInAsActor(actorKey);

  try {
    const { data, error } = await supabase.rpc("get_or_create_private_room", {
      user1_id: leftProfileId,
      user2_id: rightProfileId,
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error(
        `Could not resolve private room for ${leftProfileId} and ${rightProfileId}.`,
      );
    }

    return data;
  } finally {
    await supabase.auth.signOut();
  }
}

async function clearRoomState(supabase, roomId) {
  const { error: deleteNotificationsError } = await supabase
    .from("notifications")
    .delete()
    .eq("room_id", roomId);

  if (deleteNotificationsError) {
    throw deleteNotificationsError;
  }

  const { error: deleteMessagesError } = await supabase
    .from("messages")
    .delete()
    .eq("room_id", roomId);

  if (deleteMessagesError) {
    throw deleteMessagesError;
  }

  const { error: resetReadStateError } = await supabase
    .from("room_user")
    .update({ last_read_message_id: null })
    .eq("room_id", roomId);

  if (resetReadStateError) {
    throw resetReadStateError;
  }
}

async function insertScenarioMessages(
  supabase,
  scenarioKey,
  roomId,
  messages,
  profilesByActorKey,
) {
  if (!messages || messages.length === 0) {
    return [];
  }

  const baseTime = scenarioBaseTime(scenarioKey);

  const rows = messages.map((message, index) => {
    const senderProfile = profilesByActorKey.get(message.sender);

    if (!senderProfile) {
      throw new Error(`Unknown sender actor key: ${message.sender}`);
    }

    return {
      body: message.type === "text" ? (message.body ?? "") : "",
      room_id: roomId,
      user_id: senderProfile.id,
      type: message.type,
      image_path:
        message.type === "image"
          ? `messages/e2e/${scenarioKey.replaceAll(".", "-")}-${index + 1}.png`
          : null,
      created_at: new Date(baseTime + index * 60_000).toISOString(),
    };
  });

  const { data, error } = await supabase
    .from("messages")
    .insert(rows)
    .select("id, room_id, user_id, body, type, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function markRoomFullyRead(supabase, roomId, lastMessageId) {
  if (!lastMessageId) {
    return;
  }

  const { error } = await supabase
    .from("room_user")
    .update({ last_read_message_id: lastMessageId })
    .eq("room_id", roomId);

  if (error) {
    throw error;
  }
}

async function seedScenario(
  supabase,
  scenarioKey,
  scenario,
  profilesByActorKey,
) {
  const actorProfile = profilesByActorKey.get(scenario.actor);

  if (!actorProfile) {
    throw new Error(`Unknown actor key: ${scenario.actor}`);
  }

  const resolved = {
    actorProfileId: actorProfile.id,
    friendProfileId: null,
    roomId: null,
    messageIds: [],
  };

  if (!scenario.friend) {
    return resolved;
  }

  const friendProfile = profilesByActorKey.get(scenario.friend);

  if (!friendProfile) {
    throw new Error(`Unknown friend key: ${scenario.friend}`);
  }

  resolved.friendProfileId = friendProfile.id;

  if (scenario.friendship) {
    await ensureFriendship(supabase, actorProfile.id, friendProfile.id);
  }

  if (!scenario.room?.exists) {
    return resolved;
  }

  const roomId = await getOrCreatePrivateRoomId(
    scenario.actor,
    actorProfile.id,
    friendProfile.id,
  );

  resolved.roomId = roomId;

  await clearRoomState(supabase, roomId);

  const createdMessages = await insertScenarioMessages(
    supabase,
    scenarioKey,
    roomId,
    scenario.room.messages,
    profilesByActorKey,
  );

  resolved.messageIds = createdMessages.map((message) => message.id);

  const latestMessageId =
    createdMessages.length > 0
      ? createdMessages[createdMessages.length - 1].id
      : null;

  await markRoomFullyRead(supabase, roomId, latestMessageId);

  return resolved;
}

async function writeManifest(manifest) {
  const outputDir = path.resolve(__dirname, "../tests/e2e/generated");
  const outputPath = path.join(outputDir, "scenario-manifest.json");

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(manifest, null, 2), "utf8");

  return outputPath;
}

async function main() {
  const supabase = createAdminClient();
  const profilesByActorKey = await loadProfilesByActorKey(supabase);
  const manifest = {};

  for (const [scenarioKey, scenario] of Object.entries(scenarios)) {
    const resolved = await seedScenario(
      supabase,
      scenarioKey,
      scenario,
      profilesByActorKey,
    );

    manifest[scenarioKey] = resolved;
  }

  const manifestPath = await writeManifest(manifest);

  console.table(
    Object.entries(manifest).map(([scenarioKey, resolved]) => ({
      scenario: scenarioKey,
      actorProfileId: resolved.actorProfileId,
      friendProfileId: resolved.friendProfileId,
      roomId: resolved.roomId,
      messageCount: resolved.messageIds.length,
    })),
  );

  console.log(`Wrote scenario manifest to ${manifestPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
