import express from "express";

import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { isMemberAlreadyPartOfWorkspaceController } from "../../controllers/memberController.js";

const router = express.Router();

router.get(
    '/workspace/workspaceId', 
    isAuthenticated,
    isMemberAlreadyPartOfWorkspaceController
);

export default router;