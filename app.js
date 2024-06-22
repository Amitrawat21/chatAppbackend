import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import "./connection/Connection.js";
import Chat from "./Models/chatModel.js";
import chatRouter from "./routes/ChatRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors());
app.use("/chat", chatRouter);

io.on("connection", (socket) => {
    console.log("connected");

    socket.on('joinRoom', async ({ username, room }) => {
        socket.join(room);
        console.log(`${username} joined room ${room}`);
        const loadMessages = async () => {
            try {
                const chat = await Chat.find({ room }).sort({ timeStamp: 1 }).exec();
                socket.emit('chat', chat);
            } catch (err) {
                console.log(err);
            }
        };
        loadMessages();
    });

    socket.on('leaveRoom', ({ username, room }) => {
        socket.leave(room);
        console.log(`${username} left room ${room}`);
    });

    socket.on('newMessage', async (msg) => {
        try {
            const newMessage = new Chat(msg);
            const savedMessage = await newMessage.save();
            io.to(msg.room).emit('message', savedMessage); // Emit the saved message
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("disconnect", () => {
        console.log("disconnect");
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
