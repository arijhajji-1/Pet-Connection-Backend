const express = require("express");
const router = express.Router();
const Association = require("../../models/association");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
router.use(express.json());
router.use(cookieParser());

const { upload } = require("../../controller/UserController");

const {
    addFunding,
    getAllFunding,
    getOneFunding,
    getFundingByAssociation,
    addTotalFunding,
    deleteFunding,
    editFunding,
    avatar
} = require("../../controller/FundingController") ;


router.post("/addFunding", upload.single("file"), addFunding);
router.get("/allFunding", getAllFunding); 
router.get("/getOneFunding/:id", getOneFunding); 
router.get("/getFundingByAssociation/:id", getFundingByAssociation); 
router.put("/addTotalFunding/:id", addTotalFunding); 
router.delete("/deleteFunding/:id",  deleteFunding); 
router.put("/editFunding/:id", upload.single("file"),  editFunding); 


router.post("/avatar", avatar);


module.exports = router; 
