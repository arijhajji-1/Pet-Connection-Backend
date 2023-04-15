const mongo = require('mongoose');
const schema = mongo.Schema; 
const bcrypt = require("bcrypt");
const crypto = require("crypto");
var User = new schema({
    username: {
        type: String,
       // required: true,
        unique: true
    },
    password: {
        type: String,
       // required: true 
    },
    name: {
        type: String,
       // required : true
    },
    email: {
        type: String,
        //required: true,
        //unique : true
    },
    role: {
        type: String,
        //required : true
    },
    phone: {
        type: String
    },
    image: {
        type: String
    },
    location: {
        type: String 
    },
    createdAt: {
        type: Date
    },
    active: {
        type : Boolean
    },

    secret: {
        type: String,
        
      },
      twoFactorEnabled: {
        type: Boolean,
        default: false
      },
      twoFactorVerified:
        {
            type: Boolean,
            default: false
        },
     facebookId: String,
     google: {
        type : Boolean
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isUserVerified: {type: Boolean, default: false},
    pets: [
        {
          type: schema.Types.ObjectId,
          ref: 'Pet'
        }
      ]  ,
      losts: [
        {
          type: schema.Types.ObjectId,
          ref: 'lost'
        }
      ]  ,
      notification:{
        type:Array
      }
      
});


//Password reset/forget
User.methods.createPasswordResetToken = async function () {
    try {

        let resetToken = crypto.randomBytes(32).toString("hex");
        this.passwordResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10 minutes
        return resetToken;
    } catch (error) {
        console.log(error)

  
    }

};

User.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// password crypttt
// User.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         next();
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     console.log("ffgfr ");
//     next();
// });


     



module.exports = mongo.model("user", User)