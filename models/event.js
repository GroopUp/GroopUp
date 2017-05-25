module.exports = function(sequelize, Datatypes){
	var Event = sequelize.define("Event", {

		title: {
			type: Datatypes.STRING,
			allowNull: false,
			validate: {
				len:[1]
			} // end of validate
		}, // end of name
		location: {
			type: Datatypes.STRING,
			allowNull: false,
			validate:{
				len:[1]
			}
		}, // end of username
		time: {
			type: Datatypes.STRING,
			allowNull: false,
			validate: {
				len:[1]
			}
		}, // end of time
		date: {
			type: Datatypes.STRING,
			allowNull: false,
			validate: {
				len:[1]
			}
		}, // end of email
		attendenceLimit: {
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
	},
	    {
      // We're saying that we want our Author to have Posts
      classMethods: {
        associate: function(models) {
          // An Author (foreignKey) is required or a Post can't be made
          Event.belongsTo(models.signup, {
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
	);
	return Event;
}