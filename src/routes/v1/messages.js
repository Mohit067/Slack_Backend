import express from "express";

import { getMessageController } from "../../controllers/messageController.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/messages/:channelId', isAuthenticated, getMessageController);

export default router;