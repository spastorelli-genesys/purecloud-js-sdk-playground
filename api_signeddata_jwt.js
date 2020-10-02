const { authenticate } = require("./common");
const request = require("request");

authenticate().then(({ accessToken }) => {
  request.post(
    "https://api.mypurecloud.com/api/v2/signeddata",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      json: {
        AccountId: "12345"
      }
    },
    (error, response, body) => {
      if (error) {
        console.error(error);
        return;
      }

      console.log("Headers:");
      console.log(response.headers);
      console.log("\n");
      console.log(`JWT Token: ${body.jwt}`);
    }
  );
});
