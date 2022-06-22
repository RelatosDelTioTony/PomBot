//Importar modulos/librerias
const config = require('./json/config.json');
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const fs = require('fs');
require('dotenv');

//Iniciar bot
client.on('ready', () => {
	console.log(`Ready`);
});

//Esta función se encarga de seleccionar un número aleatorio dentro de un rango dado
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

//inicialización de la "base de datos"
var usrdata = require('./json/usersData.json');
var dbString = JSON.stringify(usrdata)
var dbObj = JSON.parse(dbString);

//Esta función regresa el número de archivos en un directorio
function getDirLen(path){
    const files = fs.readdirSync(path);
    return files.length;
}

//Detectar el uso de un comando
client.on('messageCreate', async message => {
	//Descartar mensajes que no son comandos
	if (message.author.bot) return; 
	if (!message.content.startsWith(config.prefix)) return;

	//Comando hit
	if (message.content.startsWith(`${config.prefix}hit`)) {
		if (!message.content.split(' ')[1]){
			message.channel.send("Olvidaste mencionar a alguien... imbecil");
			return;
		}

		//Declarar variables
		let mentionID = message.content.split(' ')[1].slice(2,-1);
        let mentionUSR = client.users.cache.get(mentionID).username;
        let msgAuthor = message.author.toString().slice(2,-1);
        let folder = "hit";
        let msgText = `${message.author.username} ha golpeado a ${mentionUSR}`;
        let usersArray = dbObj.users;
        if (usersArray.length != 0){usersArray = dbObj.users[0];}

		if (mentionID == msgAuthor){
            message.channel.send("No deberías golpearte a tí mismo... imbecil...");
            return;
        }

		if (mentionID in usersArray){
            let hp = usersArray[mentionID].hp - randInt(1,25);
            let state = "alive";
            
            if (hp <= 0){
                state = "dead";
                folder = "death";
                msgText = `${message.author.username} ha matado a ${mentionUSR}`;
                hp = 0;
            }
            
            let newUsrData = {
                    "hp": hp,
                    "state": state
            };
            
            usersArray[mentionID] = newUsrData;
            var newData = JSON.stringify(dbObj);

            console.log("JSON: User Data Updated!");
        }else{
            let newUsrData = {
                [mentionID]:{
                    "hp": 85,
                    "state": "alive"}
            }
            
            usersArray.push(newUsrData);

            var newData = JSON.stringify(dbObj);
        }
        fs.writeFile('./json/usersData.json', newData, err => {
            // Revisar si existen errores
            if(err) throw err;
            console.log("JSON: New Data Added!");
        });

		const imgPL = getDirLen(`img/${folder}`);
        const img = Math.floor(Math.random() * imgPL);
        
		//Generar el embed
        const embed = new Discord.MessageEmbed()
            .setColor(0xFF2D00)
            .addField(msgText, `${mentionUSR}'s HP: ${usersArray[mentionID].hp}`)
            .setImage(`attachment://${img}.gif`);

		//Enviar el mensaje
        message.channel.send({embeds : [embed],files: [{attachment: `img/${folder}/${img}.gif`, name: `${img}.gif`,}]});
	}

	if (message.content.startsWith(`${config.prefix}shoot`)) {
		if (!message.content.split(' ')[1]){
			message.channel.send("Olvidaste mencionar a alguien... imbecil");
			return;
		}

		//Declarar variables
		let mentionID = message.content.split(' ')[1].slice(2,-1);
        let mentionUSR = client.users.cache.get(mentionID).username;
        let msgAuthor = message.author.toString().slice(2,-1);
        let folder = "shoot";
        let msgText = `${message.author.username} ha disparado a ${mentionUSR}, vaya psicopata.`;
        let usersArray = dbObj.users;
        if (usersArray.length != 0){usersArray = dbObj.users[0];}

		if (mentionID == msgAuthor){
            message.channel.send("¡Suelta el arma!... imbecil...");
            return;
        }

		if (mentionID in usersArray){
            let hp = usersArray[mentionID].hp - randInt(10,35);
            let state = "alive";
            
            if (hp <= 0){
                state = "dead";
                folder = "death";
                msgText = `${message.author.username} ha matado a ${mentionUSR}`;
                hp = 0;
            }
            
            let newUsrData = {
                    "hp": hp,
                    "state": state
            };
            
            usersArray[mentionID] = newUsrData;
            var newData = JSON.stringify(dbObj);

            console.log("JSON: User Data Updated!");
        }else{
            let newUsrData = {
                [mentionID]:{
                    "hp": 75,
                    "state": "alive"}
            }
            
            usersArray.push(newUsrData);

            var newData = JSON.stringify(dbObj);
        }
        fs.writeFile('./json/usersData.json', newData, err => {
            // Revisar si existen errores
            if(err) throw err;
            console.log("JSON: New Data Added!");
        });

		const imgPL = getDirLen(`img/${folder}`);
        const img = Math.floor(Math.random() * imgPL);
        
		//Generar el embed
        const embed = new Discord.MessageEmbed()
            .setColor(0xFF2D00)
            .addField(msgText, `${mentionUSR}'s HP: ${usersArray[mentionID].hp}`)
            .setImage(`attachment://${img}.gif`);

		//Enviar el mensaje
        message.channel.send({embeds : [embed],files: [{attachment: `img/${folder}/${img}.gif`, name: `${img}.gif`,}]});
	}

	//Comando de resurreción
	if (message.content.startsWith(`${config.prefix}resurrect`)) {
        //Comprobar mención
        if (!message.content.split(' ')[1]){
            message.channel.send("Olvidaste mencionar a alguien... imbecil");
            return;
        }

		//Declarar variables
        let mentionID = message.content.split(' ')[1].slice(2,-1);
        let mentionUSR = client.users.cache.get(mentionID).username;
        let msgAuthor = message.author.toString().slice(2,-1);
		let usersArray = dbObj.users;
        if (usersArray.length != 0){usersArray = dbObj.users[0];}

        if (mentionID == msgAuthor){
            message.channel.send("No puedes revivirte a tí mismo... imbecil...");
            return;
        }

		if (usersArray[mentionID].state != "dead"){
			message.channel.send("El usuario no está muerto... imbecil.");
			return;
		}

        if (mentionID in usersArray){
            let newUsrData = {
                    "hp": 100,
                    "state": "alive"
            };
            
            usersArray[mentionID] = newUsrData;
            var newData = JSON.stringify(dbObj);

            fs.writeFile('./json/usersData.json', newData, err => {
                // Comprobar errores
                if(err) throw err;
                console.log("JSON: User Data Updated!");
            });

            const imgPL = getDirLen(`img/resurrect`);
            const img = Math.floor(Math.random() * imgPL);
            
			// Generar embed
            const embed = new Discord.MessageEmbed()
                .setColor(0xFF2D00)
                .addField(`${message.author.username} ha revivido a ${mentionUSR}`,`${mentionUSR}'s HP: ${usersArray[mentionID].hp}`)
                .setImage(`attachment://${img}.gif`);
        
            message.channel.send({embeds : [embed], files: [{attachment: `img/resurrect/${img}.gif`, name: `${img}.gif`,}]});
        }
    }
});