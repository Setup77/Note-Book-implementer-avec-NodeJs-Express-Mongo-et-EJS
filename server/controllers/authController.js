const User = require('../models/User');
const bcrypt = require("bcrypt"); // Importing bcrypt package
//const initializePassport = require("../../passport-config");
const users = [];




/**
 * GET /
 * register
 */
exports.register = async (req, res) =>{
    const locals = {
        title : 'Register - NodeJs Notes',
        description : 'Free NodeJs Notes app.'
    }
    const errors = { }
    res.render('register',  {locals, errors });
}


/**
 * GET /
 * login
 */
exports.login = async (req, res) =>{
    const locals = {
        title : 'Login - NodeJs Notes',
        description : 'Free NodeJs Notes app.'
    }
    const errors = { }
    const user = { }
    res.render('login', {locals, user, errors } );
}

/**
 * POST /
 * Add users
 */
exports.registerAddUserSubmit = async (req, res) => {
  
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(), 
            firstName: req.body.name,
            lastName: req.body.name,
            email: req.body.email,
            avatar: "photoDefaut.jpg",
            role: "",
            password: hashedPassword,
        });

        const newUser = {
            id: Date.now().toString(), 
            firstName: req.body.name,
            lastName: req.body.name,
            email: req.body.email,
            avatar: "photoDefaut.jpg",
            role: "",
            password: hashedPassword,
      
          }
        
          let  user = await User.findOne({ email: req.body.email});
          console.log(user);
          if (user) {
            const errors = {
                emailExist : 'Oops! Cet Email est déjà  utilisée'
            }
            const locals = {
                title : 'Register - NodeJs Notes',
                description : 'Free NodeJs Notes app.'
            }
          res.render("register", {
            locals, errors
          });
        
          } else {
if(req.body.password != req.body.password2){
  const errors = {
    emailExist : 'Oops! Les deux mot de passe sont différents'
}
const locals = {
    title : 'Register - NodeJs Notes',
    description : 'Free NodeJs Notes app.'
}
res.render("register", {
locals, errors
});

} else{
  user = await User.create(newUser);
  
  console.log("Utilisateur créer");
  const locals = {
      title : 'Login - NodeJs Notes',
      description : 'Free NodeJs Notes app.'
  }
  const errors = {
    emailExist : ''
}
 res.render("login", {
  locals, user, errors
});
}
          }

        console.log(users); // Display newly registered in the console
        
    } catch (e) {
        console.log(e);
        res.redirect("/register");
    }
  };


  /**
 * POST /
 * Connexion 
 */
exports.loginConnexion = async (req, res) => {
  
    try {

          let  user = await User.findOne({ email: req.body.email});
         //-- console.log(user);
          if (user) {
            //----initialisation des sessions
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    //---- mot de passe incorrect
                    const errors = {
                        emailExist : "Mot de passe incorrect "
                    }
                    const locals = {
                        title : 'Login - Mot de passe incorrect ',
                        description : 'Free NodeJs Notes app.'
                    }
                    const user = { }
                 res.render("login", {
                    locals, user, errors
                  });
                  //  return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                else{
                    //----connexion au dashbord

                    req.session.user = user;
                     req.session.notification = 4;
                    console.log(req.session.user);
                  //  req.session.user.id = user._id ;
                    req.session.save();
                    
                
                    res.redirect('/dashboard');
               
                }

            });
        
          } else {
            //----l'email n'existe pas
            const errors = {
                emailExist : "Cet email n existe pas"
            }
            const user = { }
            const locals = {
                title : 'Login - Utilisateur non trouvé',
                description : 'Free NodeJs Notes app.'
            }
          res.render("login", {
            locals, user, errors
          });

          }

      //  console.log(users); // Display newly registered in the console
        
    } catch (e) {
        console.log(e);
        res.redirect("/register");
    }
  };