import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({ title: { type: String, required: true, minlength: 5, maxlength: 150 }, slug: { type: String, unique: true, index: true }, description: { type: String, required: true, maxlength: 300 }, content: String, type: String, difficulty: String, category: String, technologies: [String], status: { type: String, index: true, enum: ["draft", "submitted", "published", "archived"] }, contributor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, views: { type: Number, default: 0 }, bookmarks: { type: Number, default: 0 }, publishedAt: Date }, { timestamps: true });
resourceSchema.index({ title: "text", description: "text", technologies: "text" });
export default mongoose.model("Resource", resourceSchema);
