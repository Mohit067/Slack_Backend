import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'workspace is required'],
        unique: true
    },
    discription: {
        type: String
    },
    member: [
        {
            memberId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            role: {
                type: String,
                enum: ['admin', 'member'],
                default: 'member'
            }
        }
    ],
    joinCode: {
        type: String,
        required: [true, 'join code is required']
    },
    channels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel'
        }
    ]
});

const WorkSpace = mongoose.model('Workspace', workspaceSchema);

export default WorkSpace;