const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const connectionSchema = new Schema(
  {
    connectionId: { type: String, unique: true, required: true },
    emailMentee: { type: String, required: true, unique: true },
    emailMentor: { type: String, required: true, unique: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
const Connection = mongoose.model("connection", connectionSchema);

module.exports = Connection;