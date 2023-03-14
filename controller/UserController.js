const User = require('../models/user')
const express = require('express')
const {createToken, validateToken} = require('../midill/JWT/JWT');
const bcrypt = require("bcrypt");
const {sign, verify} = require('jsonwebtoken')
const mailingService = require('../utils/MailingService')
const crypto = require('crypto')

const expressAsyncHandler = require("express-async-handler");


// =============== LOGINED USER =========================


const getConnectedUserId = (req) => {
    // get User
    const accessToken = req.cookies["access-token"];
    if (!accessToken) {
        return res.status(401).json({message: "Access token not found"});
    }
    const decodedToken = verify(accessToken, "azjdn1dkd3ad");
    req.userId = decodedToken.id;

    return req.userId;
    //const user = await User.findById(req.userId);
    //res.send(user)
}


// =============== APIs ===========================

const register = (req, res) => {
    const {username, password, name, email, image, role, location, phone} = req.body;

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
            active: true
        }).then((user) => {
            userId = user._id;
            console.log(User.password)
            const url = `${req.protocol}://${req.get("host")}/user/verify/${userId}`;
            mailingService.sendVerificationEmail(user, url).then(()=>{
                console.log("jaw");
                res.json("USER REGISTERED check your email");
            }).catch((e)=>{
                console.log(e);
            })
            
        }).catch((err) => {
            if (err) {
                res.status(400).json({error: err})
            }
        })
    })
}

const verifyUser = async (req, res, next) => {
    try {
        
        const user = await User.findById(req.params.userId);

        user.isUserVerified = true;

        await user.save();
        res.status(200).json({message: 'Account verified'});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

const login = async (req, res) => {
    const { username, password } = req.body; 
    const user = await User.findOne({ username: username });
    /*const { email, password } = req.body; 
    const user = await User.findOne({ email: email }); */

    if (!user) res.status(400).json({ error: "User doesn't exist" })
    else {
        const dbPassword = user.password
        bcrypt.compare(password, dbPassword).then((match) => {
            if (!match) {
                res.status(400).json({
                    error: "Wrong email and password combination"
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


/*const login = expressAsyncHandler(async (req, res) => {
    const {email, password} = req.body;
//console.log({email, password})
    const userFound = await User.findOne({email});
    console.log({email})
    if (userFound && (await userFound.isPasswordMatched(password))) {
        console.log({password})
        res.json({
            _id: userFound?._id,
            name: userFound?.name,
            email: userFound?.email,
            image: userFound?.image,
            role: userFound?.role,
            location: userFound?.location,
            phone: userFound?.phone,
            token: createToken(userFound?._id),
        });

    } else {
        res.status(401);
        throw new Error("invalid email or password ");
    }
});
*/
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
    } catch (err) {
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
            User.findByIdAndUpdate(req.params.id, {active: false});
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

//------------------------------
//Forget token generator
//------------------------------

const forgetPasswordToken = async (req, res) => {
    //find the user by email
    const {email} = req.body;
console.log(email)
    const user = await User.findOne({email});
    //console.log(user);
    if (!user) throw new Error("User Not Found");

    try {
        //Create token
        const token = await user.createPasswordResetToken();
        //console.log(token);
        await user.save();

        //build your message
        const resetURL = `If you were requested to reset your password, reset now within 10 minutes, otherwise ignore this message <a href="http://localhost:3001/resetpassword/${token}">Click to Reset</a>`;
        const msg = {
            to: email,
            from: "yosramekaoui@gmail.com",
            subject: "Reset Password",
            html: resetURL,
        };
        console.log(msg);
        await mailingService.sendEmail(msg.to, msg.subject, resetURL);
        res.json({
            msg: `A verification message is successfully sent to ${user?.email}. Reset now within 10 minutes, ${resetURL}`,
        });
    } catch (error) {
        res.json({message: error});
    }
};

//------------------------------
//Password reset
// http://localhost:3000/user/reset-password
//------------------------------

const passwordResetCtrl = async (req, res) => {
    const {token, password} = req.body;
    
    const pass = await bcrypt.hash(password, 10);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
 console.log(hashedToken);
    //find this user by token
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()},
    });
    if (!user) throw new Error("Token Expired, try again later");

    //Update/change the password
    user.password = pass;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
}
//Update password  done

const updateUserPasswordCtrl = expressAsyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {newpassword, password} = req.body;
    validateMongodbId(_id);

    const user = await User.findById(_id);
    if (await user.isPasswordMatched(password)) {
        if (!newpassword) {
            res.json({
                status: "200",
                message: "please provide the new password",
            });
        } else {
            user.password = newpassword;
            const updatedUser = await user.save();
            res.json({
                user: updatedUser,
                msg: "password updated ",
            });
        }
    } else {
        res.json({
            status: "400",
            message: "password incorrect",
        });
    }
});
module.exports = {
    register,
    login,
    profile,
    getAll,
    update,
    deleteUser,
    banUser,
    logout,
    forgetPasswordToken,
    passwordResetCtrl,
    updateUserPasswordCtrl,
    verifyUser
}
