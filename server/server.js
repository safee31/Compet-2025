require("dotenv").config();
require("colors");
// const runJob=require("./Jobs/meetingReminder")
const http = require("http");
const app = require("./app");
const { PORT } = require("./config");
const socket_io = require("./config/socket_io");
const setupSocketHandlers = require("./config/socket_handlers");

const port = PORT || 8000;

const server = http.createServer(app);
const io = socket_io.initIO(server);
setupSocketHandlers(io);

server.listen(port, () => {
  console.log(`✔ Server Running On: ${port}`.yellow.italic);
});
// runJob()
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err}`.red.bold);
  server.close(() => process.exit(1));
});
