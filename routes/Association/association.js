const express = require("express");
const router = express.Router();
const Association = require("../../models/association");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
router.use(express.json());
router.use(cookieParser());

const multer = require("multer");
const path = require("path");



const { upload } = require("../../controller/UserController");

const { addAssociation, getAllAssociations } = require("../../controller/AssociationController");

router.post("/addAssociation",  upload.single('file'), addAssociation);
router.get("/allAssociations",   getAllAssociations);






module.exports = router; 
