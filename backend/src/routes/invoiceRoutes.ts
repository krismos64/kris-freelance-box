import express from "express";
import {
  getAllInvoices,
  getInvoicesByClientId,
  createInvoice,
} from "../controllers/invoiceController";

const router = express.Router();

router.get("/", getAllInvoices);
router.get("/client/:clientId", getInvoicesByClientId);
router.post("/", createInvoice);

export default router;
