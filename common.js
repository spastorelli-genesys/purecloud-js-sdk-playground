const platformClient = require("purecloud-platform-client-v2");

const clientId = "xxxxxxxx";
const clientSecret = "xxxxxxxx";

const client = platformClient.ApiClient.instance;
client.setEnvironment("mypurecloud.com");
client.setPersistSettings(true, "test_app");

exports.platformClient = platformClient;
exports.authenticate = async function authenticate() {
  try {
    const { accessToken } = await client.loginClientCredentialsGrant(
      clientId,
      clientSecret
    );
    return { client, accessToken };
  } catch (err) {
    console.log("Error: " + err);
  }
};
