const names = [
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
];

function toEmailLocalPart(firstName, lastName) {
  return `${firstName}_${lastName}`.toLowerCase().replace(/[^a-z_]/g, "");
}

export const seedUsers = names.map(([firstName, lastName]) => {
  const emailLocalPart = toEmailLocalPart(firstName, lastName);

  return {
    email: `${emailLocalPart}@example.com`,
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`,
  };
});

const seededLocalParts = new Set(
  seedUsers.map((user) => user.email.replace("@example.com", "")),
);

const friendshipPairs = [
  ["hidekazu_ueba", "alex_walker"],
  ["hidekazu_ueba", "mia_summers"],
  ["hidekazu_ueba", "noah_brooks"],
  ["hidekazu_ueba", "emma_parker"],
  ["hidekazu_ueba", "liam_reed"],
  ["hidekazu_ueba", "sofia_hayes"],
  ["hidekazu_ueba", "ethan_foster"],
  ["hidekazu_ueba", "ava_morris"],
  ["hidekazu_ueba", "lucas_bennett"],
  ["hidekazu_ueba", "harper_cole"],
  ["alex_walker", "mia_summers"],
  ["noah_brooks", "emma_parker"],
  ["liam_reed", "sofia_hayes"],
  ["ethan_foster", "ava_morris"],
  ["lucas_bennett", "harper_cole"],
  ["mason_price", "isla_ward"],
  ["logan_powell", "chloe_diaz"],
  ["elijah_russell", "grace_long"],
  ["james_kelly", "lily_cooper"],
  ["benjamin_bailey", "zoe_rivera"],
];

const seenFriendshipKeys = new Set();

export const seedFriendships = friendshipPairs.map(
  ([leftLocalPart, rightLocalPart]) => {
    if (!seededLocalParts.has(leftLocalPart)) {
      throw new Error(`Unknown seeded user in friendship pair: ${leftLocalPart}`);
    }

    if (!seededLocalParts.has(rightLocalPart)) {
      throw new Error(`Unknown seeded user in friendship pair: ${rightLocalPart}`);
    }

    if (leftLocalPart === rightLocalPart) {
      throw new Error(`Friendship pair cannot reference the same user: ${leftLocalPart}`);
    }

    const canonicalKey = [leftLocalPart, rightLocalPart].sort().join(":");

    if (seenFriendshipKeys.has(canonicalKey)) {
      throw new Error(`Duplicate friendship pair found: ${canonicalKey}`);
    }

    seenFriendshipKeys.add(canonicalKey);

    return {
      userEmail: `${leftLocalPart}@example.com`,
      friendEmail: `${rightLocalPart}@example.com`,
    };
  },
);

const hidekazuFriendships = seedFriendships.filter(
  ({ userEmail, friendEmail }) =>
    userEmail === "hidekazu_ueba@example.com" ||
    friendEmail === "hidekazu_ueba@example.com",
);

if (hidekazuFriendships.length < 10) {
  throw new Error(
    `hidekazu_ueba@example.com must have at least 10 seeded friends, found ${hidekazuFriendships.length}.`,
  );
}
