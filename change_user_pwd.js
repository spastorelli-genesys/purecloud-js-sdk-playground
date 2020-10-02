const { authenticate, platformClient } = require("./common");

const logError = (err) => console.log(err);
const usersApi = new platformClient.UsersApi();
authenticate()
  .then(() => {
    usersApi
      .postUserPassword("e20d4c7a-e9de-4577-a556-a98f50b459e0", {
        newPassword: ".........",
      })
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => console.error(err));
  })
  .catch((err) => logError(err));
