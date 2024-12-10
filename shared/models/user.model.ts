import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  id: string;
  contact: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  password?: string;
  isActive: boolean;
  timezone: string;
  countryCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate extends Partial<IUser> {
  contact: string;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String },
  lastName: { type: String },
  contact: { type: String, required: true, unique: true },
  email: { type: String },
  isActive: { type: Boolean, default: true },
  timezone: { type: String, required: true },
  countryCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create an index on the contact key
userSchema.index({ contact: 1 });

// Pre-save middleware to update the `updatedAt` field
userSchema.pre<IUser>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

userSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (document, returnValue) {
    returnValue.id = returnValue._id;
    delete returnValue._id;
  },
});

// Create and export the model
const User = model<IUser>("User", userSchema);
export default User;
