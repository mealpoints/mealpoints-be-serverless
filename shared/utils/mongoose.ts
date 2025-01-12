import mongoose from "mongoose";

export const objectifyId = (id: string | mongoose.Types.ObjectId) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }
  // returning invalid id as it is, expecting further operations will throw err :)
  return id as mongoose.Types.ObjectId;
};

export const returnAsFloat = (value: mongoose.Types.Decimal128) => {
  return value ? Number.parseFloat(value.toString()) : undefined;
};
