
const Note = require('../models/Notes');
const User = require('../models/User');

const mongoose = require('mongoose');

/**
 * GET /
 * Dashboard User Connected
 */
exports.dashboard = async (req, res) => {

  const locals = {
    title: "Tableau de bord - Application  de prise Notes gratuite",
    description: "Application  de prise Notes gratuite.",
    page: 6,
    search: "Rechercher vos notes,..."
  };

  try {
    var id = null;
    var userName = null;

    if (req.session.user) {
      id = mongoose.Types.ObjectId(req.session.user._id);
      userName = req.session.user.firstName;
    }
    console.log(id, userName);
    // Requête d’agrégation (user + notes)
    const notes = await Note.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(id) } },
      { $sort: { updatedAt: -1 } },
      {
        $lookup: {
          from: "users",            // nom de la collection Mongo
          localField: "user",       // champ dans notes
          foreignField: "_id",      // champ correspondant dans users
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          user: "$user",
          usernote: "$userInfo", // on inclut toutes les infos du user
          title: { $substrCP: ["$title", 0, 50] },
          body: { $substrCP: ["$body", 0, 150] },
          titleToModify: { $substrCP: ["$title", 0, { $strLenCP: "$title" }] },
          bodyToModify: { $substrCP: ["$body", 0, { $strLenCP: "$body" }] },
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    var GetVar = req.session.notification;
    req.session.notification = null;
    var userId = id;

    const usernote = await User.findById(id);

    res.render('dashboard/index', {
      userName,
      locals,
      GetVar,
      notes,
      userId,
      usernote,
      anoteruser: 2,
      layout: "../views/layouts/dashboard",
      connecter: 1
    });


  } catch (error) {
    console.log(error);
  }
}


/**
 * GET /
 * Notes for another User
 */

exports.NoteForAnotherUser = async (req, res) => {

  const locals = {
    title: "Tableau de bord - notes de l'utilisateur",
    description: "Application  de prise Notes gratuite.",
    page: 7,
    search: "Rechercher des notes,..."
  };

  try {

    let id = mongoose.Types.ObjectId(req.params.id);
    var userName = null;
    if (req.session.user) {
      userName = req.session.user.firstName;
    }



    // Requête d’agrégation (user + notes)
    const notes = await Note.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(id) } },
      { $sort: { updatedAt: -1 } },
      {
        $lookup: {
          from: "users",            // nom de la collection Mongo
          localField: "user",       // champ dans notes
          foreignField: "_id",      // champ correspondant dans users
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          user: "$user",
          usernote: "$userInfo", // on inclut toutes les infos du user
          title: { $substrCP: ["$title", 0, 50] },
          body: { $substrCP: ["$body", 0, 150] },
          titleToModify: { $substrCP: ["$title", 0, { $strLenCP: "$title" }] },
          bodyToModify: { $substrCP: ["$body", 0, { $strLenCP: "$body" }] },
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    var GetVar = req.session.notification;
    req.session.notification = null;
    var userId = id;

    // recupère les infos de l'utilisateur
    const usernote = await User.findById(id);

    res.render('dashboard/index', {
      userName,
      locals,
      GetVar,
      notes,
      userId,
      usernote,
      anoteruser: 1,
      layout: "../views/layouts/dashboard",
      connecter: 0
    });


  } catch (error) {
    console.log(error);
  }
}



/**
 * GET /
 * Notes for All Users
 */

exports.notesForAllUsers = async (req, res) => {
  console.log("Notes de tous les utilisateurs");
  const locals = {
    title: "Tableau de bord - notes de tous les utilisateurs",
    description: "Application  de prise Notes gratuite.",
    page: 7,
    search: "Rechercher des notes,..."
  };

  try {
    var id = null;
    var userName = null;
    if (req.session.user) {
      id = mongoose.Types.ObjectId(req.session.user._id);
      userName = req.session.user.firstName;
    }

    // Requête d’agrégation (user + notes)
    const notes = await Note.aggregate([
      { $match: { user: { $ne: id } } },
      { $sort: { updatedAt: -1 } },
      {
        $lookup: {
          from: "users",            // nom de la collection Mongo
          localField: "user",       // champ dans notes
          foreignField: "_id",      // champ correspondant dans users
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          user: 1,
          usernote: "$userInfo", // on inclut toutes les infos du user
          title: { $substrCP: ["$title", 0, 50] },
          body: { $substrCP: ["$body", 0, 150] },
          titleToModify: { $substrCP: ["$title", 0, { $strLenCP: "$title" }] },
          bodyToModify: { $substrCP: ["$body", 0, { $strLenCP: "$body" }] },
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);


    var GetVar = req.session.notification;
    req.session.notification = null;
    var userId = id;

    // recupère les infos de l'utilisateur
    const usernote = await User.findById(id);

    res.render('dashboard/index', {
      userName,
      locals,
      GetVar,
      notes,
      userId,
      usernote,
      anoteruser: 0,
      layout: "../views/layouts/dashboard",
      connecter: 0
    });


  } catch (error) {
    console.log(error);
  }
}



/**

* PUT /
* Update Specific Note
*/
exports.dashboardUpdateNote = async (req, res) => {
  try {
    console.log(req.params.id, "Modifierr");
    await Note.findOneAndUpdate(

      { _id: req.params.id },
      { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
    ).where({ user: req.session.user._id });


    req.session.notification = 3;
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};


/**
 * DELETE /
 * Delete Note
 */
exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id }).where({ user: req.session.user._id });
    req.session.notification = 2;

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};



/**
 * POST /
 * Add Notes
 */
exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    req.body.user = req.session.user._id;
    console.log(req.body.user);
    await Note.create(req.body);

    req.session.notification = 1;

    res.redirect("/dashboard");

  } catch (error) {
    console.log(error);
  }
};

