module.exports = function(sequelize, Datatypes) {
    var Signup = sequelize.define("Signup", {


    }, {

        classMethods: {
            associate: function(models) {

                Signup.belongsTo(models.User, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        },
        timestamps: false,
        classMethods: {
            associate: function(models) {

                Signup.belongsTo(models.Event, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });
    return Signup;
}
