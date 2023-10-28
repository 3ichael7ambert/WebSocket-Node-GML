var Accounts = require('../Database/account.js') //Database accounts
var Profile = require('../Database/profile.js') //Database Profile
const { decrypt } = require('../Database/encryption.js');
var g = require('./global.js'); //Global variables of server

module.exports.Leg = function(c, Read, Accounts)
{
    Accounts.findOne({Name: Read.U.toLowerCase()}, function (err, result) {
        if (err){
            console.log(err)
        }

        if (result) {
            let De = decrypt(result.Pass)

            if (De==(Read.P))
            {
                c.Name=result.Name
                c.Room=1

                if (!g.Logged.includes(c.Name))
                {

                    Profile.findById(Read.U.toLowerCase(), function (err, docs)
                    {
                        if (docs)
                        {
                            if (docs.xx!=null)
                            {
                                c.xPos=docs.xx
                                c.yPos=docs.yy
                                c.Health=docs.Health
                            }


                            let Sendie = JSON.stringify({Type:'Login', Name: c.Name, Health: c.Health})
                            c.send(Sendie)   
                        }
                    });
                g.Logged.push(c.Name)

                } else {
                    let Sendie = JSON.stringify({Type:'AlreadyIn'})
                    c.send(Sendie)
                }
                
            } else {
                let Sendie = JSON.stringify({Type:'Wrong'})
                c.send(Sendie)
            }
        } else {
            console.log("No Result")
            let Sendie = JSON.stringify({Type:'NoUser'})
            c.send(Sendie)
        }
    })
}