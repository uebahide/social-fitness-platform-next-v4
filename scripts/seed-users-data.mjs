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

export const seedUsers = names.map(([firstName, lastName]) => {
  const emailLocalPart = `${firstName}_${lastName}`
    .toLowerCase()
    .replace(/[^a-z_]/g, "");

  return {
    email: `${emailLocalPart}@example.com`,
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`,
  };
});
