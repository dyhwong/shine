var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    SALT_WORK_FACTOR = 10;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    scores: { type: Array },
    allTime: { type: Number },
    dayHigh: { type: Number },
    monthHigh: { type: Number },
    average: { type: Number },
    count: { type: Number },
    dailyScores: { type: Array },
    dailyTimes: { type: Array }
});

UserSchema.set('autoIndex', true); //change to false after development

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(){}, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);