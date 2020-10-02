const fs = require("fs");
const https = require("https");
const zlib = require("zlib");
const platformClient = require("purecloud-platform-client-v2");

const clientId = "xxxxxxxx";
const clientSecret = "xxxxxxxx";

const errorHandler = (context, err) =>
  console.log("Error: " + context + ": ", err);

const client = platformClient.ApiClient.instance;
client.setEnvironment("mypurecloud.com");
client.setPersistSettings(true, "test_app");
const outboundApi = new platformClient.OutboundApi();
const contactListId = "381419cf-63dc-45c4-95da-f14c5c44837b";

client
  .loginClientCredentialsGrant(clientId, clientSecret)
  .then(() => {
    let opts = {
      download: "false", // String | Redirect to download uri
    };

    outboundApi
      .getOutboundContactlistExport(contactListId, opts)
      .then((data) => {
        console.log(
          `getOutboundContactlistExport success! data: ${JSON.stringify(
            data,
            null,
            2
          )}`
        );
      });
  })
  .catch((err) => errorHandler("loginClientCredentialsGrant", err));
