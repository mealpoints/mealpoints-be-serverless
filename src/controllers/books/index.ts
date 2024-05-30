import { Request, Response } from "express";
import ApiResponse from "../../utils/APIResponse";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = [
      {
        id: "ebb3d966-74e4-11ed-8db0-136d663b98e7",
        title: "Some Title",
        author: "Some Author this is new stuff asdasd",
      },
    ];

    console.debug(`Returning the books ${JSON.stringify(books)}`);
    return ApiResponse.Ok(res, books);
  } catch (error) {
    console.error("An error ocurred:", error);
    return ApiResponse.ServerError(res, error);
  }
};
