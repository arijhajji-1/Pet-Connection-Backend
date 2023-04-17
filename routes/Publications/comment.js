const express=require('express');
const router=express.Router();
const User = require('../../models/user')
const bodyparser = require("body-parser")
const controllerComment=require("../../controller/commentController")
const bcrypt = require("bcrypt"); 
const cookieParser = require("cookie-parser")

router.use(express.json())
router.use(cookieParser())



const { createToken, validateToken } = require('../../midill/JWT/JWT'); 






router.post("/addCommnet",controllerComment.addComment);

router.put('/updateCommnet/:id',validateToken,controllerComment.updateComment);

router.delete('/deleteCommnet/:id',controllerComment.deleteComment);

router.get('/getallCommnetByPublicationId/:idPub/allcomments',controllerComment.getallCommentsByIdPublication);



router.post('/replytoComment/:commentId/reply',controllerComment.replytoComment);

router.get('/getreplyById/:id/getreply',controllerComment.getreplyByID);


router.get('/getCommnetById/:id/getcomment',controllerComment.getCommnetById);

//////////////////////////reply////////


router.delete('/deleteReply/:id',controllerComment.deleteReply);























module.exports=router;



