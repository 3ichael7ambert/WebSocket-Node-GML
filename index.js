"use strict";

require('./Database/connect.js')
require('./Database/encryption.js')

process.title = 'gamemaker';

var webSocketsServerPort = 9334 || process.env.PORT

var webSocketServer = require('websocket').server;
var http = require('http');

//Clamp between two variables
function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}

//Create server
var server = http.createServer(function(request, response) {
    console.log("Server Created")
});

//Listen to connection
server.listen(webSocketsServerPort, function() {
    console.log("Started On Port " + webSocketsServerPort);
});

var wsServer = new webSocketServer({
    httpServer: server
});

//Lerp = smooth changes from variable to variable
function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

function See(Sending, myStruct)
{
    Sending.send(myStruct)
}

const Profile = require('./Database/profile.js') //Database Profile
const Accounts = require('./Database/account.js') //Database Accounts

const { encrypt } = require('./Database/encryption.js');
const { decrypt } = require('./Database/encryption.js');
require("./Players/sprites.js")

var g = require('./Players/global.js'); //Global variables of server

//Room limit so players don't exit map, [1] is a room in GameMaker which is room 1
g.roomLimit[1] = { xLimit: 20, xLimitMax: 480, yLimit: 130, yLimitMax: 240 }
var Active = 0

//Player started the game
wsServer.on('request', function(request) {

    var c = request.accept() //Accept Connection
    var Connect = require('./Database/connect.js')
    if (Connect.connection.readyState!=1) //Database working?
    {
        c.close()
        console.log("Database is not active")
        Active=0
    } else {
        var totalPlayers = require('./Database/account.js')
        if (totalPlayers==null) var totalPlayers=0
        Active=1
    }

    g.Online++ //Players id it doesn't go down
    c.playeriD=g.Online //Assign it to the player who joined
    g.Clients.push(c)

    console.log('Players Online '+g.CurrentOnline++)

    //require('./Players/player.js') //Import player variables
    const { Step } = require('./Players/physics.js');
    Step(c)

    var { Known } = require('./Players/player.js')
    Known(c)
    
    console.log('Player Connected');

    c.on('message', function(message) //Message has been received from client
    {

        try //Don't crash server
        {
        

        var Data = message.binaryData; //Messages coming from GameMaker are Binary Data
        var Len = Data.length;

        var Hello=Data.toString() //Binary Data to string
        var Read = JSON.parse(Hello) //Parse JSON

        //Spawn players and others
        const { Logs } = require('./Players/spawn.js')
        Logs(c, Read)

        switch (Read.Type)
        {
            //Player Register
            case 'Reg':
                
            if (Active==1) //Connected to database?
            {
                const { Reg } = require('./Players/register.js') //Player is trying to register
                Reg(c, Read, Accounts)
            }
            break
            //Player Login
            case 'Log':
            if (Active==1)
            {
                const { Leg } = require('./Players/login.js') //Player is trying to log in
                Leg(c, Read, Accounts)
            }
            break;
            //Attacking and Collision
            case "Attacker":
            const { Collision } = require('./Players/collision.js')
            Collision(c, Read)
            break

            //Moving
            case "Move":
            const { Movie } = require('./Players/move.js')
            Movie(c, Read)
            break

            case "Ping":
            c.send(Data.toString())
            break
            
        }
        } catch (Errr) {
                console.log(Errr)
            }
    })
    c.on('close', function() {
        console.log(c.Name + " Disconnected")
        clearInterval(c.syncMove)
        clearInterval(c.Timer)
        clearInterval(c.Timer2)
        clearInterval(c.Timer3)
        clearInterval(c.Timer4)
        clearInterval(c.Save)

        console.log('Players Online '+g.CurrentOnline--)

        //If player is logged in remove them from the list so they can log in again
        if (g.Logged.includes(c.Name))
        {
            var index = g.Logged.indexOf(c.Name);
            if (index !== -1) {
                g.Logged.splice(index, 1);
            }
        }
        //Remove clients from the array
        for (var i = g.Clients.length - 1; i >= 0; i--) {
            if (g.Clients[i] === c) {
                g.Clients.splice(i, 1)
            }
        }
        //Remove the character who left from the game
        for (var i=0; i < g.Clients.length; i++) {
            if (c!==g.Clients[i])
            {
                var Sendie = JSON.stringify({Type:'Delete', iD: c.playeriD})
                g.Clients[i].send(Sendie);
            }
        }
    })
    
});
