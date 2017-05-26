module.exports = function(sequelize, Datatypes) {
    var Event = sequelize.define("Event", {

        title: {
            type: Datatypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            } // end of validate
        }, // end of name
        location: {
            type: Datatypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        }, // end of username
        time: {
            type: Datatypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        }, // end of time
        date: {
            type: Datatypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        }, // end of email
        attendence_cap: {
            type: Datatypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        }, // end of age
        picture: {
            type: Datatypes.STRING,
            allowNull: false,
            validate: {
                isUrl: true
            }
        } // end of picture
    }, {
        // timestamps: false,
        classMethods: {
            associate: function(models) {
                Event.belongsTo(models.Business, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    }, {
        classMethods: {
            associate: function(models) {
                Event.hasMany(models.Signup, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });
    return Event;
}
