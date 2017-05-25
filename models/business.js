module.exports = function(sequelize, Datatypes){
	var Buisness = sequelize.define("Buisness", {

		name: {
			type: Datatypes.STRING,
			allowNull: false,
			validate: {
				len:[1]
			} // end of validate
		}, // end of name
		password: {
			type: Datatypes.STRING,
			allowNull: false,
			validate: {
				len:[1]
			}
		}, // end of password
		phonenumber: {
			type: Datatypes.STRING,
			allowNull: false,
			validate: {
				len: [10]
			}
		}, // end of phonenumber

	},
	    {
      classMethods: {
        associate: function(models) {
          Buisness.belongsTo(models.event, {
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
	);
	return Buisness;
}