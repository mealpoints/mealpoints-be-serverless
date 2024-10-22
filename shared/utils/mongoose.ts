import mongoose from "mongoose";

export const objectifyId = (id: string) => {
    return new mongoose.Types.ObjectId(id)
};
