
const Note = require('../models/Notes');

const mongoose = require('mongoose');

/**
 * GET /
 * Dashboard User
 */
exports.dashboard = async (req, res) => {

  let perPage = 10;
  let page = req.query.page || 1;

  const locals = {
    title: "Tableau de bord - Application  de prise Notes gratuite",
    description: "Application  de prise Notes gratuite.",
  };

  try {
    // const notes = await Note.find({});

    //console.log(req.user.id);
    let id = mongoose.Types.ObjectId(req.session.user._id);

    const notes = await Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: { user: id } },
      {
        $project: {
          user: "$user",
          title: { $substrCP: ["$title", 0, 50] },
          body: { $substrCP: ["$body", 0, 150] },
          titleToModify: { $substrCP: ["$title", 0, { $strLenCP: "$title" }] },
          bodyToModify: { $substrCP: ["$body", 0, { $strLenCP: "$body" }] },
          createdAt: "$createdAt",
        },
      }
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

       const GetVar = req.session.notification;
  req.session.notification = null; 

    const count = await Note.count();

    res.render('dashboard/index', {
      userName: req.session.user.firstName,
      userId: id,
      locals,
      GetVar,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage),
      perPage,
      connecter: 1
    });


  } catch (error) {
    console.log(error);
  }
}




/**
 * GET /
 * Dashboard User pagination
 */
exports.dashboardViewPageNote = async (req, res) => {

  let perPage = 10;
  let page = req.params.id || 1;
  let id = mongoose.Types.ObjectId(req.session.user._id);

  const locals = {
    title: "Dashboard- page " + req.params.id,
    description: "Free NodeJS Notes App.",
  };

  try {
    // Mongoose "^7.0.0 Update
    const notes = await Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: { user: id } },
      {
        $project: {
          user: "$user",
          title: { $substrCP: ["$title", 0, 50] },
          body: { $substrCP: ["$body", 0, 150] },
          titleToModify: { $substrCP: ["$title", 0, { $strLenCP: "$title" }] },
          bodyToModify: { $substrCP: ["$body", 0, { $strLenCP: "$body" }] },
        },
      }
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Note.count();
    const GetVar = 0;
    res.render('dashboard/index', {
      userName: req.session.user.firstName,
      userId: id,
      locals,
      GetVar,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage),
      perPage,
      connecter: 1
    });

  } catch (error) {
    console.log(error);
  }
}

/**
 * GET /
 * Dashboard For All Users
 */
exports.NotesForAnotherUsers = async (req, res) => {

  let perPage = 10;
  let page = req.query.page || 1;
  let connecter = 1;
  const locals = {
    title: "Dashboard - For other user",
    description: "Free NodeJS Notes App.",
  };

  if (!req.session.user)
    connecter = 0;

  try {
    // const notes = await Note.find({});

    //console.log(req.user.id);  { "$ne": mongoose.Types.ObjectId(yourLoggedInId) }
    //let id = mongoose.Types.ObjectId(req.session.user._id);

    if (!req.session.user) {
      connecter = 0;

      const notes = await Note.aggregate([
        { $sort: { updatedAt: -1 } },
        // { $match: { user: id} },
        {
          $project: {
            user: "$user",
            title: { $substrCP: ["$title", 0, 50] },
            body: { $substrCP: ["$body", 0, 150] },
            titleToModify: { $substrCP: ["$title", 0, { $strLenCP: "$title" }] },
            bodyToModify: { $substrCP: ["$body", 0, { $strLenCP: "$body" }] },
          },
        }
      ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

      const count = await Note.count();
      const GetVar = 0;

      res.render('dashboard/index', {
        userName: "Consulter toutes les notes",
        userId: "",
        locals,
        GetVar,
        notes,
        layout: "../views/layouts/dashboard",
        current: page,
        pages: Math.ceil(count / perPage),
        perPage,
        connecter
      });

    } else {

      let id = mongoose.Types.ObjectId(req.session.user._id);

      const notes = await Note.aggregate([
        { $sort: { updatedAt: -1 } },
        { $match: { user: { "$ne": id } } }, // recupèrre tous sauf l'id en cour
        {
          $project: {
            user: "$user",
            title: { $substrCP: ["$title", 0, 50] },
            body: { $substrCP: ["$body", 0, 150] },
            titleToModify: { $substrCP: ["$title", 0, { $strLenCP: "$title" }] },
            bodyToModify: { $substrCP: ["$body", 0, { $strLenCP: "$body" }] },
          },
        }
      ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

      const count = await Note.count();

      const GetVar = 0;
      res.render('dashboard/index', {
        userName: req.session.user.firstName,
        userId: id,
        locals,
        GetVar,
        notes,
        layout: "../views/layouts/dashboard",
        current: page,
        pages: Math.ceil(count / perPage),
        perPage,
        connecter
      });
    }


  } catch (error) {
    console.log(error);
  }
}

/**
 * GET /
 * View Specific Note
 */
exports.dashboardViewNote = async (req, res) => {
  //  console.log(req.user.id);
  const note = await Note.findById({ _id: req.params.id })
    .where({ user: req.session.user._id })
    .lean();

  if (note) {
    res.render("dashboard/view-note", {
      noteID: req.params.id,
      note,
      connecter: 1,
      layout: "../views/layouts/dashboard",
    });
  } else {
    res.send("Something went wrong.");
  }
};


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


/**
 * GET /
 * Search
 */
exports.dashboardSearch = async (req, res) => {
  try {
    res.render("dashboard/search", {
      searchResults: "",
      layout: "../views/layouts/dashboard",
    });
  } catch (error) { }
};


/**
 * POST /
 * Search For Notes
 */
exports.dashboardSearchSubmit = async (req, res) => {
  let connecter = 1;
  if (!req.session.user)
    connecter = 0;
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const searchResults = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
      ],
    }).where({ user: req.session.user._id });

    res.render("dashboard/search", {
      searchResults,
      connecter,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};