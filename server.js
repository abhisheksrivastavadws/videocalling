const express = require("express")
const app = express();
const server = require("http").Server(app)
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))
// some space is created in browser with this link 
app.get('/', (req, res)=>{
    res.redirect(`/${uuidV4()}`)
})
// room is created in browser with this link with room id
app.get('/:room', (req, res)=>{
    res.render('room',{roomId: req.params.room})
})
// with this anyone who has id can be connected with our meeting
io.on('connection',socket =>{
    socket.on('join-room', (roomId, userId)=>{
        socket.join(roomId)
        // it will send the message to the room that we are currently in 
        socket.to(roomId).broadcast.emit("user-connected", userId)
        socket.on('disconnect', ()=>{
            socket.to(roomId).broadcast.emit("user-disconnected", userId)
        })
    })
})



server.listen(3000)

