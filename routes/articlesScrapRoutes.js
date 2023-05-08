const express = require('express')
const router = express.Router();
const articleScrapController = require('../controller/articleScrapController');
const cookieParser = require("cookie-parser")

router.use(express.json())
router.use(cookieParser())



router.get("/getInformations",articleScrapController.getInformations);
router.get("/getInformation",articleScrapController.getInformation);

module.exports = router; 

