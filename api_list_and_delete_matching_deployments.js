const platformClient = require("purecloud-platform-client-v2");

const clientId = "xxxxxxxx";
const clientSecret = "xxxxxxxx";

const errorHandler = (err) => console.log("Error: " + err);

const client = platformClient.ApiClient.instance;
client.setEnvironment("mypurecloud.com");
client.setPersistSettings(true, "test_app");

const widgetsApi = new platformClient.WidgetsApi();

client
  .loginClientCredentialsGrant(clientId, clientSecret)
  .then(() => {
    widgetsApi
      .getWidgetsDeployments()
      .then((deployments) => {
        const devToolsDeployments = deployments.entities.filter(
          (depl) => depl.name === "Developer Tools"
        );

        devToolsDeployments.forEach((depl) => {
          console.log("Deleting deployment: ", depl);
          //widgetsApi.deleteWidgetsDeployment(depl.id);
        });
      })
      .catch(errorHandler);
  })
  .catch(errorHandler);
