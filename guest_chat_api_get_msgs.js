const { authenticate } = require("./common");
const request = require("request");
const conversationId = "287108c0-0782-4dc2-aab0-0d4d35f04d9d";

function getWebChatMessages(jwt, members) {
  const getMessagesEndpoint = `https://api.mypurecloud.com/api/v2/webchat/guest/conversations/${conversationId}/messages`;
  request.get(
    getMessagesEndpoint,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    },
    (err, resp, body) => {
      if (err) {
        console.log(err);
        return;
      }
      const msgResp = JSON.parse(body);
      msgResp.entities.forEach((message) => {
        if (message.bodyType === "standard") {
          const member = members[message.sender.id];
          console.log(
            `${message.timestamp} - (${member.displayName} - [${member.role}]):`,
            message.body
          );
        }
      });
    }
  );
}

function getWebChatMembers(jwt, callback) {
  const getMembersEndpoint = `https://api.mypurecloud.com/api/v2/webchat/guest/conversations/${conversationId}/members`;
  request.get(
    getMembersEndpoint,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    },
    (err, resp, body) => {
      if (err) {
        console.log(err);
        return;
      }
      const membersResp = JSON.parse(body);
      const chatMembers = membersResp.entities.reduce((members, member) => {
        members[member.id] = member;
        return members;
      }, {});

      console.log(chatMembers);
      callback(jwt, chatMembers);
    }
  );
}

const jwt = "xxxxxxxxx";
