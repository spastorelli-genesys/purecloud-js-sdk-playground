const platformClient = require("purecloud-platform-client-v2");

const clientId = "xxxxxxxx";
const clientSecret = "xxxxxxxx";

const errorHandler = (err) => console.log("Error: ", err);

const client = platformClient.ApiClient.instance;
client.setEnvironment("mypurecloud.com");
client.setPersistSettings(true, "test_app");

const conversationApi = new platformClient.ConversationsApi();

client
  .loginClientCredentialsGrant(clientId, clientSecret)
  .then(() => {
    const emailConversationId = "134425aa-0a48-4a75-85c8-b85025e64739";
    const updateDraftReqBody = {
      subject: "Test Update draft",
      textBody: "Test Update draft",
      htmlBody: "Test Update draft",
    };
    conversationApi
      .putConversationsEmailMessagesDraft(
        emailConversationId,
        updateDraftReqBody
      )
      .then((msg) => console.log(msg))
      .catch(errorHandler);
  })
  .catch(errorHandler);
