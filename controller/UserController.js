const User = require('../models/user')
const express = require('express')
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { createToken, validateToken } = require('../midill/JWT/JWT'); 
const bcrypt = require("bcrypt"); 
const { sign, verify } = require('jsonwebtoken')
require('dotenv').config();
const mongoose = require('mongoose'); 

const fetch = require('node-fetch');
const user = require('../models/user');
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy
const path = require('path');

const { Canvas, Image, ImageData } = require('canvas');
const faceapi = require('face-api.js');
const { Blob } = require('buffer');
const axios = require('axios').default;
const expressAsyncHandler = require("express-async-handler");
const mailingService = require('../utils/MailingService')


const multer = require('multer');
const fs = require('fs');


//const cv = require('opencv-wasm');




const projectDir = process.cwd();
const imagesDir = path.join(projectDir, 'public/uploads');
const newpath = path.join(projectDir, 'public/new_uploads');

const NodeWebcam = require('node-webcam');
const { Console } = require('console');

var options = {
    width: 1280,
    height: 720,
    quality: 100,
    delay: 1,
    saveShots: true,
    output: "jpeg",
    device: false,
    callbackReturn: "location"
};


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
                    }).then((user) => {
                      userId = user._id;
                      console.log(User.password)
                      const url = `${req.protocol}://${req.get("host")}/user/verify/${userId}`;
                      mailingService.sendVerificationEmail(user, url).then(()=>{
                          res.json("USER REGISTERED check your email");
                        console.log(" your token ==== ",token);
                      }).catch((e)=>{
                        console.log(e);
                    })

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


// const update = async (req, res) => {
//     try {
        
//         connectedUserId = getConnectedUserId(req);

//         if (connectedUserId == req.body["_id"]) {
//             await User.findByIdAndUpdate(connectedUserId, req.body).then(result => {
//                 res.send("User updated!")
//             })
//         } else {
//             res.send("You can't update another user.")
//         }
//     } catch (err) {
//         res.send(err)
//     }
// }

// const deleteUser = async (req, res) => {
//     try {
//         connectedUserId = getConnectedUserId(req); 
//         Connected = await User.findById(connectedUserId); 
        
//         if (Connected.role == "admin") {
//             await User.findByIdAndRemove(req.params.id)
//             res.send("User deleted!")
//         } else {
//             res.send("You must be an admin to delete another users!")
//         }

//     } catch (err) {
//         res.send(err)
//     }
// }


// const banUser = async (req, res) => {
//     try {
//         connectedUserId = getConnectedUserId(req); 
//         Connected = await User.findById(connectedUserId); 
//         if (Connected["role"] == "admin") {
//             User.findByIdAndUpdate(req.params.id, { active: false });
//             res.send("User banned!")
//         } else {
//             res.send("You must be an admin to ban a user."); 
//         }
//     } catch (err) {
//         res.send(err)
//     }
// }
const banUser2 = async (req, res) => {
  try {
      connectedUserId = getConnectedUserId(req); 
      Connected = await User.findById(connectedUserId); 
      if (Connected["role"] == "admin") {
          const u = await User.findById(req.params.id);
          if (u.active == true) {
              await User.findByIdAndUpdate(req.params.id, { active: false });
              res.send("User banned!");
          } else {
              await User.findByIdAndUpdate(req.params.id, { active: true });
              res.send("User unbanned!");
          }
          
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
    let user;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      user = await User.findById(req.params.id);
    } else {
      user = await User.findOne({ facebookId: req.params.id });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = req.body.token;
    console.log("Token:", token);

    const verified = speakeasy.totp.verify({
      secret: user.secret, // Use the user's secret here
      encoding: "base32",
      token: token,
      window: 2,
    });
    console.log("Verified:", verified);

    if (!verified) {
      return res.status(400).json({ message: "Invalid OTP token" });
    }

    // Mark user as verified
    user.twoFactorVerified = true;
    await user.save();
    console.log("User saved:", user);

    return res.json({ message: "Two-factor authentication has been verified" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};



  
  // Enable two-factor authentication
  const enableTwoFactor = async (req, res) => {
    try {
      let user;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        user = await User.findById(req.params.id);
      } else {
        user = await User.findOne({ facebookId: req.params.id });
      }
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const secret = speakeasy.generateSecret({ length: 20 });
      await user.updateOne({ secret: secret.base32, twoFactorEnabled: true });
  
      const otpAuthUrl = `otpauth://totp/${user.username}?secret=${secret.base32}&issuer=PetConnection`;
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
      let user;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        user = await User.findById(req.params.id);
      } else {
        user = await User.findOne({ facebookId: req.params.id });
      }
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.secret = null;
      user.twoFactorEnabled = false;
      user.twoFactorVerified = false;
  
      await user.save();
  
      res.json({ message: "Two-factor authentication has been disabled" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

  const facebooklogin = async (req, res) => {
    const {userId, facebookId, name, email, image,username,
      password,
      role,twoFactorEnabled } = req.body;
  
    try {
      let user = await User.findOne({ email });
  
      if (user) {
        console.log('User already exists:', user);
       
      } else {
        user = new User({
          userId,
          facebookId,
          name,
          email,
          image,
          username,
          password,
          role,
          twoFactorEnabled
        });
   const accessToken = createToken(user);
        res.cookie("access-token", accessToken, {
            maxAge: 60 * 60 * 24 * 30 * 1000
        }) // cookie expires after 30 days

        req.session.user = user; 
        res.json(req.session.user);
        console.log(user)
        console.log(res.cookie)
        //res.send(user)
        await user.save();
       
        console.log('New user created:', user);
      }
  
      res.json({ success: true, message: 'Data received' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  
// ====== google ==========

const loginGoogle = async (req, res) => {
  const { username, name, image, email, google ,twoFactorEnabled} = req.body;
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
              google : google,
              twoFactorEnabled: twoFactorEnabled
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


//=== AI recog
// create instance using the above options








const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "public/uploads");
  },

  filename: function (req, file, cb) {
      cb(null, req.params.id + file.originalname); // nom de l'image dans public/uploads= idUser+nomImage
  },
});


//const upload = multer({ storage: storage });


//controle de saisie sur image
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
  } else {
      cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5 // 5 MB
  // },
  // fileFilter: fileFilter

});
const updateuser = async (req, res) => {



  //    const connectedUserId = getConnectedUserId(req); 
  //    const connectedUserId = "64065e26c601ae53912b5476"; //test user sur la base mongo cloud 

  //  const connectedUserId= await User.findById()


  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      user = await User.findById(req.params.id);
    } else {
      user = await User.findOne({ facebookId: req.params.id });
    }

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const { username, password, name, email, role, location, phone } = req.body;

      // Hash the password
      //const hash = await bcrypt.hash(password, 10);

      // Set the updated fields
      const updatedFields = {
          username: req.body.username,
          password: req.body.password,
          name: req.body.name,
          email: req.body.email,
          role: "simple",
          location: req.body.location,
          phone: req.body.phone,
          createdAt: new Date(),
          active: true,
          image: req.params.id + req.file.originalname, //image = id+ nom image
      };

      // Update the user
      user = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
      // console.log(Connected)
      res.json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }




}

///////////get image user/////////
const getUserImage = async (req, res) => {
  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      user = await User.findById(req.params.id);
    } else {
      user = await User.findOne({ facebookId: req.params.id });
    }

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Vérifier si l'utilisateur a une image
      if (!user.image) {
          return res.status(404).json({ message: 'User has no image' });
      }

      // Envoyer l'image au client

      res.sendFile(path.join(__dirname, '..', 'public', 'uploads', user.image));

      console.log(path.join(__dirname, '..', 'public', 'uploads', user.image))

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};
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
const verifyUser = async (req, res, next) => {
  try {
      
      const user = await User.findById(req.params.userId);

      user.isUserVerified = true;

      await user.save();
      res.status(200).json( 'Account verified');
  } catch (err) {
      res.status(400).json({error: err.message});
  }
}

module.exports = { register, login, profile, getAll, deleteUser, banUser, logout ,twofactorverification,enableTwoFactor,disableTwoFactor,facebooklogin, loginGoogle, promoteUser,upload, getUserImage,updateuser,updateUser, deleteUser, banUser,addUser,banUser2,updateUserPasswordCtrl,forgetPasswordToken,passwordResetCtrl,verifyUser}
