const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  cost: { type: Number, required: true },
  listingType: { type: String, enum: ["sell", "rent"], required: true },
  filePath: { type: String, required: true },
  mail: { type: String, required: true },
  tag: String,
  rentFrom: String,  // <-- Add this line
  rentTo: String     // <-- Add this line
});

module.exports = mongoose.model("File", fileSchema);
