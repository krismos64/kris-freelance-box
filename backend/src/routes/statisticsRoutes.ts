import { Router } from "express";
import {
  getRevenues,
  getClientStats,
  getTaskStats,
  getInvoiceStats,
} from "../controllers/statisticsController";

const router = Router();

router.get("/revenues", getRevenues);
router.get("/clients/stats", getClientStats);
router.get("/tasks/stats", getTaskStats);
router.get("/invoices/stats", getInvoiceStats);

export default router;
