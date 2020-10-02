const fs = require("fs");

const predicateDimensionT = {
  type: "dimension",
  dimension: "userId",
  operator: "matches"
};

const queueUsersData = fs.readFileSync("users.json");
const queueUsers = JSON.parse(queueUsersData);

const predicates = queueUsers.entities.reduce((predicates, user) => {
  let userDimesion = Object.assign({}, predicateDimensionT);
  userDimesion.value = user.id;
  predicates.push(userDimesion);
  return predicates;
}, []);

console.log(predicates);

const query = {
  interval: "2020-01-15T13:00:00.000Z/2020-01-15T18:00:00.000Z",
  groupBy: ["userId"],
  filter: {
    type: "or",
    predicates: predicates
  },
  metrics: ["tAgentRoutingStatus", "tSystemPresence"]
};

fs.writeFileSync("usersQuery.json", JSON.stringify(query));
