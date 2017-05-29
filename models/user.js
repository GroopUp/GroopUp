var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, Datatypes) {
    var User = sequelize.define("User", {

        name: {
            type: Datatypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [1]
            } // end of validate
        }, // end of name
        password: {
            type: Datatypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        }, // end of password
        email: {
            type: Datatypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        }, // end of email
        age: {
            type: Datatypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        }, // end of age
        sex: {
            type: Datatypes.BOOLEAN,
            allowNull: false,
            validate: {
                isIn: ['0', '1', ''],
                isAlphanumeric: true
            }
        }, // end of sex
        picture: {
            type: Datatypes.STRING,
            allowNull: false,
            validate: {
                isUrl: true
            }
        } // end of picture
    }, {
        // We're saying that we want our Author to have Posts
        // timestamps: false,
        classMethods: {
            associate: function(models) {
                // An Author (foreignKey) is required or a Post can't be made
                User.hasMany(models.Signup, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            },
            validPassword: function(password, passwd, done, user) {
                bcrypt.compare(password, passwd, function(err, isMatch) {
                    if (err) console.log(err);
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                });
            }
        }
    });
    return User;
}
    