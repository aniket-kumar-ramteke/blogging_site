const http = require("http");
const app = require("./app.js");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT_GIVEN;
const server = http.createServer(app);

server.listen(PORT);