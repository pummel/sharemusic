var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
	username: {
		type: String,
        index:true,
        unique: true
	},
	password: {
		type: String
	},
	name: {
		type: String
	},
	email: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
	bcrypt.genSalt(10, function(err, salt) {
	  bcrypt.hash(newUser.password, salt, function(err, hash) {
		newUser.password = hash;
      	newUser.save(callback);
	  });
	});
}

module.exports.getUserByUsername = function(userName, callback){
	var query = {username: userName};
	User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if (err) throw err;
		callback(null, isMatch);
	});
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.getUser = (query, callback) => {
    User.findOne(query, callback);
}

module.exports.deleteUser = (query, callback) => {
    User.remove(query, callback);
}