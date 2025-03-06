import { v4 as uuidv4} from 'uuid';

import workspaceRepository from "../repositories/workspaceRepository.js";

export const createWorkspaceService = async (worksapceData) => {
    const joinCode = uuidv4().substring(0, 6);  

    const response = await workspaceRepository.create({
        name: worksapceData.name,
        description: worksapceData.description,
        joinCode
    });

    await workspaceRepository.addMemberToWorkspace(
        response._id,
        worksapceData.owner,
        'admin'
    );

    await workspaceRepository.addChannelToWorkspace(
        
        response._id,
        'general'
    );
    
    return response;
};