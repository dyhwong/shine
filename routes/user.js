
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.loginfail = function(req, res){
   console.log('invalid login');
   res.render('homepage.html', {'error': true, 'login': true, 'register': false});
};

exports.login = function(req, res) {
  if (req.user !== undefined) {
    res.redirect('/settings');
  } else {
    res.render('homepage.html', {'error': false, 'login': true, 'register':false});
  }
}

exports.register = function (req, res){
 if (req.user !== undefined) {
    res.redirect('/settings');
  } else {
    res.render('homepage.html', {'error': false, 'login': false, 'register':true});
  }
}
