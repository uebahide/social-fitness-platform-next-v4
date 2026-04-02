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
  ["Empty", "Friends"],
  ["Empty", "Messages"],
];

function toEmailLocalPart(firstName, lastName) {
  return `${firstName}.${lastName}`.toLowerCase().replace(/[^a-z.]/g, "");
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
  ["hidekazu.ueba", "empty.messages"], // hidekazu.ueba has no messages
  ["hidekazu.ueba", "alex.walker"],
  ["hidekazu.ueba", "mia.summers"],
  ["hidekazu.ueba", "noah.brooks"],
  ["hidekazu.ueba", "emma.parker"],
  ["hidekazu.ueba", "liam.reed"],
  ["hidekazu.ueba", "sofia.hayes"],
  ["hidekazu.ueba", "ethan.foster"],
  ["hidekazu.ueba", "ava.morris"],
  ["hidekazu.ueba", "lucas.bennett"],
  ["hidekazu.ueba", "harper.cole"],
  ["alex.walker", "mia.summers"],
  ["noah.brooks", "emma.parker"],
  ["liam.reed", "sofia.hayes"],
  ["ethan.foster", "ava.morris"],
  ["lucas.bennett", "harper.cole"],
  ["mason.price", "isla.ward"],
  ["logan.powell", "chloe.diaz"],
  ["elijah.russell", "grace.long"],
  ["james.kelly", "lily.cooper"],
  ["benjamin.bailey", "zoe.rivera"],
];

const seenFriendshipKeys = new Set();

export const seedFriendships = friendshipPairs.map(
  ([leftLocalPart, rightLocalPart]) => {
    if (!seededLocalParts.has(leftLocalPart)) {
      throw new Error(
        `Unknown seeded user in friendship pair: ${leftLocalPart}`,
      );
    }

    if (!seededLocalParts.has(rightLocalPart)) {
      throw new Error(
        `Unknown seeded user in friendship pair: ${rightLocalPart}`,
      );
    }

    if (leftLocalPart === rightLocalPart) {
      throw new Error(
        `Friendship pair cannot reference the same user: ${leftLocalPart}`,
      );
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
    userEmail === "hidekazu.ueba@example.com" ||
    friendEmail === "hidekazu.ueba@example.com",
);

if (hidekazuFriendships.length < 10) {
  throw new Error(
    `hidekazu.ueba@example.com must have at least 10 seeded friends, found ${hidekazuFriendships.length}.`,
  );
}
