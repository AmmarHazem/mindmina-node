const mongoose = require("mongoose");

const oneDay = 1000 * 60 * 60 * 24;

const TokenSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      default: Date.now() + oneDay,
    },
    // isValid: {
    //   type: Boolean,
    //   default: true,
    // },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

TokenSchema.virtual("isValid").get(function () {
  return Date.now() < this.expiryDate;
});

module.exports = mongoose.model("Token", TokenSchema);
