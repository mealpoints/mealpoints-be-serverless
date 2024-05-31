import { Router } from "express";
import * as booksController from "../../controllers/books.controller";

const router = Router();

router.get("/", booksController.getBooks);
router.post("/", booksController.createMessage);

export default router;
