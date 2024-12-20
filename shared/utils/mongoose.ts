import mongoose from "mongoose";

export const objectifyId = (id: string) => {
  return new mongoose.Types.ObjectId(id);
};

export const returnAsFloat = (value: mongoose.Types.Decimal128) => {
  return value ? Number.parseFloat(value.toString()) : undefined;
};
