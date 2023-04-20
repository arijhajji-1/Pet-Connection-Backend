const express = require("express"); 
const Donation = require("../models/donation");
const Funding = require("../models/funding");
const User = require("../models/user");


const addDonation = async (req, res) => { 
    const { user, funding, total } = req.body;
    
    var u = await Funding.findById(funding);
    u.total = parseFloat(u.total) + parseFloat(total);
    u.save();
    
    console.log(user["_id"]); 
    var us = await User.findById(user["_id"]); 
    
    var x = 0 ;
    console.log("x = " + x); 
    if ((us.xp != null) && (us.level != null)) {
      x = parseFloat(us.xp) + parseInt(total);
      console.log("yessss");
      us.xp = x;
    } else { 
      us.xp = total;
      x = total ; 
    }
    
    us.level = parseInt(x / 50); 
    us.save() ;
  
    await Donation.create({
      user: user,
      funding: funding,
      total: total,
      createdAt: new Date()
    }).then((donation) => { 
      res.send(donation);
    });   

};



const getAllDonation = (req, res) => {
  try {
    Donation.find({}).then((result) => {
      res.send(result);
    });
  } catch (err) {
    console.log(err);
  }
};

const getDonationsByFunding = (req, res) => {
  try {
    Donation.find({funding : req.params.id}).then((result) => {
      res.send(result);
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteDonation = (req, res) => {
  try {
    Donation.findByIdAndDelete(req.params.id).then((result) => {
      res.send(result);
    });
    
  } catch (err) {
    console.log(err);
  }
}


const getRanking = async (req, res) => {
  try {
    await User.find({ xp: { $exists: true } }, function (err, users) {
      if (err) throw err;
      users.sort(function (a, b) {
        return b.xp - a.xp;
      });
      res.send(users);
    });
  } catch (err) {
    console.log(err); 
  }
}

module.exports = {
  addDonation,
  getAllDonation,
  getDonationsByFunding,
  deleteDonation,
  getRanking
};
