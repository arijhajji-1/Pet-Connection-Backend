const express = require('express')
const router = express.Router();
const User = require('../../models/user')
const cookieParser = require("cookie-parser")
const bodyparser = require("body-parser")  
router.use(express.json())
router.use(cookieParser())


const { createToken, validateToken } = require('../../midill/JWT/JWT'); 
const { register, login, profile, getAll, update, deleteUser, banUser, logout, loginGoogle } = require("../../controller/UserController")

 // ========== routes

router.post("/register", register)

router.post("/login", login )

router.get("/all", getAll )

router.put("/update/:id", validateToken, update)

router.delete("/delete/:id", validateToken, deleteUser)

router.get("/profile/:id", validateToken, profile )
 
router.get("/ban/:id", validateToken, banUser)

router.post('/logout', validateToken, logout);

router.post("/loginGoogle", loginGoogle);



module.exports = router; 