import { Router } from "express";
import { getBooks } from "../../controllers/books";

const router = Router();

router.get("/", getBooks);

export default router;
