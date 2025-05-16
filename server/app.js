const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectionDB } = require("./database/mongodb");
const { appErrorHandler } = require("./middlewares/appErrorHnadler");
const { ORIGIN_URL } = require("./config");
const apiRoutes = require("./routes");
const path = require("path");
const { handleStripeWebhook } = require("./controllers/Stripe/webhooks");
const prefix = "/api";

// runVotingJob()
// db.votingsessions.insertOne({
//   "month": "2025-02",
//   "deadline": ISODate("2025-02-28T23:59:59.999Z"),
//   "isClosed": false
// })
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.post(
  `${prefix}/stripe/webhooks/handle`,
  express.raw({ type: "application/json" }),
  express.json({ type: "application/json" }),
  handleStripeWebhook
);

app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    credentials: true,
    origin: ORIGIN_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // optionsSuccessStatus: 204, // Set the preflight response status to 204
    // allowedHeaders: "Authorization,Content-Type",
  })
);
connectionDB();
//Routings
app.use(prefix, apiRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Handle incorrect or not found routes
app.use(`${prefix}/*`, (req, res) => {
  res.status(404).json({ message: "Route not found or incorrect API" });
});

app.use(appErrorHandler);
module.exports = app;
