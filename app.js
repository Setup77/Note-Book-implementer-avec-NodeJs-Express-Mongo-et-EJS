require('dotenv').config(); 
// dotenv ==  accéder aux variables d’environnement contenue dans le fichier .env

const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

dayjs.locale('fr');
//----Middleware pour upload des médias

const bodyParser  = require("body-parser"); 
const multer = require("multer"); 
const path = require("path"); 
const fs = require("fs"); 

const express = require('express'); 

const expressLayouts = require('express-ejs-layouts');

const methodOverride = require("method-override"); 
const connectDB = require('./server/config/db');
const session = require('express-session');
const flash = require('connect-flash');  // --Pour les alertes

const passport = require('passport'); 

const MongoStore = require('connect-mongo'); 

const cookieParser = require("cookie-parser"); 




//--middleware == module intermédiaire
const app = express();

const port = 5000 || process.env.PORT;

// Initialization
app.use(cookieParser());


app.use(session({
   // key: "user_sid",
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGOOB_URI
    }),
    cookie: {
        expires: Date.now() - 30 * 24 * 60 * 60 * 1000,
      }
   // cookie: { maxAge: new Date ( Date.now() + (3600000))}
   // Date.now() - 30 * 24 * 60 * 60 * 1000
}));

// Middleware pour rendre la session accessible dans les vues
app.use((req, res, next) => {
  res.locals.session = req.session; // rend la session accessible à EJS
  next();
});

// Configurer le middleware Flash 
app.use(flash());
app.use(passport.initialize());
 app.use(passport.session());

app.use(express.urlencoded({extended: true}));



app.use(express.json());
app.use(methodOverride("_method"));

// Connect to Database
connectDB();

// static Files
app.use(express.static('public'));

// Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');


app.set('view engine', 'ejs');
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static(path.join(process.cwd(), "public")));
app.use(bodyParser.json());

//-Routes
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dasboard'));

app.locals.dayjs = dayjs;



//-- Handle 404

app.get('*', function(req, res) {
   //res.status(404).send('404 Page not found');
   res.status(404).render('404');
});



app.listen(port, () => {
    console.log(`ca marche au port ${port}`); 
});


//---- Arreter 3h00min09