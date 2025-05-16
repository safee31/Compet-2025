// src/config/redis.js
const redis = require("redis");

// Create a Redis client instance
const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.log("Redis error:", err);
});

module.exports = { redisClient: client };
