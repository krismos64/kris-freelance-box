import express from "express";
import { getAllRevenues } from "../controllers/revenueController";

const router = express.Router();

router.get("/", getAllRevenues);

export default router;
