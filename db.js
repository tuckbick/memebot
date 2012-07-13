var Sequelize = require("sequelize");

var sequelize = new Sequelize('memebot', 'root', '', {
    dialect: 'sqlite',
    storage: 'db.sqlite',
});

var Meme = sequelize.define('Meme', {
  keyword: Sequelize.STRING,
  value: Sequelize.STRING
});

Meme.sync();
// sequelize.sync({force : true});

exports.db = {
	Meme: Meme
}