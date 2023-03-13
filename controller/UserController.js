const User = require('../models/user')
const express = require('express')
const { createToken, validateToken } = require('../midill/JWT/JWT'); 
const bcrypt = require("bcrypt"); 
const { sign, verify } = require('jsonwebtoken')
const axios = require('axios').default;



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
const SECRET_KEY = '6LddytQkAAAAAHHRyYuAnU5wmOBTwAkLZzS3mfEC'
const register = (req, res) => {
    try{
        const { username, password, name, email,token, image, role, location, phone } = req.body;
        axios({
            url:`https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`,
            method: 'POST'
        }).then(({data}) => {
            console.log(" your data : === ",data);
            if(data.success){
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
                        console.log(" your token ==== ",token);
                    }).catch((err) => {
                        if (err) {
                            res.status(400).json({error : err})
                        }
                    })
                })
            }else{
                return res.status(400).json({message: 'RECAPTCHA VERIFICATION FIELD! '})
            }
        }).catch(error => {
            res.status(400).json({message: 'INVALID Recaptcha '})
        })
    }catch{
        console.log(error)
        res.status(400).json(error)
    }

}

const login = async (req, res) => {
    const { username, password } = req.body; 
    const user = await User.findOne({ username: username }); 

    if (!user) res.status(400).json({ error: "User doesn't exist" })
    else {
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
    }
}

const getAll = async (req, res, next) => {
    try {
        User.find({}).then(result => {
            res.send(result)
        })
    } catch (err) {
        console.log(err)
    } //kk
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

/*

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
}*/
/*
const deleteUser = async (req, res) => {
    try {
        // connectedUserId = getConnectedUserId(req); 
        // Connected = await User.findById(connectedUserId); 
        
        if (Connected.role == "admin") {
            await User.findByIdAndRemove(req.params.id)
            res.send("User deleted!")
        } else {
            console.log("kkkkkkkkk")
            res.send("You must be an admin to delete another users!")
        }

    } catch (err) {
        res.send(err)
    }
}*/

/*
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
*/
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

// admin add user 

const addUser = async (req, res) => {
    try {
        const { username, password, name, email, image, role, location, phone } = req.body;

        const hash = await bcrypt.hash(password, 10);

        await User.create({
            username: username,
            password: hash,
            name: name,
            email: email,
            image: image,
            role: role || "simple",
            location: location,
            phone: phone,
            createdAt: new Date(),
            active : true
        });

        res.json("USER REGISTERED");

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}
// admin delete user 
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
    
        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        // Delete user
        await User.findByIdAndRemove(id);
    
        res.json({ message: "User deleted" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
}
//admin ban user
const banUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        if(user.active==true){
        await User.findByIdAndUpdate(req.params.id, { active: false });
        res.send("User banned!");   }
        else{
            await User.findByIdAndUpdate(req.params.id, { active: true });
            res.send("User banned!"); 
        }
        
    } catch (err) {
        res.send(err)
    }
}
//update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, name, email, image, role, location, phone, active } = req.body;

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Update user
        const hash = await bcrypt.hash(password, 10);
        user.username = username;
        user.password = hash;
        user.name = name;
        user.email = email;
        user.image = image;
        user.role = role || "simple";
        user.location = location;
        user.phone = phone;
        user.active = active;

        await user.save();

        res.json({ message: "User updated", user: user });

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}


module.exports = { register, login, profile, getAll, updateUser, deleteUser, banUser, logout,addUser }
