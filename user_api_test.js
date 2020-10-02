const platformClient = require("purecloud-platform-client-v2");

const clientId = "xxxxxxxx";
const clientSecret = "xxxxxxxx";

const errorHandler = (err) => console.log("Error: " + err);

const client = platformClient.ApiClient.instance;
client.setEnvironment("mypurecloud.com");
client.setPersistSettings(true, "test_app");

var apiInstance = new platformClient.UsersApi();

var newuser = {
  name: "Tutorial Test User",
  email: "tutorial378@example.com",
  password: "testuser",
};

client
  .loginClientCredentialsGrant(clientId, clientSecret)
  .then(() => {
    apiInstance
      .postUsers(newuser)
      .then(function (currentuser) {
        console.log(currentuser.id);
        var updateUser = {
          version: currentuser.version,
          name: "Tutorial User New Name",
          addresses: [
            {
              address: "3172222222",
              mediaType: "PHONE",
              type: "WORK",
            },
          ],
        };

        apiInstance.patchUser(currentuser.id, updateUser).catch(function (err) {
          console.error(err);
        });
      })
      .catch(function (err) {
        console.error(err);
      });
  })
  .catch((err) => {
    console.log("Authentication error: " + err);
  });
