const express = require("express");
const bodyParser = require("body-parser");
const app = express(module.exports);

app.use(bodyParser.json());

app.post("/wspost", (req, resp) => {
  resp.send(req.body);
});

app.get("/", (req, res) => res.send("Hello world"));

app.listen(8000, () => console.log("Listening on port 8000"));
