// OUR SERVER CODE
const express = require('express');
const app = express();
const socketIO = require('socket.io');
const http = require('http');
const { Socket } = require('net');
const { log } = require('console');

app.get('/',(req,res )=> {
    // res.send('Hello');
    res.sendFile(`${__dirname}/chat.html`)
});

//launch our server and bind socket.io to it
const httpServer = http.createServer(app).listen(3000);
const io = socketIO(httpServer);

// const count = io.engine.clientsCount;
let usersconnected = 0;

//set uo our first Node event handler
io.on('connection', (socket) =>{
    console.log('Client connected-node');

    //radical - make and trigger our own event
    socket.emit('Welcome','Welcome to the APPD5015 chat Server!!!')
    socket.emit('Time', new Date().toTimeString())
    //handle a new chat event fron the cliant 
    socket.on('message',(newChat) => {
        console.log(newChat);

        //broadcast this message to everyone in  the chat
        io.emit('new_message',newChat)
    });

    usersconnected++;
    io.emit('user_number', usersconnected);
    // io.emit('user_number', io.of("/").sockets.size);

    //set up our second Node event handler
    socket.on('disconnect', (socket) =>{
        console.log('Client disconnected-node');
        // io.emit('user_number', io.of("/").sockets.size)
        usersconnected--;
         io.emit('user_number', usersconnected);
    });
});

//Outside client socket connection handler 
setInterval(() => {
    io.emit('server_time', new Date().toTimeString());
}, 1000);




