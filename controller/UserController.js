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
            active : true
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
    const dbPassword = user.password
    bcrypt.compare(password, dbPassword).then((match) => {
        if (!match) {
            res.status(400).json({
                error : "Wrong username and password combination"
            })
        } else {
            const accessToken = createToken(user); 
            res.cookie("access-token", accessToken, {
                maxAge : 60*60*24*30*1000 
            }) // cookie expires after 30 days
            res.json("USER LOGGINED"); 

        }
    })
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
            User.findByIdAndUpdate(req.params.id, { active: false });
            res.send("User banned!")
        } else {
            res.send("You must be an admin to ban a user."); 
        }
    } catch (err) {
        res.send(err)
    }
}




module.exports = { register, login, profile, getAll, update, deleteUser, banUser }
