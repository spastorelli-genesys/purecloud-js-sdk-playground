const { authenticate, platformClient } = require("./common");

const logError = (err) => console.log(err);
const stationApi = new platformClient.StationsApi();
authenticate()
  .then(() => {
       let opts = {
        'pageSize': 25, // Number | Page size
        'pageNumber': 1, // Number | Page number
        'sortBy': "id", // String | Sort by
        'name': "", // String | Name
        'userSelectable': "", // String | True for stations that the user can select otherwise false
        'webRtcUserId': "", // String | Filter for the webRtc station of the webRtcUserId
        'id': "", // String | Comma separated list of stationIds
        'lineAppearanceId': "" // String | lineAppearanceId
        };
        stationApi.getStations(opts).then((data) => {
            console.log(data)
        }).catch(err => logError(err))
  })
  .catch((err) => logError(err));
