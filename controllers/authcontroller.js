var exports = module.exports = {}
 
exports.signup = function(req, res) {
 
    res.render('new-user');
 
};

exports.userLogin = function(req, res) {
	res.render("user-login");
}