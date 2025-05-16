const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoleSchema = new Schema(
  {
    type: {
      type: Number,
      enum: [1, 2], // 1 = Admin, 2 = User,
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    description: { type: String, maxlength: 250 },
    permissions: {
      type: Map,
      of: Boolean,
      default: {},
    }, // Key-Value permissions (e.g., { "create_user": true, "delete_user": false })
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// **Manual Validation for Unique Role Names within Each Type**
RoleSchema.pre("save", async function (next) {
  try {
    const existingRole = await mongoose.models.Role.findOne({
      type: this.type,
      name: this.name,
    });

    if (existingRole) {
      const error = new mongoose.Error.ValidationError(this);
      error.errors["name"] = new mongoose.Error.ValidatorError(
        "name",
        `Role '${this.name}' already exists for this type.`
      );
      return next(error);
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Role", RoleSchema);
