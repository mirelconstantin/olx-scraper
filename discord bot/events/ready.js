const { ActivityType } = require('discord.js');
const mysql = require('mysql2');
const client = require('..');
const chalk = require('chalk');

client.on("ready", () => {
	console.log(chalk.red(`Logged in as ${client.user.tag}`))
	const activities = [
		{ name: `chirii in Timisoara`, type: ActivityType.Watching },
		{ name: `chirii in Bucuresti`, type: ActivityType.Watching }
	];
	
	let connection = mysql.createConnection({ host: process.env.MYSQL_HOST, user: process.env.MYSQL_USER, password: process.env.MYSQL_PASS, database: process.env.MYSQL_DB });
	
	sendRent("garsoniera", "bucuresti", "1066304785730523217", connection)
	sendRent("2camere", "bucuresti", "1066318765299597372", connection)

	sendRent("garsoniera", "timisoara", "1066306021649301564", connection)
	sendRent("2camere", "timisoara", "1066306034307706921", connection)
	
	let i = 0;
	setInterval(() => {
		if(i >= activities.length) i = 0
		client.user.setActivity(activities[i])
		i++;
	}, 5000);
});


function sendRent(type, city, channel, connection){
	let query = `SELECT * FROM ${city} WHERE sent = 0 AND type='${type}'`;
	setInterval(() => {
		connection.connect();
		connection.query(query, function (err, rows, fields) {
			if (err) throw err;
			for(let i=0;i<rows.length;i++){
				connection.query(`UPDATE ${city} SET sent = 1 WHERE id = ${rows[i].id}`, (error, results, fields) => {
					if (error){
					  return console.error(error.message);
					}
				});
				let message;
				if (city=="bucuresti"){
					message=`<@&1066329868079464470>, **${rows[i].title.charAt(0).toUpperCase() + rows[i].title.slice(1)}** 🗺️\n> Pret: ${rows[i].price}\n> Locatie: ${rows[i].location}\n> Ora postare: ${rows[i].time}\n> **Link: ${rows[i].link}**`;
				} else if(city=="timisoara"){
					message=`<@&1066329892733603872>, **${rows[i].title.charAt(0).toUpperCase() + rows[i].title.slice(1)}** 🗺️\n> Pret: ${rows[i].price}\n> Locatie: ${rows[i].location}\n> Ora postare: ${rows[i].time}\n> **Link: ${rows[i].link}**`;
				}
		
				client.channels.cache.get(channel).send(message);
			}
		});
	}, 60*1000)
}