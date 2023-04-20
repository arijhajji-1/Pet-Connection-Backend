const express=require('express');
const router=express.Router();
const User = require('../../models/user')
const bodyparser = require("body-parser")
const controllerPublication=require("../../controller/publicationContoller")
const bcrypt = require("bcrypt"); 
const cookieParser = require("cookie-parser")

router.use(express.json())
router.use(cookieParser())



const { createToken, validateToken } = require('../../midill/JWT/JWT'); 

// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null,Date.now() + "-" + file.originalname);
//   },
// });





// const upload = multer({ storage: storage });




// router.post("/addPublication",validateToken,controllerPublication.upload.single("image"),controllerPublication.addPublication);
  
router.post("/addPublication",controllerPublication.addPublication);

// router.put('/updatepublication/:id',validateToken,controllerPublication.updatePublication);


router.put('/updatepublication/:idpub',controllerPublication.updatePublication2);


// router.delete('/deletepublication/:id',validateToken,controllerPublication.deletePublication);

router.delete('/deletepublication/:idpub',controllerPublication.deletepub);



router.put('/BloquerPublication/:id',controllerPublication.BloquerPublication);

router.put('/ActiverPublication/:id',controllerPublication.ActiverPublication);






router.get('/getallpublicaion',controllerPublication.getallpublicaion);
router.get('/getNewestPubs',controllerPublication.getNewestPubs);


router.get('/getPubbyid/:id',controllerPublication.getpublicaionById);


router.get('/imagePublication/:id/image',controllerPublication.getPublicationImage);

router.get('/getOwnerPublication/:idpub',controllerPublication.getOwnerPublication);

router.get('/getallpublicaionByUserId',controllerPublication.getallpublicaionByUserId);





router.post('/:publicationId/vote', controllerPublication.addVotePub);


router.delete('/:publicationId/vote/:userId/deletevote', controllerPublication.deleteVotePub )


router.get('/publications/:id/votes/up',controllerPublication.voteUpNumber); 


router.get('/publications/:id/votes/down', controllerPublication.voteDownNumber);


router.get('/filter', controllerPublication.filter) 



router.get('/filterOpt', controllerPublication.filterOpt) 



// router.post('/checkImage',controllerPublication.checkImage);

module.exports=router;