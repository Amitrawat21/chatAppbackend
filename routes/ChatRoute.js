
import express from "express"
import allChats from "../Controllers/ChatController.js"

const router = express.Router()

router.delete("/delete/:room" , allChats.deleteAllChats)
router.delete("/:id"  ,  allChats.deletSingleChat)
router.post("/" , allChats.savechat)



export default router