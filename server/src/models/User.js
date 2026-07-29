import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ name: String, username: { type: String, unique: true }, email: { type: String, unique: true, index: true }, passwordHash: String, role: { type: String, enum: ["user", "contributor", "admin"], default: "user" }, bio: String }, { timestamps: true });
export default mongoose.model("User", userSchema);
