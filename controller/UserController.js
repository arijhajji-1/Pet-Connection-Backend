const User = require('../models/user')
const express = require('express')
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { createToken, validateToken } = require('../midill/JWT/JWT'); 
const bcrypt = require("bcrypt"); 
const { sign, verify } = require('jsonwebtoken')
require('dotenv').config();

const fetch = require('node-fetch');
const user = require('../models/user');
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy





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
                console.log(user)
                console.log(res.cookie)
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

   


  const twofactorverification = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  console.log(user)
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const token = req.body.token;
  
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: token,
        window: 2,
      });
  
      if (!verified) {
        return res.status(400).json({ message: "Invalid OTP token" });
      }
  
      // Mark user as verified
      user.twoFactorVerified = true;
      await user.save();
  
      return res.json({ message: "Two-factor authentication has been verified" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Enable two-factor authentication
const enableTwoFactor = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const secret = speakeasy.generateSecret({ length: 20 });
      await User.findByIdAndUpdate(req.params.id, { secret: secret.base32, twoFactorEnabled: true });
     
      await user.save();
  
      const otpAuthUrl = `otpauth://totp/${user.username}?secret=${secret.base32}&issuer=My%20App`;
      const qrCode = await qrcode.toDataURL(otpAuthUrl);
  
      res.json({
        secret: secret.base32,
        qrCode,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Disable two-factor authentication
  const disableTwoFactor = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await User.findByIdAndUpdate(req.params.id, { secret: null, twoFactorEnabled: false ,twoFactorVerified: false});

    
      await user.save();
  
      res.json({ message: "Two-factor authentication has been disabled" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

  const facebooklogin = async (req, res) => {
    const { facebookId, name, email, image,username,
      password,
      role } = req.body;
  
    try {
      let user = await User.findOne({ email });
  
      if (user) {
        console.log('User already exists:', user);
      } else {
        user = new User({
          facebookId,
          name,
          email,
          image,
          username,
          password,
          role
        });
  
        await user.save();
        console.log('New user created:', user);
      }
  
      res.json({ success: true, message: 'Data received' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  // const { userID, accessToken } = req.body;

  // const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  // return (
  //   fetch(url, {
  //     method: "GET",
  //   })
  //     .then((response) => response.json())
  //     // .then(response => console.log(response))
  //     .then((response) => {
  //       const { email, name } = response;
  //       User.findOne({ email }).exec((err, user) => {
  //         if (user) {
  //           const token = jwt.sign({ _id: user._id }, process.env.MY_JWT_SIGNIN_KEY, {
  //             expiresIn: "7d",
  //           });
  //           const { _id, name,username, email, password,role} = user;
  //           return res.json({
  //             token,
  //             user: { _id, name,username, email, password,role },
  //           });
  //         } else {
  //           let password = email + process.env.MY_JWT_SIGNIN_KEY;
  //           user = new User({ name, email, password });
  //           user.save((err, data) => {
  //             if (err) {
  //               console.log("ERROR FACEBOOK LOGIN ON USER SAVE", err);
  //               return res.status(400).json({
  //                 error: "User signup failed with facebook",
  //               });
  //             }
  //             const token = jwt.sign(
  //               { _id: data._id },
  //               process.env.MY_JWT_SIGNIN_KEY,
  //               { expiresIn: "7d" }
  //             );
  //             const { _id, name,username, email, password,role } = data;
  //             return res.json({
  //               token,
  //               user: { _id, name,username, email, password,role },
  //             });
  //           });
  //         }
  //       });
  //     })
  //     .catch((error) => {
  //       res.json({
  //         error: "Facebook login failed. Try later",
  //       });
  //     })
  // );

module.exports = { register, login, profile, getAll, update, deleteUser, banUser, logout ,twofactorverification,enableTwoFactor,disableTwoFactor,facebooklogin}
