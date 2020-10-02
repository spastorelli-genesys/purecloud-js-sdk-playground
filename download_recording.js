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
const conversationApi = new platformClient.ConversationsApi();
const recordingApi = new platformClient.RecordingApi();

const recordingsDirectoryBase = "./Recordings";

client
  .loginClientCredentialsGrant(clientId, clientSecret)
  .then(() => {
    const interval = "2020-01-10T10:00Z/2020-01-14T23:59Z";
    let body = {
      interval: interval,
      /* segmentFilters: [
        {
          type: "or",
          predicates: [
            {
              type: "dimension",
              dimension: "mediaType",
              operator: "matches",
              value: "voice"
            }
          ]
        }
      ], */
      conversationFilters: [
        {
          type: "or",
          predicates: [
            {
              type: "dimension",
              dimension: "conversationId",
              operator: "matches",
              value: "d05f43ec-92d5-4f43-b076-e5bba48fec39",
            },
          ],
        },
      ],
    };
    console.log("Getting conversation details...");
    conversationApi
      .postAnalyticsConversationsDetailsQuery(body)
      .then((convDetails) => {
        console.log("Done");

        if (!fs.existsSync(recordingsDirectoryBase)) {
          fs.mkdirSync(recordingsDirectoryBase, (err) => {
            if (err) errorHandler("mkdir", err);
          });
        }

        const { conversations } = convDetails;
        console.log(convDetails);
        if (conversations) {
          console.log(
            `Fetching recordings metadata for ${conversations.length} conversations`
          );
          getRecordingsForConversations(conversations);
        }
      })
      .catch((err) =>
        errorHandler("postAnalyticsConversationsDetailsQuery", err)
      );
  })
  .catch((err) => errorHandler("loginClientCredentialsGrant", err));

function getRecordingsForConversations(conversations) {
  conversations.forEach(({ conversationId }) => {
    recordingApi
      .getConversationRecordingmetadata(conversationId)
      .then((recordingsMetadata) => {
        console.log(recordingsMetadata);
        recordingsMetadata.forEach(({ id, conversationId }) => {
          console.log(
            `Getting recording ${id} for conversation ${conversationId}...`
          );

          batchReqBody = {
            batchDownloadRequestList: [
              {
                conversationId: conversationId,
                recordingId: id,
              },
            ],
          };

          recordingApi
            .postRecordingBatchrequests(batchReqBody)
            .then(({ id }) => downloadRecordingWhenAvailable(id))
            .catch((err) => errorHandler("postRecordingBatchrequests", err));
        });
      })
      .catch((err) => errorHandler("getConversationRecordingmetadata", err));
  });
  console.log("Done fetching recordings metadata for conversations");
}

function downloadRecordingWhenAvailable(recordingBatchReqId) {
  recordingApi
    .getRecordingBatchrequest(recordingBatchReqId)
    .then((recordingBatchReqData) => {
      const {
        resultCount,
        expectedResultCount,
        results,
      } = recordingBatchReqData;
      console.log(recordingBatchReqData);
      if (expectedResultCount === resultCount) {
        console.log(
          `Downloading recording for conversation ${results[0].conversationId}`
        );
        console.log("Results:", results);
        const {
          contentType,
          conversationId,
          recordingId,
          resultUrl,
        } = results[0];
        const extension = contentType.split("/").splice(-1);
        const recordingDirectory = `${recordingsDirectoryBase}/${conversationId}`;
        fs.mkdirSync(recordingDirectory, (err) => {
          if (err) errorHandler("mkdir recordingDirectory", err);
        });

        console.log(
          `Starting downloading recording ${recordingId} for conversation ${conversationId}: ${resultUrl}`
        );
        const downloadFile = `${recordingDirectory}/conv_${conversationId}_rec_${recordingId}.${extension}`;
        const file = fs.createWriteStream(downloadFile);
        https
          .get(resultUrl, (resp) => {
            resp.pipe(file);
          })
          .on("error", (err) => errorHandler("Download file", err));
      } else {
        console.log(`Recordings not yet available. Trying again in 5s.`);
        setTimeout(
          () => downloadRecordingWhenAvailable(recordingBatchReqId),
          5000
        );
        return;
      }
    })
    .catch((err) => errorHandler("getRecordingBatchrequest", err));
}
