const fs = require("fs");
const zlib = require("zlib");
const https = require("https");

const recordingUrl =
  "https://prod-recording-playback.s3.amazonaws.com/MediaCache/BatchDownload/cc329c9f-a78c-4788-8808-6fdf739234f7/d05f43ec-92d5-4f43-b076-e5bba48fec39/9c446f7c-986d-4dfc-93f1-f6a76908fc36?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQC8Jod70bhQ6hHUb6H8Wbj%2FOPwBqqRZVrNdugdNdIMVuwIhAIDuKLfw7ETuxCJzG1hKkjfphgbQfBwMQW70yh0lcn4xKrQDCEMQABoMNzY1NjI4OTg1NDcxIgxiLA3HDMT917Ary7MqkQPJwq1KaMLbIMicXnxmZcheYMAm9%2BZrIAXoX4Ub8o5oGMWuXwQy3BEGG8YSuZ0SsOm6y00w7yc5NVtFcRrHqJ354Z2JN0qN7BX62hwAA7ibo4iFRKtt7d69QmTFjYKp%2BdKl5lY8hgxuJ94FqiG7yuQ7qz79tDsX87naIj3I7bz2d%2Ber91Zmku9PqKozSkrbysCiIi1RmlsxAPl3ofThYkhx6wnxUnQLNS%2FtsttbFz%2B54VvpwBvklLlenAfOQAHE4V%2Bdb65qpC7caCwLE4zr0q6QqobDUxPgeXm50%2B2A%2FtVaEOvPLvMuZBQMsrjqqCVwp5ws%2BPACI4LYsnbu6GACA4h17ZuGJFWeS4OJiF0tQtb3D%2FN%2FfyKsJmK0uyk58AF8L4GffHEMizFuTnqsAujrzZ8EkLfAqn6u2SpkZPI%2BAOPB6OZTXBeTkOF6WynPr0%2BrIujHTXCM7GVQU4PjL2GxBzYRMX9%2F%2BSwJ%2Fzbs%2F1cM6xdPX%2BPfCu42d6GmsadkcKiBwOo3DoBS9IjPgx8eXx%2Bczh451TCSifHwBTrqAdRa0Rd5P7aO2tIY%2FRX74ekcQR5j1xa5E3ObBZfoxclINiVshyfg%2BWCUBxxqO0%2FmFnPQB9xPWSggofI2Sy8rx4N%2FPKgy%2FScOvCieOlG9HvK3BUdeXhD10hfS4EhcgKvAP2RXbY7jZxOAeoWwihy5QIpD1755gnroc%2FhPbI0Ywp64VKDEM5eZXPxDRlT07e8ZlDnBlHqh7al0xakADVrCpW%2FsZboPjp3N1pIaY2oHgOEZqlJ3k5ZiwIk8G9kWTSZspClkpTql%2B%2BdvTzFyMFTPysvvW4MhWrsYbfaL2ywQ5M%2BPymFHgBKEOyeC0A%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200113T113400Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIA3EQYLGB7UJI2UZXC%2F20200113%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=b32dcca5233ba138997ae071a0ec8bcf3f124495aacd909bee8e8804881c8861";

const downloadFile = `./Recordings/conv_d05f43ec-92d5-4f43-b076-e5bba48fec39.ogg`;
const file = fs.createWriteStream(downloadFile);
const options = {
  headers: {
    "Accept-Encoding": "gzip, deflate"
  }
};

https.get(recordingUrl, resp => {
  resp.on("data", d => {
    file.write(d);
  });

  resp.on("close", () => {
    file.close();
  });
});
