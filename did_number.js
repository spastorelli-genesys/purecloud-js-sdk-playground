const { authenticate, platformClient } = require("./common");

const logError = err => console.log(err);
const telephonyApi = new platformClient.TelephonyProvidersEdgeApi();

function listDidNumbers(pageNumber) {
  pageNumber = pageNumber || 1;
  console.log("Fetching page number:", pageNumber);
  telephonyApi
    .getTelephonyProvidersEdgesDids({ pageNumber: pageNumber })
    .then(resp => {
      resp.entities.forEach(did => {
        console.log("DID Number: ", did.phoneNumber);
        console.log("Owner: ", did.owner.name);
      });

      if (resp.nextUri) {
        console.log("Page number: ", resp.pageNumber);
        listDidNumbers(resp.pageNumber + 1);
      }
    });
}

authenticate()
  .then(() => {
    listDidNumbers();
  })
  .catch(err => logError(err));
