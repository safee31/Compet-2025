const mongoose = require("mongoose");
const { MONGO_URI, NODE_ENV, ENVIRONMENT } = require("../config");

exports.connectionDB = async () => {
  const uri = MONGO_URI;
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✔ Database Successfully Connected!`.yellow.italic);
    console.log(`Environment: ${NODE_ENV}`.magenta);
    conn.set("debug", true);
  } catch (error) {
    console.error(`Error while DB connection => ${error.message}`.red, error);
  }
};
