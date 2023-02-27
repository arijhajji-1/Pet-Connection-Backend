const express = require('express')
const router = express.Router();
const bodyparser = require("body-parser")
const orderController = require('../../controller/orderController');
const bcrypt = require("bcrypt"); 
const cookieParser = require("cookie-parser")

router.use(express.json())
router.use(cookieParser())

const { validateToken } = require('../JWT/JWT'); 

router.post("/addOrder",validateToken,orderController.addOrder);
router.put("/updateOrder/:id",validateToken,orderController.updateOrder);
router.delete("/deleteOrder/:id",validateToken,orderController.deleteOrder);
router.get("/getOrderById/:userId",validateToken,orderController.getOrderById);
router.get("/getAll",validateToken,orderController.getAll);
router.get("/income",validateToken,orderController.income);






const { sign, verify } = require('jsonwebtoken')


module.exports = router; 
