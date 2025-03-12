import express from "express";

import { isMemberAlreadyPartOfWorkspaceController } from "../../controllers/memberController.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
    '/workspace/workspaceId', 
    isAuthenticated,
    isMemberAlreadyPartOfWorkspaceController
);

export default router;