import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    body: {
        type: String,
        required: [true, 'body is required']
    },
    image: {
        type: String
    } ,
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'channer',
        required: [true, 'Channel ID required']
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender ID required']
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: [true, 'Workspace ID required']
    }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;