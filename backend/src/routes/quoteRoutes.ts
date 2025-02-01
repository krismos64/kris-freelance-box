import express from "express";
import { getQuoteById, getAllQuotes, createQuote, updateQuote, deleteQuote } from "../controllers/quoteController";

const router = express.Router();

router.get("/", getAllQuotes);
router.get("/:id", getQuoteById);
router.post("/", createQuote);
router.put("/:id", updateQuote);
router.delete("/:id", deleteQuote);

export default router;
