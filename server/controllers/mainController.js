const User = require('../models/User');

const mongoose = require('mongoose');

/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) =>{
  const GetVar = req.session.notification;
  req.session.notification = null; 
  
  const locals = {
        title : 'NodeJs Notes',
        description : 'Free NodeJs Notes app.',
        logout : GetVar,
        accessDenied : '',
        page : 1,
        search : ""
    }


    res.render('index', {
       locals,
       layout: '../views/layouts/front-page'
    });
}

// Logout page 

exports.homepagelogout = async (req, res) =>{
     req.session.notification = "Déconnexion réussie 🎉";
    const locals = {
        title : 'Logout - Notes',
        description : 'Free NodeJs Notes app.',
        logout : 'Vous êtes bien déconnecter',
      accessDenied : '',
       page : 1,
      search : ""
    }

      req.session.user = null;

  console.log("Déconnecter");
   res.redirect("/");
}

/**
 * GET /
 * profil
 */
exports.profil = async (req, res) =>{
       const locals = {
        title : 'Profil - NodeJs Notes',
        description : 'Free NodeJs Notes app.',
         page : 5,
         search : ""
    }



try {
    const { id } = req.params;
  //console.log(id, req.session.user._id);
    // Vérifie que l’ID est un ObjectId valide
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, error: "ID invalide" });
    }
    if(!req.session.user){
       userSession = {_id: ""};
    }else{
      userSession = req.session.user;
    }

const user = await User.findById(id);
    if (user) {
     
      req.session.Iduser = id;
    
res.render('profil', {
  locals, 
  user, 
  id,
  userSession});
}else{
  req.session.notification = "Utilisateur non trouvé";
    res.redirect("/users");
}

  } catch (err) {
    console.error("Erreur serveur :", err);
    req.session.notification = "Erreur interne du serveur";
    res.redirect("/users");
  }
      
}

/**
 * GET /
 * Users
 */
exports.users = async (req, res) =>{
   const GetVar = req.session.notification;
  req.session.notification = null; 
    const locals = {
        title : 'Users - Notes',
        description : 'Free NodeJs Notes app.',
         page : 4,
         search : "Rechercher un utilisateur (nom, email)"
    }
     const currentUserId = null;
     if(req.session.user){
      const currentUserId = req.session.user._id;
     }

     console.log(currentUserId);

     try {
 
    //const users = await User.find({ _id: { $ne: currentUserId } });
const users = await User.aggregate([
  { $match: { _id: { $ne: new mongoose.Types.ObjectId(currentUserId) } } },
  {
    $lookup: {
      from: "notes",           // nom de la collection Mongo
      localField: "_id",       // champ dans User
      foreignField: "user",    // champ dans Note
      as: "userNotes"
    }
  },
  {
    $addFields: {
      noteCount: { $size: "$userNotes" } // ajoute le nombre de notes
    }
  },
  {
    $project: {
      password: 0, // tu peux exclure le mot de passe
      userNotes: 0 // on n’a besoin que du count
    }
  }
]);

    res.render('users', {locals, users,GetVar }); // on envoie les utilisateurs à la vue EJS
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
}


/**

* PUT /
* Update Specific User
*/
exports.ProfilUpdate = async (req, res) => {
  try {
    const { field, value } = req.body;
    if (!["firstName", "lastName", "email", "role"].includes(field)) {
      return res.status(400).json({ error: "Champ invalide" });
    }
    const user = await User.findByIdAndUpdate(
      req.session.Iduser,
      { [field]: value },
      { new: true }
    );
    res.json({ success: true, user });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
  
};





