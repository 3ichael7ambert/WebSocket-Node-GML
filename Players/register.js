var Accounts = require('../Database/account.js') //Database accounts
var Profile = require('../Database/profile.js') //Database Profile
const { encrypt } = require('../Database/encryption.js');
const { decrypt } = require('../Database/encryption.js');
var g = require('./global.js'); //Global variables of server

module.exports.Reg = function(c, Read, Accounts)
{
    Accounts.findOne({Name: Read.U.toLowerCase()}, function (err, result) //Find the username sent from client
    {
        if (err)
        {
            console.log(err)
        } else {
            if (result) {
                if (result.Name==Read.U.toLowerCase()) //Account already registered
                {
                    let Sendie = JSON.stringify({Type:'AlreadyExists'})
                    c.send(Sendie)
                }
            } else {
                if (result==null) //You can create a new account
                {
                    totalPlayers++ //Increase ids
                    
                    let playerProfile = new Profile({
                        _id: Read.U.toLowerCase(),
                        Name: Read.U.toLowerCase(),
                        Health: c.DefaultHealth,
                        Damage: c.DefaultDamage,
                        iD: totalPlayers,
                        Name: Read.U.toLowerCase(),
                    })
                    playerProfile.save(function(err, result)
                    {
                        if (err){
                            console.log(err);
                        }
                        else{
                            console.log(result)
                        }
                    })

                    let PassEnc = encrypt(Read.P) //Encrypt password

                    let Name = new Accounts({
                        _id: Read.U.toLowerCase(),
                        Name: Read.U.toLowerCase(),
                        Pass: PassEnc,
                        iD: totalPlayers,
                    })
                        Name.save( function(err, result)
                    {
                        if (err){
                            console.log(err);
                        }
                        else
                        {
                            console.log(result)
                            let Sendie = JSON.stringify({Type:'Complete', Name: c.Name})
                            c.send(Sendie)
                        }
                    })
                    
                }
            }
        }
        
    })
}