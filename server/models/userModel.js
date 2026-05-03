import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String },
        googleId: { type: String },
        provider: { type: String, enum: ["google", "local"], default: "local" },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
