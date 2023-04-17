const express = require('express');
const Publication = require("../models/Publication")

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");



const uuid = require('uuid'); // import the uuid package



const { sign, verify } = require('jsonwebtoken')



const multer = require("multer");

// 

const bodyParser = require('body-parser');
const clarifai = require('clarifai');
const axios = require('axios');

// 

//add publication
// async function addPublication(req, res, next) {

//   try {
//     const uniqueFilename = uuid.v4() + '-' + req.file.originalname;



//     const accessToken = req.cookies["access-token"];

//     if (!accessToken) {
//       return res.status(401).json({ message: "Access token not found" });
//     }

//     const decodedToken = verify(accessToken, "azjdn1dkd3ad");

//     const userconnecte = await User.findById(decodedToken.id);
//     console.log("user --> " + userconnecte)




//     const publication = new Publication({
//       titre: req.body.titre,
//       description: req.body.description,
//       like: req.body.like,
//       dislike: req.body.dislike,
//       createdAt: req.body.createdAt,
//       modifiedAt: req.body.modifiedAt,
//       category: req.body.category,
//       user: userconnecte,
//       comments: req.body.comments,
//       image: "Pub" + uniqueFilename //image = id+ nom image
//     });




//     const storage = multer.diskStorage({
//       destination: function (req, file, cb) {
//         cb(null, "public/uploads");
//       },
//       filename: function (req, file, cb) {
//         cb(null,"Pub" + uniqueFilename);
//       },
//     });


//     const upload = multer({ storage: storage });

//     upload.single('image')(req, res, function (err) {
//       if (err instanceof multer.MulterError) {
//         // A Multer error occurred when uploading.
//         console.log(err);
//       } else if (err) {
//         // An unknown error occurred when uploading.
//         console.log(err);
//       }
//     });




//       publication.save((err, data) => {
//         if (err) {
//           console.log(err);

//         }
//         console.log(data);
//         return res.json(data);
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   }



async function addPublication(req, res, next) {

  try {
    // const accessToken = req.cookies["access-token"];

    // if (!accessToken) {
    //   return res.status(401).json({ message: "Access token not found" });
    // }

    // const decodedToken = verify(accessToken, "azjdn1dkd3ad");


    const userId = req.query.userid;

    const userconnecte = await User.findById(userId);
    console.log("user de addpublication --> " + userconnecte)

    // const uniqueFilename = `${uuid.v4()}-${req.file.originalname}`;

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "public/uploads");
      },
      filename: function (req, file, cb) {
        cb(null, "Pub" + file.originalname);
      },
    });

    const upload = multer({ storage: storage });

    upload.single('image')(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log(err);
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log(err);
      }

      const publication = new Publication({
        titre: req.body.titre,
        description: req.body.description,
        like: req.body.like,
        dislike: req.body.dislike,
        createdAt: req.body.createdAt,
        modifiedAt: req.body.modifiedAt,
        category: req.body.category,
        user: userconnecte,
        comments: req.body.comments,
        image: "Pub" + req.file.originalname
      });

      console.log("----- > " + req.file.originalname)

      publication.save((err, data) => {
        if (err) {
          console.log(err);
        }
        console.log(data);
        return res.json(data);
      });
    });
  } catch (err) {
    console.log(err);
  }
}


//delete publication

async function deletepub(req, res) {

  try {

    // admin ou le proprietaire de la publication peut la supprime
    console.log("pub a supprime --> " + req.params.idpub)


    const publication = await Publication.findById(req.params.idpub);

    console.log("pub a supprime --> " + publication)


    if (!publication) {
      return res.status(404).json({ error: 'Publication not found' });
    }
    await publication.remove();
    res.json({ message: 'publication deleted successfully' });




  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

}





async function updatePublication(req, res, next) {

  //get user 
  // const accessToken = req.cookies["access-token"];

  // if (!accessToken) {
  //   return res.status(401).json({ message: "Access token not found" });
  // }


  const { id } = req.params;
  console.log("--id pub-->>" + id)
  try {
    const publication = await Publication.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );


    if (!publication) throw new Error('publication not found');
    res.json(publication);
  } catch (err) {
    res.status(400).json({ message: err.message });

  }

}


async function updatePublication2(req, res) {


  try {
    ///////

    // const accessToken = req.cookies["access-token"];

    // if (!accessToken) {
    //   return res.status(401).json({ message: "Access token not found" });
    // }

    // const decodedToken = verify(accessToken, "azjdn1dkd3ad");

    // const userconnecte = await User.findById(decodedToken.id);
    // console.log("user --> " + userconnecte)





    /////

    // const userId = req.query.userid;
    const userconnecte = "641a169060dead44641c8682";


    const { idpub } = req.params;
    const { titre, description, like, dislike, createdAt, modifiedAt, category, image, comments } = req.body;


    // Check if pub exists
    const publication = await Publication.findById(idpub);
    console.log("publication-->" + publication)
    if (!publication) {
      return res.status(404).json({ message: "Publication not found" });
    }

    // Update user

    publication.titre = req.body.titre;
    publication.description = req.body.description;
    // publication.like = like;
    // publication.dislike = dislike;
    // publication.createdAt = createdAt;
    // publication.modifiedAt = modifiedAt;
    publication.category = req.body.category;
    publication.user = userconnecte;
    publication.image = req.body.image;
    // publication.comments = comments;

    await publication.save();

    res.json({ message: "publication updated", publication: publication });
    console.log("publication-->" + publication)


  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }


}






//----------------------------------------------


async function getallpublicaion(req, res) {

  try {

    const userId = req.query.userid;
    console.log('userid - > ' + userId);

    /////////////////

    /////////////////

    const user = await User.findById(userId);

    // const user = await User.findById("641a169060dead44641c8682");




    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // console.log("--token----> " + accessToken)
    const data = await Publication.find();
    res.send(data);
  } catch (err) {
    res.send(err)
  }
}



///////////get pub bu user id

async function getallpublicaionByUserId(req, res) {

  try {

    const userId = req.query.userid;
    console.log('userid - > ' + userId);

    /////////////////

    /////////////////

    const user = await User.findById(userId);

    // const user = await User.findById("641a169060dead44641c8682");




    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }

    // console.log("--token----> " + accessToken)
    // const data = await Publication.find();
    const data = await Publication.find({ user: userId });

    res.send(data);
  } catch (err) {
    res.send(err)
  }
}








const getPublicationImage = async (req, res) => {
  try {
    let publication;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      publication = await Publication.findById(req.params.id);
    }

    if (!publication) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    // Vérifier si l'utilisateur a une image
    if (!publication.image) {
      return res.status(404).json({ message: 'publication has no image' });
    }

    // Envoyer l'image au client

    res.sendFile(path.join(__dirname, '..', 'public', 'uploads', publication.image));

    console.log(path.join(__dirname, '..', 'public', 'uploads', publication.image))

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// 




// 






async function getNewestPubs(req, res) {

  try {


    const userId = req.query.userid;
    console.log('userid - > ' + userId);

    /////////////////

    /////////////////

    const user = await User.findById(userId);

    // const user = await User.findById("641a169060dead44641c8682");




    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // console.log("--token----> " + accessToken)
    const data = await Publication.find().sort({ createdAt: 'desc' }).limit(2)

    res.send(data);
  } catch (err) {
    res.send(err)
  }

}



//----------------------------------------------

async function getpublicaionById(req, res) {
  try {

    //verifier le token 
    // const accessToken = req.cookies["access-token"]; //token
    // if (!accessToken) {
    //   return res.status(401).json({ message: "Access token not found" });
    // }

    //get publication
    const data = await Publication.findById(req.params.id);
    res.send(data)
  } catch (err) {
    res.send(err)
  }
}






// async function BloquerPublication(req, res) {

//    await Publication.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true })
//   .then(publication => {
//     res.json(publication);
//   })
//   .catch(err => {
//     res.status(500).send({ message: err.message });
//   });

// }



async function BloquerPublication(req, res) {
  try {
    const publication = await Publication.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    );




    // envoyer un email********************a activé

    // // Trouver les informations de contact du propriétaire
    // const proprietaire = await User.findById(publication.user);
    // const emailDuProprietaire = proprietaire.email;


    //   const transporter = nodemailer.createTransport({
    //     host: "smtp.gmail.com",
    //     port: 465,
    //     secure: true,
    //     auth: {
    //         user: "testini435@gmail.com",
    //         pass: "zinehprkliupnwuk",
    //     },
    // });

    //   // Envoyer l'e-mail au propriétaire
    //   await transporter.sendMail({
    //     from: "ghannay.oussama@esprit.tn",
    //     to: emailDuProprietaire,
    //     subject: "Votre publication a été bloquée",
    //     text: `Bonjour ${proprietaire.name}, votre publication avec le titre ${publication.titre} a été bloquée .`
    //   }).then(()=> console.log("email envoyee"));

    res.json(publication);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}





// async function  ActiverPublication(req, res) {

//   await Publication.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true })
//  .then(publication => {
//    res.json(publication);
//  })
//  .catch(err => {
//    res.status(500).send({ message: err.message });
//  });

// }




// async function ActiverPublication(req, res) {
//   try {
//     const publication = await Publication.findByIdAndUpdate(
//       req.params.id,
//       { isBlocked: false },
//       { new: true }
//     );


// //*******************envoi de email ** a activé


//     // Trouver les informations de contact du propriétaire
//     const proprietaire = await User.findById(publication.user);
//     const emailDuProprietaire = proprietaire.email;

//     // Configurer le transporteur de messagerie pour l'envoi d'e-mails
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//           user: "testini435@gmail.com",
//           pass: "zinehprkliupnwuk",
//       },
//   });

//     // Envoyer l'e-mail au propriétaire
//     await transporter.sendMail({
//       from: "ghannay.oussama@esprit.tn",
//       to: emailDuProprietaire,
//       subject: "Votre publication a été activée",
//       text: `Bonjour ${proprietaire.name}, votre publication avec le titre ${publication.titre} a été activée.`
//     });





//     res.json(publication);
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// }



/////sms
const accountSid = 'ACabe8903c2aa08c9b767532f5b010c5e9';
const authToken = '8ca11d517e3dc7dd33a4784050046caf';
const client = require('twilio')(accountSid, authToken);

async function ActiverPublication(req, res) {
  try {
    const publication = await Publication.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    );



   //////////////////sms  +  mail////////////////////////


    // //*******************envoi de email ** a activé
    // const proprietaire = await User.findById(publication.user);
    // const phoneNumber = proprietaire.phone; // Ajouter le numéro de téléphone du propriétaire de la publication


    // // // Trouver les informations de contact du propriétaire
    // const emailDuProprietaire = proprietaire.email;

    // // Configurer le transporteur de messagerie pour l'envoi d'e-mails
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.gmail.com",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //       user: "testini435@gmail.com",
    //       pass: "zinehprkliupnwuk",
    //   },
    // });

    // // Envoyer l'e-mail au propriétaire
    // await transporter.sendMail({
    //   from: "ghannay.oussama@esprit.tn",
    //   to: emailDuProprietaire,
    //   subject: "Votre publication a été activée",
    //   text: `Bonjour ${proprietaire.name}, votre publication avec le titre ${publication.titre} a été activée.`
    // });


    // //*******************//envoi de email ** a activé

    // // Envoyer un SMS au propriétaire
    // client.messages
    //   .create({
    //      body: `Votre publication avec le titre ${publication.titre} a été activée.`,
    //      from: '+15076903623',
    //     //  to: `+21650672974`
    //      to: `+216${phoneNumber}`
    //    })
    //   .then(message => console.log(message.sid))
    //   .catch(error => console.log(error));


//////////////////sms////////////////////////


    res.json(publication);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}










// -------------------------------


async function getOwnerPublication(req, res) {



  try {
    //verifier le token 
    // const accessToken = req.cookies["access-token"]; //token
    // if (!accessToken) {
    //   return res.status(401).json({ message: "Access token not found" });
    // }
    const publication = await Publication.findById(req.params.idpub);

    //get publication
    const U = await User.findById(publication.user);
    res.send(U)
    console.log("--user-> " + U)

  } catch (err) {
    res.send(err)
  }



}




// const fs = require('fs');


// async function checkImage(req, res) {

//  const image = req.body;

//  const imageBuffer = Buffer.from(image, 'base64');
//  const imageBase64 = imageBuffer.toString('base64');

//   try {
//     console.log("test1")
//     const response = await axios({
//       method: 'post',
//       // url: 'https://api.clarifai.com/v2/models/e0be3b9d6a454f0493ac3a30784001ff/outputs',
//          url: 'https://api.clarifai.com/v2/models/aaa03c23b3724a16a56b629203edc62c/outputs',
//       headers: {
//         'Authorization': '72d791dcb27349c28782b1d9b1a08282',
//         'Content-Type': 'multipart/form-data'
//       },
//       data: {
//         inputs: [{
//           data: {
//             image: {
//               base64: imageBase64
//             }
//           }
//         }]
//       }
//     });


//     console.log("test2")


//     const concepts = response.data.outputs[0].data.concepts;

//     const isBad = concepts.some(concept => {
//       return concept.name === 'bad';
//     });

//     const result = {
//       isBad: isBad,
//       concepts: concepts
//     };

//     res.json(result);
//   } catch (err) {
//     // console.log(err);
//     res.status(400).json('Unable to work with API !!!');
//   }
// };



///////////////////




async function addVotePub (req, res)  {
  try {
    const publicationId = req.params.publicationId;

    const userId = req.body.userId;
    const type = req.body.type;

    const publication = await Publication.findById(publicationId);

    // Vérifier si l'utilisateur a déjà voté pour cette publication
    const userVote = publication.votes.find(vote => vote.userId.toString() === userId.toString());
    if (userVote) {
      // return res.status(400).json({ message: 'Vous avez déjà voté pour cette publication.' });
      return res.status(200).json({ message: 'dejavote' });

    }

    // Ajouter le vote à la publication
    publication.votes.push({ userId, type });
    if (type === 'voteUp') {
      publication.voteUp++;
    } else if (type === 'voteDown') {
      publication.voteDown++;
    }
    await publication.save();

    // res.json(publication);

     res.status(200).json({ message: 'voteeffectuee' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors du vote pour la publication.' });
  }
};











  async function deleteVotePub  (req, res)  {

  try {
    const publicationId = req.params.publicationId;
    const userId = req.params.userId;

    const publication = await Publication.findById(publicationId);

    // Vérifier si l'utilisateur a voté pour cette publication
    const userVoteIndex = publication.votes.findIndex(vote => vote.userId.toString() === userId.toString());
    if (userVoteIndex === -1) {
      return res.status(200).json({ message: 'Vous n\'avez pas encore voté pour cette publication.' });
    }

    // Supprimer le vote de la publication
    const { type } = publication.votes[userVoteIndex];
    publication.votes.splice(userVoteIndex, 1);
    if (type === 'voteUp') {
      publication.voteUp--;
    } else if (type === 'voteDown') {
      publication.voteDown--;
    }
    await publication.save();

    // res.json(publication);
    res.status(200).json({ message: 'Votre vote est bien retire .' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression du vote pour la publication.' });
  }
};














async function voteUpNumber  (req, res)  {
  try {
    const publication = await Publication.findById(req.params.id);
    const voteUpCount = publication.votes.filter(vote => vote.type === 'voteUp').length;
    res.json({ count: voteUpCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





  async function voteDownNumber  (req, res)  {

  try {

    const publication = await Publication.findById(req.params.id);
    const voteDownCount = publication.votes.filter(vote => vote.type === 'voteDown').length;
    res.json({ count: voteDownCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



async function filter (req, res) {
  try {
    const category = req.query.category;
    const titre = req.query.titre;



    let query = {};

    if (category) {
      query.category = category;
    }

    if (titre) {
      query.titre = { $regex: titre, $options: 'i' };
    }

    const publications = await Publication.find(query);
    res.json(publications);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};



// async function filterOpt (req, res) {
// try {
//   const category = req.query.category;
//   const titre = req.query.titre;
//   let query = {};

//   if (category) {
//     query.category = category;
//   }

//   if (titre) {
//     query.titre = { $regex: titre, $options: 'i' };
//   }

//   if (req.query.votes === 'up') {
//     query.voteUp = { $gt: query.voteDown };
//   } else if (req.query.votes === 'down') {
//     query.voteUp = { $lt: query.voteDown };
//   }

//   const publications = await Publication.find(query);
//   res.json(publications);
// } catch (err) {
//   console.error(err);
//   res.status(500).send('Erreur serveur');
// }


// }





async function filterOpt (req, res) {
  try {
    const category = req.query.category;
    const titre = req.query.titre;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (titre) {
      query.titre = { $regex: titre, $options: 'i' };
    }

    if (req.query.votes === 'up') {
      query.voteDiff = { $gt: 0 };
    } else if (req.query.votes === 'down') {
      query.voteDiff = { $lt: 0 };
    }

    const publications = await Publication.aggregate([
      {
        $addFields: {
          voteDiff: { $subtract: ['$voteUp', '$voteDown'] }
        }
      },
      {
        $match: query
      }
    ]);

    res.json(publications);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
  
  
  }
  









module.exports = {
  addPublication, updatePublication, getpublicaionById,
  getallpublicaion, deletepub,
  updatePublication2, getNewestPubs,
  getPublicationImage, getOwnerPublication,
  getallpublicaionByUserId,
  BloquerPublication, ActiverPublication,
  addVotePub,deleteVotePub,
  voteUpNumber,voteDownNumber,filter,filterOpt
}