const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const path = require("path")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(path.join(__dirname, "public")))

let users = {}

io.on("connection", (socket) => {

socket.on("join", (name) => {
users[socket.id] = name
io.emit("message", name + " joined the chat")
})

socket.on("chat", (msg) => {
let name = users[socket.id]
io.emit("message", name + ": " + msg)
})

socket.on("disconnect", () => {
let name = users[socket.id]
if(name){
io.emit("message", name + " left")
}
delete users[socket.id]
})

})

server.listen(process.env.PORT || 3000, () => {
console.log("Server running")
})
