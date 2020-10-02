const { authenticate } = require("./common");
const request = require("request");
const WebSocket = require("ws");

function sendChatMsg(acdChat, msg) {
  const { id, member, jwt } = acdChat;
  const chatMsg = {
    body: msg,
    bodyType: "standard | notice"
  };
  request.post(
    `https://api.mypurecloud.com/api/v2/webchat/guest/conversations/${id}/members/${member.id}/messages`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`
      },
      json: chatMsg
    },
    (error, response, body) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(body);
    }
  );
}

function WSConnectAndWait(acdChat) {
  const { eventStreamUri } = acdChat;
  console.log("Connecting to chat websocket " + eventStreamUri + " ...");
  let ws = new WebSocket(eventStreamUri);

  ws.on("message", msgEvt => {
    const message = JSON.parse(msgEvt);
    if (message.metadata) {
      switch (message.metadata.type) {
        case "typing-indicator":
          console.log("Agent is typing");
          break;
        case "message":
          console.log(message);
          const msg = message.eventBody;
          if (msg.bodyType === "standard") {
            if (msg.sender.id !== acdChat.member.id) {
              console.log(
                `[${msg.timestamp}] Got Message from ${msg.sender.id}`
              );
              console.log(msg.body);

              console.log("Sending reply...");
              sendChatMsg(acdChat, "Hello world");
              console.log("Sent");
            }
          } else if (message.bodyType === "member-leave") {
            console.log("Member left. Closing connection...");
            ws.close();
          }
          break;
        default:
          console.log("Got non-handled message: ");
          console.log(message);
      }
    }
  });

  ws.on("open", openEvt => {
    console.log("Connected");
    setTimeout(() => {
      const ping = { message: "ping" };
      ws.send(JSON.stringify(ping));
    }, 3000);
  });

  ws.on("error", errEvt => {
    console.log("Error: " + errEvt);
  });

  ws.on("close", function close() {
    console.log("disconnected");
  });
}

const chatConv = {
  organizationId: "cc329c9f-a78c-4788-8808-6fdf739234f7",
  deploymentId: "da0ba755-efcc-4e93-958a-fea3dea65fb2",
  routingTarget: {
    targetType: "QUEUE",
    targetAddress: "Steeve Test Queue 1"
  },
  memberInfo: {
    displayName: "John Smith",
    avatarImageUrl: "http://some-url.com/JoeDirtsFace",
    customFields: {
      some_field: "arbitrary data",
      another_field: "more arbitrary data"
    }
  }
};

/* authenticate().then(({ accessToken }) => {
  let chat;
  
}); */

request.post(
  "https://api.mypurecloud.com/api/v2/webchat/guest/conversations",
  {
    json: chatConv
  },
  (error, response, acdChat) => {
    if (error) {
      console.error(error);
      return;
    }

    console.log("Headers:");
    console.log(response.headers);
    console.log("\n");
    console.log(acdChat);

    WSConnectAndWait(acdChat);
  }
);
