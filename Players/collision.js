require("../Players/sprites.js")
var g = require('./global.js') //Global variables of server
var Profile = require('../Database/profile.js') //Database Profile

function See(Sending, myStruct)
{
    Sending.send(myStruct)
}

module.exports.Collision = function(c, Read)
{
    //If they attack again reset interval
    clearInterval(c.CollisionDetect)
    clearInterval(c.Projectile)

    for (let i = 0; i < g.Clients.length; i++) {
        if (c!==g.Clients[i])
        {
            let Sendie = JSON.stringify({Type:'Attacker', iD: c.playeriD, Asset: Read.Asset}) //Asset is sprite name
            See(g.Clients[i], Sendie) //Send to all players the attack except self
        }
    }
    if (Read.Asset==ImageLength[Read.Asset])
    {
        console.log(Read.Asset)
    }
    var Index=0
    var Image=ImageLength[Read.Asset]
    var CanHit = BeginAttack[Read.Asset]
    var Hit = { Rad: ImageRadius[Read.Asset], x: c.xPos, y: c.yPos } //Create a object for collision
    var Scales=c.xScale //Spear will face the direction the player facing
    g.AttackiD++ //The iD for Spear

    //Attack Speed Movement Interval
    c.Projectile = setInterval(() =>
    {
        Index+=1 //image_index in GameMaker
        if (Index>=CanHit) //Create a object that damages enemy when they reach the *Damage sprite image_index*
        {
            if (Scales==1) {
                Hit.x+=ObjectSpeed[Read.Asset] //Speed of object
            } else {
                Hit.x-=ObjectSpeed[Read.Asset]
            }
        }
        
    }, 100)
    //Collision Detection Interval
    c.CollisionDetect = setInterval(() => {
        if (Index>=Image+1) //Attack animtion is finished
        {
            clearInterval(c.CollisionDetect)
            clearInterval(c.Projectile)
        }

        for (let i = 0; i < g.Clients.length; i++) //Loop through all players
        {
            if (c!=g.Clients[i] && Index>=CanHit) //Damage all players except self and if image_index reached hit state
            {
                c.dx = Hit.x - g.Clients[i].xPos;
                c.dy = Hit.y - g.Clients[i].yPos;

                c.distance = Math.sqrt(c.dx * c.dx + c.dy * c.dy) //Radius of object

                if (c.distance < Hit.Rad + g.Clients[i].Rad && !g.GotHit[g.AttackiD]) {
                    console.log("Collision Detect")

                    g.Clients[i].Health-=10
                    g.Clients[i].Hurting=1 //Got hit start pushing players, see physics.js

                    if (g.Clients[i].Health<=0)
                    {
                        g.Clients[i].Health=100
                    }
                    //Reduce Enemy Health
                    var user_id = g.Clients[i].Name
                    Profile.findByIdAndUpdate(user_id, { Health: g.Clients[i].Health },
                                                function (err, docs) {
                        if (err){
                            console.log(err)
                        }
                        else
                        {
                            //console.log("Updated User : ", docs);
                        }
                    });
                    //Add Push distance
                    if (Scales==1)
                        {
                            g.Clients[i].PushDistance=PushSpeed[Read.Asset]
                        } else 
                        {
                            g.Clients[i].PushDistance=-PushSpeed[Read.Asset]
                        }

                    //Send health status to players
                    let Hitter = JSON.stringify({Type:'Health', iD: g.Clients[i].playeriD, Healthy: g.Clients[i].Health, Push: g.Clients[i].PushDistance})
                    for (let j = 0; j < g.Clients.length; j++) {
                        g.Clients[j].send(Hitter)
                    }

                    g.GotHit[g.AttackiD]=1 //Enemy got hit, no more hits available
                                                                
                }
            }
        }
        //Spawn spear
        if (Index==6 && Read.Asset=="spAttack0_00")
        {
           
            for (let i = 0; i < g.Clients.length; i++) {
                let Sendie = JSON.stringify({Type:'Spear', iD: c.playeriD})
                g.Clients[i].send(Sendie)
            }
        }
    }, 100)
}