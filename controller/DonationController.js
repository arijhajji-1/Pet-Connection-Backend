const express = require("express"); 
const Donation = require("../models/donation");
const Funding = require("../models/funding");

const addDonation = async (req, res) => { 
    const { user, funding, total } = req.body;
    
    var u = await Funding.findById(funding);
    u.total = parseFloat(u.total) + parseFloat(total);
    u.save();

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
};

module.exports = {
  addDonation,
  getAllDonation,
  getDonationsByFunding,
  deleteDonation
};
