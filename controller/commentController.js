const express = require('express');
const Publication = require("../models/Publication")
const User = require('../models/user');
const Comment = require('../models/Commnet');
const Reply = require('../models/Reply');

const jwt = require('jsonwebtoken');
const path = require('path');




const { sign, verify } = require('jsonwebtoken')



async function addComment(req, res, next) {


    try {
        // const accessToken = req.cookies["access-token"];

        // if (!accessToken) {
        //     return res.status(401).json({ message: "Access token not found" });
        // }

        // const decodedToken = verify(accessToken, "azjdn1dkd3ad");
        // const userconnecte = await User.findById(decodedToken.id);


        const userId = req.query.userid;




        console.log("user --> " + userId)
        console.log("publication --> " + req.body.publication)


        const comment = new Comment({
            text: req.body.text,
            publication: req.body.publication,
            user: userId
        });


        const user = await User.findById(userId);
        console.log("--user-->" + userId)

        if (!user) throw new Error('User not found');

        const publication = await Publication.findById(req.body.publication);
        if (!publication) throw new Error('Publication not found');

        comment.user = user;
        comment.publication = publication;

        await comment.save();
        publication.comments.push(comment);

        await publication.save();
        res.status(201).json(comment);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }

}




// 



async function replytoComment(req, res, next) {

    // Récupérer l'ID du commentaire parent via la requête HTTP
   const parentCommentId = req.params.commentId; //ok passe adns req
  
  //userconnecte
  const userId = req.query.userid;
  console.log('userid - > ' + userId);
  
  //
  
  
  // Créer un nouveau commentaire en tant que réponse au commentaire parent
  const newReply = new Reply({
  
  text: req.body.text,

//   publication: req.body.publication,
  });
  newReply.user=userId
  newReply.commnet=parentCommentId

  
  // Enregistrer le commentaire dans la base de données
  newReply.save()
  .then(savedReply => {
  
    // Ajouter le commentaire sauvegardé à la propriété "replies" du commentaire parent
    Comment.findByIdAndUpdate(
      parentCommentId,
      { $push: { replies: savedReply } },
      { new: true }
  
    ).then(updatedComment => {
        // Faire quelque chose avec le commentaire mis à jour
        console.log(`Commentaire réponse ajouté : ${updatedComment}`);
        
        res.status(201).json(updatedComment);
  
        
      })
  
  
      .catch(err => {
        // Gérer l'erreur
        console.error(`Erreur lors de l'ajout de la réponse du commentaire : ${err}`);
      });
  })
  .catch(err => {
    // Gérer l'erreur
    console.error(`Erreur lors de la création de la réponse du commentaire : ${err}`);
  });
  
  
  
  }


// 








// 




// 


async function updateComment(req, res, next) {


    //get user 
    const accessToken = req.cookies["access-token"];

    if (!accessToken) {
        return res.status(401).json({ message: "Access token not found" });
    }


    const { id } = req.params;
    console.log("--id comment-->>" + id)



    try {
        const comment = await Comment.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );


        if (!comment) throw new Error('comment not found');
        res.json(comment);
    } catch (err) {
        res.status(400).json({ message: err.message });

    }

}



async function getallCommentsByIdPublication(req, res) {

    try {

        // const accessToken = req.cookies["access-token"]; //token
        // if (!accessToken) {
        //     return res.status(401).json({ message: "Access token not found" });
        // }

        /*
        const decodedToken = verify(accessToken, "azjdn1dkd3ad"); //user id connecte
        console.log("---id user connecte---> " + decodedToken.id)
    
        const user = await User.findById(decodedToken.id);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        */

    
            const comments = await Comment.find({ publication: req.params.idPub });
            res.status(200).json(comments);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }




}



//*--------------------------------



// async function deleteComment(req, res, next) {


//     // admin ou le proprietaire de la publication peut la supprimee 



//     try {

//         //verifier le token 
//         const accessToken = req.cookies["access-token"]; //token
//         if (!accessToken) {
//             return res.status(401).json({ message: "Access token not found" });
//         }




//         const comment = await Comment.findByIdAndDelete(req.params.id);
//         if (!comment) throw new Error('Comment not found');


//         const publication = await Publication.findOneAndUpdate(
//             { _id: comment.publication },
//             { $pull: { comments: comment._id } },
//             { new: true }
//         );



//         if (!publication) throw new Error('publication not found');
//         res.status(200).json({ message: 'Comment deleted' });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }




async function deleteComment(req, res, next) {
    try {
    //   const accessToken = req.cookies["access-token"];
    //   if (!accessToken) {
    //     return res.status(401).json({ message: "Access token not found" });
    //   }
  
      const comment = await Comment.findByIdAndDelete(req.params.id);
      if (!comment) {
        throw new Error('Comment not found');
      }
  
      // Supprimer les réponses du commentaire
      for (const replyId of comment.replies) {
        await Reply.findByIdAndDelete(replyId);
      }
  
      const publication = await Publication.findOneAndUpdate(
        { _id: comment.publication },
        { $pull: { comments: comment._id } },
        { new: true }
      );
      
      if (!publication) {
        throw new Error('Publication not found');
      }
  
      res.status(200).json({ message: 'Comment deleted' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  




//******************reply****************


async function deleteReply(req, res, next) {


    // admin ou le proprietaire de la publication peut la supprimee 



    try {

        // //verifier le token 
        // const accessToken = req.cookies["access-token"]; //token
        // if (!accessToken) {
        //     return res.status(401).json({ message: "Access token not found" });
        // }




        const reply = await Reply.findByIdAndDelete(req.params.id);
        if (!reply) throw new Error('reply not found');


        // const comment = await Comment.findOneAndUpdate(
        //     { _id: reply.commnet },
        //     { $pull: { replies: reply._id } },
        //     { new: true }
        // );


        const comment = await Comment.findOneAndUpdate(
            { replies: reply._id },
            { $pull: { replies: reply._id } },
            { new: true }
        );


        if (!comment) throw new Error('comment not found');
        res.status(200).json({ message: 'Reply deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}












async function getreplyByID(req, res) {

        try {
      
          //verifier le token 
          // const accessToken = req.cookies["access-token"]; //token
          // if (!accessToken) {
          //   return res.status(401).json({ message: "Access token not found" });
          // }
      
          //get publication
          const data = await Reply.findById(req.params.id);
          res.send(data)
        } catch (err) {
          res.send(err)
        }
    

}


// ******************Commznt****************


async function getCommnetById(req, res) {

    try {
  
      //verifier le token 
      // const accessToken = req.cookies["access-token"]; //token
      // if (!accessToken) {
      //   return res.status(401).json({ message: "Access token not found" });
      // }
  
      //get publication
      const data = await Comment.findById(req.params.id);
      res.send(data)
    } catch (err) {
      res.send(err)
    }


}











module.exports = {
        addComment, updateComment, deleteComment, getallCommentsByIdPublication,
        replytoComment,getreplyByID,getCommnetById,deleteReply

    }

