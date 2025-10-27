exports.isLoggedIn = function (req, res, next){
    if(req.session.user){
        next();
    }else{
        const locals = {
            title : 'Access Denied - Notes',
            description : 'Free NodeJs Notes app.',
             logout : '',
            accessDenied : 'Access Refusé. Veillez vous connecter'
        }
        res.render('index', {
           locals,
           layout: '../views/layouts/front-page'
        });
       // return res.status(401).send('Access Denied');
    }
}
    