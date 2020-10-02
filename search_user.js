const { authenticate, platformClient } = require("./common");

const logError = (err) => console.log(err);
const usersApi = new platformClient.UsersApi();
authenticate()
  .then(() => {
    usersApi
      .postUsersSearch({
        query: [
          {
            fields: ["email"],
            value: "steeve.pastorelli@genesys.com",
            type: "EXACT",
          },
        ],
      })
      .then((resp) => {
        resp.results.forEach((user) => console.log(user));
      })
      .catch((err) => console.error(err));
  })
  .catch((err) => logError(err));
