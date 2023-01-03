const express = require("express");
const {createServer} = require("http");
const {Server} = require("socket.io");
const cors = require('cors');

const app = express();
const httpServer = createServer(app);

app.use(express.json()); // parse json data from request
app.use(express.urlencoded({extended: true})); // parse url-encoded data from request
app.use(cors({origin: '*'}));

const io = new Server(httpServer, {cors: {origin: "*"}}); // The default namespace = '/' is maded as new Server() instantiated
// console.log(io.of("/").sockets.size); // default or main namespace

// const customNamespace = io.of("/users"); // this will have its own on method to emit and listen socket events as '/users'
// console.log(io.of('/users').sockets.size); // custom namespace
// io.engine.on("connection_error", (error) => {
//     console.log(error.message);
// });

let users = [];

const addUser = (socketId, userId) => {
    !users.some((user) => user.userId === userId) && users.push({userId, socketId});
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};


// main or default namespace
io.of("/").on("connection", (socket) => {
    // console.log("socketId", socket.id); // a generated default id
    // console.log("socketRooms before", socket.rooms); // []
    // socket.join("room1"); // make a room called 'room1'
    // console.log("socketRoom now", socket.rooms); // ['room1']
    // console.log(socket.in('room1').fetchSockets());
    // console.log(`here`, socket.in(socket.id).fetchSockets());

    // socket.on("my-event", (data) => {
    //     console.log("my-event is emitted", data);
    //     // when this event received then broadcast another event with this data
    //     socket.broadcast.emit("received_message", data);
    // });

    // socket.on("disconnecting", (reason) => {
    //     for (const room of socket.rooms) {
    //         if (room !== socket.id) {
    //             socket.to(room).emit("user offline", socket.id)
    //         }
    //     }
    // });

    // add a new user
    socket.on('addUser', (userId) => {
        addUser(userId, socket.id);
    });

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });
    });

    socket.on("disconnect", (reason) => {
        console.log(`disconnect ${socket.id} due to ${reason}`);
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});

const PORT = process.env.PORT || 8900;
httpServer.listen(PORT, () => console.log(`Server running on ${PORT}`));