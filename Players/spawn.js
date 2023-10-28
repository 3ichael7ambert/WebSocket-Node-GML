var g = require('./global.js'); //Global variables of server

module.exports.Logs = function(c, Read)
{
    if (Read.Type=="Stalk") //Clients only sends this once when they connect, if they don't send this then disconnect them
    {
        console.log('Trust Success')
        c.Real=1

        c.Sendie = JSON.stringify({Type:'Stalk', iD: c.playeriD, Health: c.Health, xPos: c.xPos, yPos: c.yPos})
        c.send(c.Sendie)

        for (var i=0; i < g.Clients.length; i++)
        {
            if (c!==g.Clients[i] && g.Clients[i].Room==1 && c.Name!="")
            {
                var Sendie3 = JSON.stringify({Type:'iD', iD: c.playeriD, xPos: c.xPos, yPos: c.yPos, Nom: c.Name, Health: c.Health})
                g.Clients[i].send(Sendie3);

            }
            if (c!==g.Clients[i] && c.Room==1 && g.Clients[i].Name!="")
            {
                var Sendie4 = JSON.stringify({Type:'iD', iD: g.Clients[i].playeriD, xPos: g.Clients[i].xPos, yPos: g.Clients[i].yPos, Nom: g.Clients[i].Name, Health: g.Clients[i].Health})
                c.send(Sendie4);
            }
        }
        
    } else {
        if (c.Real==0)
        {
            c.close()
            console.log('Trust Failed')
        }
    }
}