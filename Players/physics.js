var g = require('./global.js'); //Global variables of server
const Profile = require('../Database/profile.js') //Database Profile

//Clamp between two variables
function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}

module.exports.Step = function(c)
{

    var Save = setInterval(() =>
    {
        //Save Player Position To MongoDB
        if (g.Logged.includes(c.Name)) //If player is logged in
        {
            var user_id = c.Name
            Profile.findByIdAndUpdate(user_id, { xx: c.xPos, yy: c.yPos }, function (err, docs) {
                if (err)
                {
                    console.log(err)
                }
            });
        }
    }, 2000) //Save Every 2 Secs

    c.syncMove = setInterval(() => {
        
        if (!c.Hurting) //If not getting hit
        {
            var Send = JSON.stringify({Type:'SyncX', iD: c.playeriD, xPos: c.xPos})
            c.send(Send) //Send self movement to the client

            for (var i=0; i < g.Clients.length; i++) {
                if (c!==g.Clients[i])
                {
                    var Sendie = JSON.stringify({Type:'SyncX', iD: c.playeriD, xPos: c.xPos})
                    g.Clients[i].send(Sendie) //Send x, y to all except self
                }
            }

            var Send = JSON.stringify({Type:'SyncY', iD: c.playeriD, yPos: c.yPos})
            c.send(Send) //Send self movement to the client

            for (var i=0; i < g.Clients.length; i++) {
                if (c!==g.Clients[i])
                {
                    var Sendie = JSON.stringify({Type:'SyncY', iD: c.playeriD, yPos: c.yPos})
                    g.Clients[i].send(Sendie) //Send x, y to all except self
                }
            }
            
        }
    }, g.sendMove);
    //Push back interval
    c.Hrt = setInterval(() => {

        if (c.Hurting) //If got hit
        {
            if (c.PushDistance>0) //Got hit from right direction
            {
                c.PushDistance=c.PushDistance-g.Frc //Decrease Push Distance by friction
                c.xPos+=c.PushDistance //Change position

                c.xPos = clamp(c.xPos, g.roomLimit[c.Room].xLimit, g.roomLimit[c.Room].xLimitMax) //Don't exit room
            } else {
                 //Got hit from left direction

                c.PushDistance=c.PushDistance+g.Frc //Decrease Push Distance by friction
                c.xPos+=c.PushDistance //Change position

                c.xPos = clamp(c.xPos, g.roomLimit[c.Room].xLimit, g.roomLimit[c.Room].xLimitMax) //Don't exit room
            }

            if (c.PushDistance<=0.2 && c.PushDistance>=-0.2) //if Push Distance is depeleted then is not hurting anymore
            {
                c.Hurting=0
            }
        }

    }, g.FPS) //60 FPS in GameMaker
}