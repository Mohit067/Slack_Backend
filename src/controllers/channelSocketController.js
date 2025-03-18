import { JOIN_CHANNEL } from "../utils/common/eventConstants.js";

export default function messageHandler (io, socket) {
    socket.on(JOIN_CHANNEL, async function joinChannelHandler(data, cb = () => {}) {
        const roomId = data.channelId;
        socket.join(roomId);
        console.log(data)
        console.log(`User join ${socket.id} the channel ::: ${roomId}`);
        console.log("Callback provided:", typeof cb === "function");
        console.log("Callback function:", cb);
        cb({
            success: true,
            message: "Successfully joined the channel",
            data: roomId
        });
        
    });
} 