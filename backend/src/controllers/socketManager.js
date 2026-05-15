import { Server } from "socket.io"


let connections = {}
let messages = {}
let timeOnline = {}
let roomHosts = {}  // Track who is the host of each room
let participantStates = {}  // Track video/audio state of each participant

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });


    io.on("connection", (socket) => {

        console.log("SOMETHING CONNECTED")

        socket.on("join-call", (path) => {

            if (connections[path] === undefined) {
                connections[path] = []
            }
            
            // First person to join becomes the host
            const isHost = connections[path].length === 0;
            if (isHost) {
                roomHosts[path] = socket.id;
                console.log(`${socket.id} is now the host of room ${path}`);
            }
            
            connections[path].push(socket.id)

            timeOnline[socket.id] = new Date();

            // Initialize participant state
            participantStates[socket.id] = {
                video: true,
                audio: true,
                socketId: socket.id
            };

            // Notify all participants about the new user and who is host
            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path], {
                    hostId: roomHosts[path],
                    isHost: connections[path][a] === roomHosts[path]
                })
            }

            // Send current states of all participants to the new user
            for (let participantId of connections[path]) {
                if (participantStates[participantId]) {
                    io.to(socket.id).emit("participant-state", participantId, participantStates[participantId]);
                }
            }

            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; ++a) {
                    io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                        messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
                }
            }

        })

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        })

        // Handle video toggle
        socket.on("toggle-video", (state) => {
            if (participantStates[socket.id]) {
                participantStates[socket.id].video = state;
            }
            
            // Find the room this socket is in
            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [room, isFound];
                }, ['', false]);

            if (found) {
                // Broadcast to all participants in the room
                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("participant-toggled-video", socket.id, state);
                });
            }
        });

        // Handle audio toggle
        socket.on("toggle-audio", (state) => {
            if (participantStates[socket.id]) {
                participantStates[socket.id].audio = state;
            }
            
            // Find the room this socket is in
            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [room, isFound];
                }, ['', false]);

            if (found) {
                // Broadcast to all participants in the room
                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("participant-toggled-audio", socket.id, state);
                });
            }
        });

        // Host controls - mute all participants
        socket.on("host-mute-all", () => {
            // Find the room and verify host
            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [room, isFound];
                }, ['', false]);

            if (found && roomHosts[matchingRoom] === socket.id) {
                // Host verified, mute all other participants
                connections[matchingRoom].forEach((participantId) => {
                    if (participantId !== socket.id) {
                        io.to(participantId).emit("host-forced-mute");
                        if (participantStates[participantId]) {
                            participantStates[participantId].audio = false;
                        }
                    }
                });
                console.log(`Host ${socket.id} muted all participants in room ${matchingRoom}`);
            }
        });

        // Host controls - disable all videos
        socket.on("host-disable-all-video", () => {
            // Find the room and verify host
            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [room, isFound];
                }, ['', false]);

            if (found && roomHosts[matchingRoom] === socket.id) {
                // Host verified, disable all other participants' video
                connections[matchingRoom].forEach((participantId) => {
                    if (participantId !== socket.id) {
                        io.to(participantId).emit("host-forced-video-off");
                        if (participantStates[participantId]) {
                            participantStates[participantId].video = false;
                        }
                    }
                });
                console.log(`Host ${socket.id} disabled all videos in room ${matchingRoom}`);
            }
        });

        // Host controls - mute specific participant
        socket.on("host-mute-participant", (targetSocketId) => {
            // Find the room and verify host
            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [room, isFound];
                }, ['', false]);

            if (found && roomHosts[matchingRoom] === socket.id && connections[matchingRoom].includes(targetSocketId)) {
                io.to(targetSocketId).emit("host-forced-mute");
                if (participantStates[targetSocketId]) {
                    participantStates[targetSocketId].audio = false;
                }
                console.log(`Host ${socket.id} muted participant ${targetSocketId}`);
            }
        });

        // Host controls - disable specific participant's video
        socket.on("host-disable-participant-video", (targetSocketId) => {
            // Find the room and verify host
            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [room, isFound];
                }, ['', false]);

            if (found && roomHosts[matchingRoom] === socket.id && connections[matchingRoom].includes(targetSocketId)) {
                io.to(targetSocketId).emit("host-forced-video-off");
                if (participantStates[targetSocketId]) {
                    participantStates[targetSocketId].video = false;
                }
                console.log(`Host ${socket.id} disabled video for participant ${targetSocketId}`);
            }
        });

        socket.on("chat-message", (data, sender) => {

            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {


                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }

                    return [room, isFound];

                }, ['', false]);

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }

                messages[matchingRoom].push({ 'sender': sender, "data": data, "socket-id-sender": socket.id })
                console.log("message", matchingRoom, ":", sender, data)

                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id)
                })
            }

        })

        socket.on("disconnect", () => {

            var diffTime = Math.abs(timeOnline[socket.id] - new Date())

            var key

            for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {

                for (let a = 0; a < v.length; ++a) {
                    if (v[a] === socket.id) {
                        key = k

                        // If the host disconnects, assign new host
                        if (roomHosts[key] === socket.id) {
                            delete roomHosts[key];
                            
                            // Assign first remaining person as new host
                            const remainingUsers = connections[key].filter(id => id !== socket.id);
                            if (remainingUsers.length > 0) {
                                roomHosts[key] = remainingUsers[0];
                                console.log(`New host for room ${key}: ${remainingUsers[0]}`);
                                
                                // Notify all about new host
                                remainingUsers.forEach(userId => {
                                    io.to(userId).emit("new-host", remainingUsers[0]);
                                });
                            }
                        }

                        for (let a = 0; a < connections[key].length; ++a) {
                            io.to(connections[key][a]).emit('user-left', socket.id)
                        }

                        var index = connections[key].indexOf(socket.id)

                        connections[key].splice(index, 1)

                        // Clean up participant state
                        delete participantStates[socket.id];

                        if (connections[key].length === 0) {
                            delete connections[key]
                            delete roomHosts[key]
                        }
                    }
                }

            }


        })


    })


    return io;
}


