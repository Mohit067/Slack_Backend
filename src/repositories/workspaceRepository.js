import { StatusCodes } from 'http-status-codes';

import User from '../schema/user.js';
import Workspace from '../schema/workspace.js';
import clientError from '../utils/errors/clientError.js'
import crudRepository from './crudRepository.js';
import channelRepository from './channelRepository.js';

const userRepository = {
    ...crudRepository(Workspace),
    
    getWorkspaceByName: async function (workspaceName) {
        const workspace = await Workspace.findOne({
            name: workspaceName
        });

        if(!workspace){
            throw new clientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statuCode: StatusCodes.NOT_FOUND
            });
        }
        return workspace;
    },
    getWorkspaceByjoinCode: async function (joinCode) {
        const workspace = await Workspace.findOne({
            joinCode
        });

        if(!workspace){
            throw new clientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statuCode: StatusCodes.NOT_FOUND
            });
        }
        return workspace;
    },
    addMemberToWorkspace: async function (workspaceId, memberId, role) {
        const workspace = await Workspace.findById({ workspaceId });

        if(!workspace){
            throw new clientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statuCode: StatusCodes.NOT_FOUND
            });
        }

        const isValidUser = await User.findById({ memberId });
        if(!isValidUser){
            throw new clientError({
                explanation: 'Invalid data sent from the client',
                message: 'User not found',
                statuCode: StatusCodes.NOT_FOUND
            });
        }

        const isMemberAlreadyPartOfWorkspace = workspace.member.find(
            (member) => member.memberId == memberId
        );

        if(!isMemberAlreadyPartOfWorkspace){
            throw new clientError({
                explanation: 'Invalid data sent from the client',
                message: 'User is already a part of worksapce',
                statuCode: StatusCodes.FORBIDDEN
            });
        }
        workspace.member.push({
            memberId,
            role
        });

        await workspace.save();

        return workspace;
    },
    addChannelToWorkspace: async function (workspaceId, channelName) {
        const workspace = await Workspace.findById(workspaceId).populate('channels');

        if(!workspace){
            throw new clientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statuCode: StatusCodes.NOT_FOUND
            });
        }

        const isChannelIsAlreadyPartOfWorkspace = workspace.channels.find(
            (channel) => channel.name === channelName
        );
        if(!isChannelIsAlreadyPartOfWorkspace){
            throw new clientError({
                explanation: 'Invalid data sent from the client',
                message: 'channel is already a part of worksapce',
                statuCode: StatusCodes.FORBIDDEN
            });
        }

        const channel = await channelRepository.create({ name: channelName});

        workspace.channels.push(channel);
        await workspace.save();
        return workspace;
    },
    fetchAllWorkspaceByMemberId: async function (memberId) {
        const worksapces = await Workspace.find({
            'members.memberId': memberId
        }).populate('members.memberId', 'username email avatar');
         return worksapces;
    },
}

export default workspaceRepository;