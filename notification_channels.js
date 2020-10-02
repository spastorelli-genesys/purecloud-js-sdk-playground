const { authenticate } = require("./common");
const request = require("request");
const WebSocket = require("ws");

function WSConnectAndWait(channel) {
  const { connectUri } = channel;
  console.log(typeof channel);
  console.log("Connecting to notification channel websocket " + connectUri + " ...");
  let ws = new WebSocket(connectUri);

  ws.on("message", msgEvt => {
    const message = JSON.parse(msgEvt);
    const { topicName } = message;
    if (topicName) {
      switch (topicName) {
          case "channel.metadata":
            console.log(message.eventBody);
            break;
        default:
          console.log("Got non-handled message: ");
          console.log(message);
      }
    }
  });

  ws.on("open", openEvt => {
    console.log("Connected");
  });

  ws.on("error", errEvt => {
    console.log("Error: " + errEvt);
  });

  ws.on("close", function close() {
    console.log("disconnected");
  });

}

function createNotificationChannel() {
    authenticate().then(({ accessToken }) => {
        request.post(
            "https://api.mypurecloud.com/api/v2/notifications/channels",
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            },
            (error, response, body) => {
                if (error) {
                    console.error(error);
                    return;
                }
                if (body) {
                    const channel = JSON.parse(body);
                    WSConnectAndWait(channel);
                }
            }
        );
    }).catch(error => console.error(error));
}


createNotificationChannel();

