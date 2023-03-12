const User = require('../models/user')
const express = require('express')
const { createToken, validateToken } = require('../midill/JWT/JWT'); 
const bcrypt = require("bcrypt"); 
const { sign, verify } = require('jsonwebtoken')




// =============== LOGINED USER =========================


const getConnectedUserId = (req) => {
    // get User
    const accessToken = req.cookies["access-token"];
    if (!accessToken) {
        return res.status(401).json({ message: "Access token not found" });
    }
    const decodedToken = verify(accessToken, "azjdn1dkd3ad");
    req.userId = decodedToken.id;
    
    return req.userId; 
    //const user = await User.findById(req.userId);
    //res.send(user)
}



// =============== APIs ===========================

const register = (req, res) => {
    const { username, password, name, email, image, role, location, phone } = req.body; 

    bcrypt.hash(password, 10).then((hash) => {
        User.create({
            username: username,
            password: hash,
            name: name,
            email: email,
            image: image,
            role: "simple",
            location: location,
            phone: phone,
            createdAt: new Date(),
            active: true,
            google : false
        }).then(() => {
            res.json("USER REGISTERED");
            
        }).catch((err) => {
            if (err) {
                res.status(400).json({error : err})
            }
        })
    })
}

const login = async (req, res) => {
    const { username, password } = req.body; 
    const user = await User.findOne({ username: username }); 

    if (!user) res.status(400).json({ error: "User doesn't exist" })
    else if (user.active == true ) {
        const dbPassword = user.password
        bcrypt.compare(password, dbPassword).then((match) => {
            if (!match) {
                res.status(400).json({
                    error: "Wrong username and password combination"
                })
            } else {
                const accessToken = createToken(user);
                res.cookie("access-token", accessToken, {
                    maxAge: 60 * 60 * 24 * 30 * 1000
                }) // cookie expires after 30 days

                req.session.user = user; 
                res.json(req.session.user);
                //res.send(user)
            }
        })
    } else {
        res.json({ban : true}); 
    }
}

const getAll = async (req, res, next) => {
    try {
        User.find({}).then(result => {
            res.send(result)
        })
    } catch (err) {
        console.log(err)
    }  
}
const profile = async (req, res) => {
    try { 
        await User.findById(req.params.id).then(result => {
            res.send(result)
        }) 
    } catch(err) {
        res.send(err)
    }
}



const update = async (req, res) => {
    try {
        
        connectedUserId = getConnectedUserId(req);

        if (connectedUserId == req.body["_id"]) {
            await User.findByIdAndUpdate(connectedUserId, req.body).then(result => {
                res.send("User updated!")
            })
        } else {
            res.send("You can't update another user.")
        }
    } catch (err) {
        res.send(err)
    }
}

const deleteUser = async (req, res) => {
    try {
        connectedUserId = getConnectedUserId(req); 
        Connected = await User.findById(connectedUserId); 
        
        if (Connected.role == "admin") {
            await User.findByIdAndRemove(req.params.id)
            res.send("User deleted!")
        } else {
            res.send("You must be an admin to delete another users!")
        }

    } catch (err) {
        res.send(err)
    }
}


const banUser = async (req, res) => {
    try {
        connectedUserId = getConnectedUserId(req); 
        Connected = await User.findById(connectedUserId); 
        if (Connected["role"] == "admin") {
            await User.findByIdAndUpdate(req.params.id, { active: false });
            res.send("User banned!")
        } else {
            res.send("You must be an admin to ban a user."); 
        }
    } catch (err) {
        res.send(err)
    }
}

const logout = () => async (req, res) => {
  await req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).send('An error occurred while logging out');
    } else {
      res.send('Logged out successfully');
    }
  });
}




// ====== google ==========

const loginGoogle = async (req, res) => {
  const { username, name, image, email, google } = req.body;
  const user = await User.findOne({ email: email });

    if (google == true) {
        if (!user){
            
            User.create({
              username: username,
              password: "azdadkAZOP",
              name: name,
              email: email,
              image: image,
              role: "simple",
              location: "",
              phone: null,
              createdAt: new Date(),
              active: true,
              google : google
            })
            .then(() => {
                res.json("USER REGISTERED");
            })
            .catch((err) => {
            if (err) {
                res.status(400).json({ error: err });
            }
            });

        } else {
            
            const accessToken = createToken(user);
            res.cookie("access-token", accessToken, {
                maxAge: 60 * 60 * 24 * 30 * 1000,
            });
            req.session.user = user;
            res.json(req.session.user);
        }
    }  
  
};


// ======== promote user to admin
const promoteUser = async (req, res) => {
  try {
     
    const user = await User.findByIdAndUpdate(req.params.id, { role: "admin" });
    res.send(user); 
    //res.send("User promoted!");
     
  } catch (err) {
    res.send(err);
  }
};




module.exports = { register, login, profile, getAll, update, deleteUser, banUser, logout, loginGoogle, promoteUser }
