const mongoose = require("mongoose");
const validator = require("validator");
const hashPassword = require("../utils/hashPassword");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 150,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "invalid email",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["customer", "practitioner", "clinic", "admin"],
      default: "customer",
      validate: {
        validator: function (value) {
          // console.log("--- role validator", value, this.email, this.name);
          if (value === "practitioner" && !this.clinic) {
            return false;
          }
          return true;
        },
        message: "clinic id is required for practitioners",
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationDate: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiryDate: Date,
    profileImageURL: String,
    bio: String,
    clinic: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.index({ role: 1 });

// before removing practitioner remove this slots also
UserSchema.pre("remove", function () {
  if (this.role !== "practitioner") return;
  this.model("AppointmentTimeSlot").deleteMany({ practitioner: this._id });
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  // const salt = await bcrypt.genSalt(10);
  this.password = await hashPassword({ password: this.password }); // await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

// get appointments of clinic
UserSchema.virtual("appointments", {
  ref: "Appointment",
  foreignField: "clinic",
  localField: "_id",
  justOne: false,
});

// get practitioners of clinic
UserSchema.virtual("practitioners", {
  ref: "User",
  localField: "_id",
  foreignField: "clinic",
  justOne: false,
});

// get practitioner slots
UserSchema.virtual("slots", {
  ref: "AppointmentTimeSlot",
  localField: "_id",
  foreignField: "practitioner",
  match: { isBooked: false, startDateTime: { $gt: new Date() } },
});

module.exports = mongoose.model("User", UserSchema);
