import express from "express";

import { addChannelToWorkspaceController, addMemberToWorkspaceController, createWorkspaceController, deleteWorkspaceController, getWorkspaceByjoinCodeConroller, getWorkspaceController, getWorkspacesUserIsMemberOfController, joinWorkspaceController, resetWorkspaceJoinCodeController, updateWorkspaceConroller } from "../../controllers/workspaceController.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { addChannelToWorkspaceSchema, addMemberToWorkspaceSchema, worksapceSchema } from "../../validators/workspaceSchema.js";
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

router.get(
    '/:workspaceId',
    isAuthenticated,
    getWorkspaceController
)

router.get(
    '/join/:joinCode',
    isAuthenticated,
    getWorkspaceByjoinCodeConroller
)

router.put(
    '/:workspaceId/join',
    isAuthenticated,
    joinWorkspaceController
)

router.put(
    '/:workspaceId',
    isAuthenticated,
    updateWorkspaceConroller
)

router.put(
    '/:workspaceId/members',
    isAuthenticated,
    validate(addMemberToWorkspaceSchema), 
    addMemberToWorkspaceController
)

router.put(
    '/:workspaceId/channels',
    isAuthenticated,
    validate(addChannelToWorkspaceSchema), 
    addChannelToWorkspaceController
)

router.put(
    '/:workspaceId/joinCode/reset',
    isAuthenticated,
    resetWorkspaceJoinCodeController
)
export default router;