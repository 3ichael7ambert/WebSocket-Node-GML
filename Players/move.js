var g = require('./global.js') //Global variables of server

function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}

module.exports.Movie = function(c, Read)
{
    clearInterval(c.Timer3)
    clearInterval(c.Timer4)
    clearInterval(c.Timer)
    clearInterval(c.Timer2)

    c.Move=Read.MoveChange
    c.Move2=Read.MoveChange2
    //Vertical Movement
    for (var i=0; i < g.Clients.length; i++) {
        if (c!==g.Clients[i])
        {
            var Sendie = JSON.stringify({Type:'otheriD', iD: c.playeriD, Mov: c.Move2})
            g.Clients[i].send(Sendie);
        }
    }
    if (c.Move2==1)
    {
        c.Timer3 = setInterval(() => {
            c.yPos-=c.MoveSpeed
            c.yPos = clamp(c.yPos, g.roomLimit[c.Room].yLimit, g.roomLimit[c.Room].yLimitMax);

        }, g.FPS);
    }
    if (c.Move2==2)
    {
        c.Timer4 = setInterval(() => {
            c.yPos+=c.MoveSpeed
            
            c.yPos = clamp(c.yPos, g.roomLimit[c.Room].yLimit, g.roomLimit[c.Room].yLimitMax);
            
        }, g.FPS);
    }

    //Horizental Movement
    for (var i=0; i < g.Clients.length; i++) {
        if (c!==g.Clients[i])
        {
            var Sendie = JSON.stringify({Type:'otheriD2', iD: c.playeriD, Mov: c.Move})
            g.Clients[i].send(Sendie) //Send other players how to move except self
        }
    }
    
    if (c.Move==1) //Moving right side
    {
        c.Timer = setInterval(() => {
            c.xPos+=c.MoveSpeed
            c.xScale=1 //Face the right direction
            c.xPos = clamp(c.xPos, g.roomLimit[c.Room].xLimit, g.roomLimit[c.Room].xLimitMax) //Don't exit room

        }, g.FPS);
        
    }
    if (c.Move==2) //Moving left side
    {
        c.Timer2 = setInterval(() => {
            c.xPos-=c.MoveSpeed
            c.xScale=-1 //Face the left direction
            c.xPos = clamp(c.xPos, g.roomLimit[c.Room].xLimit, g.roomLimit[c.Room].xLimitMax) //Don't exit room

        }, g.FPS)
        
    }

    //Stop moving
    if (c.Move==0 && c.Move2==0)
    {
        
        for (var i=0; i < g.Clients.length; i++) {
            if (c!==g.Clients[i])
            {
                var Sendie = JSON.stringify({Type:'StopMove', iD: c.playeriD})
                g.Clients[i].send(Sendie) //Stop Moving
            }
        }
    }
}