module.exports = function(sequelize, Datatypes){
	var Signup = sequelize.define("Signup", {

		timestamps: true
	},
	    {
      
      classMethods: {
        associate: function(models) {
          
          Signup.belongsTo(models.User, {
            foreignKey: {
              allowNull: false
            }
          });
        }
      },
      classMethods: {
        associate: function(models) {
          
          Signup.belongsTo(models.Event, {
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
	);
	return Signup;
}