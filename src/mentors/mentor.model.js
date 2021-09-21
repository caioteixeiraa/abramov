const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mentorSchema = new Schema(
  {
    userId: { type: String, unique: true, required: true },
    active: { type: Boolean, default: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    state: { type: String, required: true },
    age: { type: String, required: true },
    linkedin: { type: String, required: true },
    github: { type: String, required: true },
    skills: { type: [String], required: false},
    interests: { type: [String], required: false},
    marketTime: { type: String, required: true },
    company: { type: String, required: false },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
const Mentor = mongoose.model("mentor", mentorSchema);

module.exports = Mentor;