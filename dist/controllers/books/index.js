"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooks = void 0;
const APIResponse_1 = __importDefault(require("../../utils/APIResponse"));
const getBooks = async (req, res) => {
    try {
        const books = [
            {
                id: "ebb3d966-74e4-11ed-8db0-136d663b98e7",
                title: "Some Title",
                author: "Some Author this is new stuff",
            },
        ];
        console.debug(`Returning the books ${JSON.stringify(books)}`);
        return APIResponse_1.default.Ok(res, books);
    }
    catch (error) {
        console.error("An error ocurred:", error);
        return APIResponse_1.default.ServerError(res, error);
    }
};
exports.getBooks = getBooks;
