const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Funding = require("../models/funding");
const Association = require("../models/association");
const user = require("../models/user");

const app = express();
const upload = multer({ dest: "public/associations/" });
const fetch = require("node-fetch");

const addFunding = async (req, res) => {
  const { title, association, desc, goal } = req.body;
  var a = await Association.findById(association);
  a.action = a.action + 1;
  a.save(); 


  var image = "";

  const file = req.file;
  if (file) {
     
      const oldPath = path.join(__dirname, "..", file.path);
      const extension = path.extname(file.originalname);
      const newPath = path.join(
        __dirname,
        "..",
        "public",
        "funding",
        `${req.body.association}${file.filename}`
      );

      // Rename the file to its original name with extension
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to upload the file" });
        }
      })
        image = `${req.body.association}${file.filename}`; 
  }
  

  if (image != "") {
    Funding.create({
      title: title,
      association: association,
      image: `${req.body.association}${file.filename}`,
      total: 0,
      desc: desc,
      goal : goal,
      date: new Date()
    }).then((funding) => {
      res.send(funding);
    });
  } else {
    Funding.create({
      goal: goal,
      title: title,
      association: association,
      total: 0,
      desc: desc,
      date: new Date(),
    }).then((funding) => {
      res.send(funding);
    });
  }    
   
};


const getAllFunding =  (req, res) => {
    try {
         Funding.find({}).then((result) => {
            res.send(result); 
        }); 
    } catch (err) {
        res.send(err); 
    }
}

const getOneFunding = async (req, res) => {
  try {
    await Funding.findById(req.params.id).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.send(err);
  }
};


const getFundingByAssociation = (req, res) => {
  try {
    Funding.find({association : req.params.id}).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.send(err);
  }
};


const addTotalFunding = async (req, res) => {
  try {
    await Funding.findByIdAndUpdate(req.params.id, req.body).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.send(err);
  }
}; 

const editFunding = async(req,res) => {
  var image = "";
  const file = req.file;
  if (file) {
    const oldPath = path.join(__dirname, "..", file.path);
    const extension = path.extname(file.originalname);
    const newPath = path.join(
      __dirname,
      "..",
      "public",
      "funding",
      `${req.body.association}${file.filename}`
    );

    // Rename the file to its original name with extension
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to upload the file" });
      }
    });

    image = `${req.body.association}${file.filename}`;
  }

  const { title, desc, date, association, goal, total } = req.body;
  if (image == "") {
    await Funding.findOneAndUpdate(
      { _id: req.params.id },
      {
        title : title, 
        goal: goal,
        desc: desc 
      }
    ).then((result) => {
      res.send("funding edited");
    });
  } else {
    await Funding.findOneAndUpdate(
      { _id: req.params.id },
      {
        title : title, 
        goal: goal,
        desc: desc ,
        image: `${req.body.association}${file.filename}`,
      }
    ).then((result) => {
      res.send("funding edited with image");
    });
  }
};


const deleteFunding = (req, res) => {
  try {
    Funding.findByIdAndDelete(req.params.id).then((result) => {
      res.send("funding deleted");
    });
  } catch (err) {
    res.send(err);
  }
};




const avatar = async (req, res) => {
  const img = req.body.img; 
  console.log(img); 
  const url = "https://stablediffusionapi.com/api/v3/img2img";
  const data = {
    key: "l1UqBXYfTI0Mf0xJtt05VlWXvUls2PiEoGIqdgOehDGetWtJYEIeFHHcsFZ3",
    prompt: "make avatar of my pet",
    negative_prompt: null,
    init_image:
      "https://images.unsplash.com/photo-1611003228941-98852ba62227?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmFieSUyMGRvZ3xlbnwwfHwwfHw%3D&w=1000&q=80",
    width: "512",
    height: "512",
    samples: "1",
    num_inference_steps: "30",
    guidance_scale: 7.5,
    safety_checker: "yes",
    strength: 0.7,
    seed: null,
    webhook: null,
    track_id: null,
  };

  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => res.send(data))
    .catch((error) => console.error(error));
}; 


module.exports = {
    addFunding,
    getAllFunding,
    getOneFunding,
    getFundingByAssociation,
  addTotalFunding,
  deleteFunding,
  editFunding,
    avatar
}; 