const app = require("express")()
const server = require("http").createServer(app)
const cors = require("cors")
const PORT = process.env.PORT || 5000

//
const io = require("socket.io")(server,{
    cors:{
        origin: "*",
        methods: ["GET", "POST"]
    }
})

//
app.use(cors())

//
app.get('/',((req, res) => {
    res.send('Server started')
}))

io.on('connection',(socket)=>{
    console.log("connected ...")
    socket.emit('me',socket.id)

    //
    socket.on('call_user',({userToCall,signalData,from,name})=>{
        console.log("server call_user")
        io.to(userToCall).emit('callUser',{signal: signalData,from,name})
    })

    //
    socket.on('answerCall',(data)=>{
        console.log("answerCall");
        io.to(data.to).emit('call_accepted',data.signal)
    })

    //
    socket.on('disconnect',()=>{
        socket.broadcast.emit('call ended')
    })
})

server.listen(PORT,()=> console.log('server listening on port: '+PORT))