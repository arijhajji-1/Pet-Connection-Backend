const express = require('express')
const router = express.Router();
const cookieParser = require("cookie-parser")
const  paymentController=require("../../controller/paymentController");
router.use(express.json())
router.use(cookieParser())


const { validateToken } = require('../../midill/JWT/JWT')

router.post("/create",paymentController.create);

module.exports = router; 
