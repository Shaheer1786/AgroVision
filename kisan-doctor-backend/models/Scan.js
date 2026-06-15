import mongoose from "mongoose";

const scanSchema = new mongoose.Schema({

  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

  crop: {
    type: String,
    required: true
  },

  disease: {
    type: String,
    required: true
  },

  confidence: {
    type: Number,
    required: true
  },

  imageName: {
    type: String
  }

}, {
  timestamps: true
});

export default mongoose.model(
  "Scan",
  scanSchema
);