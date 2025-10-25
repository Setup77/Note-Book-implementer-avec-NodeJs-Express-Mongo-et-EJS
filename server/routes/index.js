const User = require('../models/User');

const mongoose = require('mongoose');

const bodyParser  = require("body-parser"); 
const multer = require("multer"); 
const path = require("path"); 
const fs = require("fs"); 

const express = require('express');
const router = express.Router();

const { isLoggedIn } =  require('../middleware/checkAuth');
const mainController = require('../controllers/mainController');

// --- Configuration du stockage des fichiers ---
const uploadDir = path.join(process.cwd(), "public/img");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, "avatar-" + req.session.Iduser + ext);
  }
});

const upload = multer({ storage });

/**
 * App Routes  - comme le htaccess
 */
router.get('/', mainController.homepage);
router.get('/profil-:id', mainController.profil);
router.post('/update-profile', isLoggedIn, mainController.ProfilUpdate);
router.get('/logout', mainController.homepagelogout);
router.get('/logout', mainController.homepagelogout);
router.get('/users', mainController.users);

// --- API : Upload de l’avatar ---
router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  console.log("Sauvegarde de image");

  try {
      
    const avatarPath = "/img/" + req.file.filename;
   const user = await User.findByIdAndUpdate(req.session.Iduser, { avatar: req.file.filename }, { new: true });
console.log(req.session.Iduser, avatarPath);
    res.json({ success: true, avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;