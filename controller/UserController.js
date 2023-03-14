const User = require('../models/user')
const express = require('express')
const { createToken, validateToken } = require('../midill/JWT/JWT');
const bcrypt = require("bcrypt");
const { sign, verify } = require('jsonwebtoken')
const path = require('path');
///const Blob  = require('node-fetch');



////////Userrecognize//////////

// const fs = require('fs');
// const { cv } = require('opencv-wasm');
// // const cv = require('opencv4nodejs');
// const { createCanvas, loadImage } = require('canvas');

const { Canvas, Image, ImageData } = require('canvas');
const faceapi = require('face-api.js');
const { Blob } = require('buffer');



const multer = require('multer');
const fs = require('fs');


const cv = require('opencv-wasm');


const uploadd = multer({ dest: 'uploads/new_uploads' });
const projectDir = process.cwd();
const imagesDir = path.join(projectDir, 'public/uploads');
const newpath = path.join(projectDir, 'public/new_uploads');

const NodeWebcam = require('node-webcam');
const { Console } = require('console');

var options = {
    width: 1280,
    height: 720,
    quality: 100,
    delay: 1,
    saveShots: true,
    output: "jpeg",
    device: false,
    callbackReturn: "location"
};

// create instance using the above options
var webcam = NodeWebcam.create(options);

// capture function
var captureShot = () => {
    // Make sure this returns a real url to an image.
    return new Promise(resolve => {
        var new_path = `./public/new_uploads/`;

        // create folder if and only if it does not exist
        if (!fs.existsSync(new_path)) {
            fs.mkdirSync(new_path);
        }

        // capture the image
        var img = `./public/new_uploads/capture_${Date.now()}.${options.output}`
        webcam.capture(img, (err, data) => {
            if (!err) {
                console.log('Image created')
            }
            console.log(err);

            console.log("img : " + img);
            resolve(img)
        });
    })

};


const captureImage = async (req, res) => {



};


const regenize = async (req, res) => {
    captureShot().then(async (imagePath) => {
        console.log(`Image captured: ${imagePath}`)
        
        const imgData = fs.readFileSync(imagePath);
        const imgArray = new Uint8Array(imgData);
        const img = await cv.imreadAsync(imgArray);
        const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
        const { objects, numDetections } = await classifier.detectMultiScaleAsync(img);
        if (!objects.length) {
            fs.unlinkSync(imagePath); // Remove the captured image if no faces are detected
            return res.status(404).send('No faces detected');
        }
        const result = { count: objects.length, faces: [] };
        objects.forEach((face, i) => {
            result.faces.push({
                x: face.x,
                y: face.y,
                width: face.width,
                height: face.height,
                confidence: numDetections[i],
            });
            const faceImg = img.getRegion(face).bgrToGray();
            const matchedImage = matchImage(faceImg, imagesDir);
            result.faces[i].matchedImage = matchedImage;
        });
        fs.unlinkSync(imagePath); // Remove the captured image after processing
        res.send(result);
    }).catch((error) => console.error(`Failed to capture image: ${error.message}`));

};


function matchImage(img, dir) {
    const files = fs.readdirSync(dir);
    let bestMatch = { filename: null, score: 0 };
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const template = cv.imread(filePath).bgrToGray();
        const matched = cv.matchTemplate(img, template, cv.TM_CCOEFF_NORMED);
        const score = matched.minMaxLoc().maxVal;
        if (score > bestMatch.score) {
            bestMatch = { filename: file, score: score };
        }
    });
    return bestMatch.filename;
}

//////////////




//==========upload image============

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },

    filename: function (req, file, cb) {
        cb(null, req.params.id + file.originalname); // nom de l'image dans public/uploads= idUser+nomImage
    },
});


//const upload = multer({ storage: storage });


//controle de saisie sur image
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    // limits: {
    //   fileSize: 1024 * 1024 * 5 // 5 MB
    // },
    // fileFilter: fileFilter

});




//==============




// =============== LOGINED USER =========================


const getConnectedUserId = (req) => {
    // get User
    const accessToken = req.cookies["access-token"];
    if (!accessToken) {
        return res.status(401).json({ message: "Access token not found" });
    }
    const decodedToken = verify(accessToken, "azjdn1dkd3ad");
    req.userId = decodedToken.id;

    return req.userId;
    //const user = await User.findById(req.userId);
    //res.send(user)
}



// =============== APIs ===========================

const register = (req, res) => {

    const { username, password, name, email, image, role, location, phone } = req.body;

    bcrypt.hash(password, 10).then((hash) => {
        User.create({
            username: username,
            password: hash,
            name: name,
            email: email,
            image: image,
            role: "simple",
            location: location,
            phone: phone,
            createdAt: new Date(),
            active: true
        }).then(() => {
            res.json("USER REGISTERED");

        }).catch((err) => {
            if (err) {
                res.status(400).json({ error: err })
            }
        })
    })
}

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) res.status(400).json({ error: "User doesn't exist" })
    else {
        const dbPassword = user.password
        bcrypt.compare(password, dbPassword).then((match) => {
            if (!match) {
                res.status(400).json({
                    error: "Wrong username and password combination"
                })
            } else {
                const accessToken = createToken(user);
                res.cookie("access-token", accessToken, {
                    maxAge: 60 * 60 * 24 * 30 * 1000
                }) // cookie expires after 30 days

                req.session.user = user;
                res.json(req.session.user);
                //res.send(user)
            }
        })
    }
}

const getAll = async (req, res, next) => {
    try {
        User.find({}).then(result => {
            res.send(result)
        })
    } catch (err) {
        console.log(err)
    }
}


const profile = async (req, res) => {
    try {
        await User.findById(req.params.id).then(result => {
            res.send(result)
        })
    } catch (err) {
        res.send(err)
    }
}



const updateuser = async (req, res) => {



    //    const connectedUserId = getConnectedUserId(req); 
    //    const connectedUserId = "64065e26c601ae53912b5476"; //test user sur la base mongo cloud 

    //  const connectedUserId= await User.findById()


    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { username, password, name, email, role, location, phone } = req.body;

        // Hash the password
        //const hash = await bcrypt.hash(password, 10);

        // Set the updated fields
        const updatedFields = {
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            email: req.body.email,
            role: "simple",
            location: req.body.location,
            phone: req.body.phone,
            createdAt: new Date(),
            active: true,
            image: req.params.id + req.file.originalname, //image = id+ nom image
        };

        // Update the user
        user = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
        // console.log(Connected)
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }




}


///////////get image user/////////
const getUserImage = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Vérifier si l'utilisateur a une image
        if (!user.image) {
            return res.status(404).json({ message: 'User has no image' });
        }

        // Envoyer l'image au client

        res.sendFile(path.join(__dirname, '..', 'public', 'uploads', user.image));

        console.log(path.join(__dirname, '..', 'public', 'uploads', user.image))

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


////////////reconnaicence faciale///////////////////////
// const Userrecognize = async (req, res) => {
//     try {
//       // Load the image from the request
//       const buffer = req.file.buffer;
//       console.log("a--->"+ buffer)
//       const mimeType = req.file.mimetype;

//       const base64Img = `data:${mimeType};base64,${buffer.toString('base64')}`
//       console.log("--->base64Img--> "+ base64Img)
//       const blob = new Blob([buffer.buffer], { type: 'application/octet-stream' });
//       console.log("--->blob--> "+ blob)



//       const queryImage = await faceapi.bufferToImage(buffer);

//       console.log("--->queryImage--> "+ queryImage)


//       // Load all images from the folder
//       const folder = path.join(__dirname, '..', 'public', 'uploads');
//       const files = await fs.promises.readdir(folder);
//       const images = await Promise.all(files.map(async (file) => {
//         const imagePath = path.join(folder, file);
//         const image = await faceapi.fetchImage(imagePath);
//         return { imagePath, image };
//       }));

//       // Load face recognition models
//       await faceapi.nets.faceRecognitionNet.loadFromDisk('./models')
//       await faceapi.nets.faceLandmark68Net.loadFromDisk('./models')
//       await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models')

//       // Compare each image to the request image
//       let authorized = false;
//       let authorizedImage = '';
//       for (let i = 0; i < images.length; i++) {
//         const { imagePath, image: knownImage } = images[i];

//         // Detect faces in the images
//         const queryFaces = await faceapi.detectAllFaces(queryImage).withFaceLandmarks().withFaceDescriptors();
//         const knownFaces = await faceapi.detectAllFaces(knownImage).withFaceLandmarks().withFaceDescriptors();

//         // Compare each detected face to the request image
//         for (let j = 0; j < queryFaces.length; j++) {
//           const queryFaceDescriptor = queryFaces[j].descriptor;
//           for (let k = 0; k < knownFaces.length; k++) {
//             const knownFaceDescriptor = knownFaces[k].descriptor;
//             const distance = faceapi.euclideanDistance(queryFaceDescriptor, knownFaceDescriptor);
//             if (distance < 0.6) { // Adjust this threshold value as necessary
//               authorized = true;
//               authorizedImage = path.basename(imagePath);
//               break;
//             }
//           }
//           if (authorized) {
//             break;
//           }
//         }
//         if (authorized) {
//           break;
//         }
//       }

//       // Return the authorization status and the name of the authorized image
//       if (authorized) {
//         res.send(`Authorized: ${authorizedImage}`);
//       } else {
//         res.send('Not Authorized');
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Error');
//     }
//   };


const Userrecognize = async (req, res) => {

    try {
        // Load the image from the request
        //   const buffer = req.file.buffer;

        //   const buffer = req.file.buffer

        const mimeType = req.file.mimetype;

        // const base64Img = `data:${mimeType};base64,${buffer.toString('base64')}`

        const buffer = Buffer.from(req.file.path);
        const blob = new Blob([buffer], { type: 'application/octet-stream' });

        const queryImage = await faceapi.bufferToImage(blob);

        // Load all images from the folder
        const folder = path.join(__dirname, '..', 'public', 'uploads');
        const files = await fs.promises.readdir(folder);
        const images = await Promise.all(files.map(async (file) => {
            const imagePath = path.join(folder, file);
            const imageBuffer = fs.readFileSync(imagePath);
            const image = await faceapi.bufferToImage(imageBuffer);
            return { imagePath, image };
        }));

        // Load face recognition models
        await faceapi.nets.faceRecognitionNet.loadFromDisk('./models')
        await faceapi.nets.faceLandmark68Net.loadFromDisk('./models')
        await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models')

        // Compare each image to the request image
        let authorized = false;
        let authorizedImage = '';
        for (let i = 0; i < images.length; i++) {
            const { imagePath, image: knownImage } = images[i];

            // Detect faces in the images
            const queryFaces = await faceapi.detectAllFaces(queryImage).withFaceLandmarks().withFaceDescriptors();
            const knownFaces = await faceapi.detectAllFaces(knownImage).withFaceLandmarks().withFaceDescriptors();

            // Compare each detected face to the request image
            for (let j = 0; j < queryFaces.length; j++) {
                const queryFaceDescriptor = queryFaces[j].descriptor;
                for (let k = 0; k < knownFaces.length; k++) {
                    const knownFaceDescriptor = knownFaces[k].descriptor;
                    const distance = faceapi.euclideanDistance(queryFaceDescriptor, knownFaceDescriptor);
                    if (distance < 0.6) { // Adjust this threshold value as necessary
                        authorized = true;
                        authorizedImage = path.basename(imagePath);
                        break;
                    }
                }
                if (authorized) {
                    break;
                }
            }
            if (authorized) {
                break;
            }
        }

        // Return the authorization status and the name of the authorized image
        if (authorized) {
            res.send(`Authorized: ${authorizedImage}`);
        } else {
            res.send('Not Authorized');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
};













////////////////////////////////////////////////////////



const deleteUser = async (req, res) => {
    try {
        const connectedUserId = getConnectedUserId(req);
        Connected = await User.findById(connectedUserId);

        if (Connected.role == "admin") {
            await User.findByIdAndRemove(req.params.id)
            res.send("User deleted!")
        } else {
            res.send("You must be an admin to delete another users!")
        }

    } catch (err) {
        res.send(err)
    }
}


const banUser = async (req, res) => {
    try {
        connectedUserId = getConnectedUserId(req);
        Connected = await User.findById(connectedUserId);
        if (Connected["role"] == "admin") {
            User.findByIdAndUpdate(req.params.id, { active: false });
            res.send("User banned!")
        } else {
            res.send("You must be an admin to ban a user.");
        }
    } catch (err) {
        res.send(err)
    }
}

const logout = () => async (req, res) => {
    await req.session.destroy((err) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred while logging out');
        } else {
            res.send('Logged out successfully');
        }
    });
}





module.exports = { register, login, profile, getAll, updateuser, deleteUser, banUser, logout, upload, getUserImage, Userrecognize, regenize, uploadd, captureImage }
