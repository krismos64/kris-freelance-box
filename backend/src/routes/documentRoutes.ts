import express from "express";
import multer from "multer";
import { getAllDocuments, uploadDocument, deleteDocument } from "../controllers/documentController";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/", getAllDocuments);
router.post("/upload", upload.single("document"), uploadDocument);
router.delete("/:id", deleteDocument);

export default router;
