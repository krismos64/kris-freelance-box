import express from "express";
import {
  createPayment,
  updatePayment,
  deletePayment,
  getAllPayments,
  getPaymentById,
} from "../controllers/paymentController";

const router = express.Router();

router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.post("/", createPayment);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

export default router;
