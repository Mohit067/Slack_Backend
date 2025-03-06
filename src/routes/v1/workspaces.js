import express from "express";

import { createWorkspaceController, deleteWorkspaceController, getWorkspacesUserIsMemberOfController } from "../../controllers/workspaceController.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { worksapceSchema } from "../../validators/workspaceSchema.js";
import { validate } from "../../validators/zodValidator.js";

const router = express.Router();

router.post(
    '/', 
    isAuthenticated,
    validate(worksapceSchema), 
    createWorkspaceController
)

router.get('/', 
    isAuthenticated, 
    getWorkspacesUserIsMemberOfController
);

router.delete(
    '/:workspaceId',
    isAuthenticated,
    deleteWorkspaceController
)
export default router;