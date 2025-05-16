require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const Role = require("./models/role");
const { connectionDB } = require("./database/mongodb");

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "Admin@123";

(async () => {
  try {
    await connectionDB();
    console.log("✅ Database connected.");

    // Check if admin role exists
    let adminRole = await Role.findOne({ type: 1 });
    if (!adminRole) {
      adminRole = await Role.create({
        type: 1,
        name: "Admin",
        description: "System-wide administrator",
      });
    }

    // Check if admin user exists
    let adminUser = await User.findOne({ email: ADMIN_EMAIL });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(11);
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

      adminUser = await User.create({
        email: ADMIN_EMAIL,
        passwordHash,
        isVerified: true,
        role: adminRole._id,
        isActive: true,
        isApproved: true,
      });

      console.log("✅ Admin user created successfully.");
    } else {
      console.log("⚠️ Admin user already exists.");
    }
  } catch (error) {
    console.error("❌ Error adding admin:", error);
  } finally {
    mongoose.connection.close();
  }
})();
