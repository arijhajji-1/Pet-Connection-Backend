const express = require('express')
const router = express.Router();
const bodyparser = require("body-parser")
const cartController = require('../../controller/cartController');
const bcrypt = require("bcrypt"); 
const cookieParser = require("cookie-parser")

router.use(express.json())
router.use(cookieParser())

const { validateToken } = require('../JWT/JWT'); 

router.post("/addCart",validateToken,cartController.addCart);
router.put("/updateCart/:id",cartController.updateCart);
router.delete("/deleteCart/:id",cartController.deleteCart);
router.get("/getCartById/:userId",validateToken,cartController.getCartById);
router.get("/getAll",validateToken,cartController.getAll);





const { sign, verify } = require('jsonwebtoken')


module.exports = router; 
