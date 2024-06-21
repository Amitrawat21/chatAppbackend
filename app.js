import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import "./connection/Connection.js";
import {timeStamp} from "console"
import Chat from "./Models/chatModel.js";

dotenv.config();

const app = express();
app.use(express.json())
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


app.use(cors());

io.on("connection", (socket) => { // a new user cnnect 
    console.log("connected");

    const loadMessages = async () => {
        try {
            const chat = await Chat.find().sort({timeStamp : 1}).exec();
            socket.emit('chat', chat)
        } catch(err) {
            console.log(err)
        }
    }
    loadMessages();

    socket.on('newMessage', async (msg) => { //cliene send request 
        try {
            const newMessage = new Chat(msg)
            await newMessage.save()
            io.emit('message', msg) // send to all
        }catch(err) {
            console.log(err)
        }
    })

    socket.on("disconnect", () => {
        console.log("disconnect")
    })
})





server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
