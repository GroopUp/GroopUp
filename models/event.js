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
        attendance_cap: {
            type: Datatypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        }, // end of age
        totalUsers: {
            type: Datatypes.INTEGER,
            validate: {
                isInt: true
            }
        }, // end of age
        leftSpot: {
            type: Datatypes.INTEGER,
            validate: {
                isInt: true
            }
        }, // end of age
        compatibility: {
            type: Datatypes.INTEGER,
            validate: {
                isFloat: true
            }
        },
        price: {
            type: Datatypes.INTEGER,
            validate: {
                isFloat: true
            }
        },
        originalprice: {
            type: Datatypes.INTEGER,
            validate: {
                isFloat: true
            }
        },
        picture: {
            type: Datatypes.TEXT,
            allowNull: false,
            validate: {
                isUrl: true
            }
        }, // end of picture
        equizresults: {
            type: Datatypes.STRING
        }
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
                    onDelete: "cascade"
                });
            }
        }
    });
    return Event;
}
