import { Router } from "express";
import clientRoutes from "./clientRoutes";
import invoiceRoutes from "./invoiceRoutes";
import quoteRoutes from "./quoteRoutes";
import taskRoutes from "./taskRoutes";
import documentRoutes from "./documentRoutes";
import companyRoutes from "./companyRoutes";
import paymentRoutes from "./paymentRoutes";
import revenueRoutes from "./revenueRoutes";
import dashboardRoutes from "./dashboardRoutes";
import statisticsRoutes from "./statisticsRoutes";

const router = Router();

router.use("/clients", clientRoutes);
router.use("/quotes", quoteRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/tasks", taskRoutes);
router.use("/documents", documentRoutes);
router.use("/company", companyRoutes);
router.use("/payments", paymentRoutes);
router.use("/revenues", revenueRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/statistics", statisticsRoutes);

router.use("/clients", (req, res, next) => {
  console.log("Route /clients appelée");
  next();
});

export default router;
