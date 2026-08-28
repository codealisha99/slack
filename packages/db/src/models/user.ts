import mongoose from "mongoose";

export interface IUser {
  email: string;
  name: string;
  image: string;
  clerkId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    clerkId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const User = mongoose.models.User ?? mongoose.model<IUser>("User", userSchema);
