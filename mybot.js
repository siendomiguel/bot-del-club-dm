require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

//funcion para el estado del bot
function estadoDelBot(){
    client.user.setPresence ({
        status: 'online',
        activity: {
            name: 'Trading MODE: ON | -ayuda',
            type: 'WATCHING'
        }
    })
}

let prefix = process.env.PREFIX; //Llamamos al Prefix

client.on('ready', () => {
    console.log('Estoy Listo!!');
    estadoDelBot(); //Llamamos la funcion de estado
});


client.on('message', (message) => {

if(message.author.bot) return; //No responder a mensajes de otros Bots
//if(!message.content.startsWith(prefix)) return; //No responder si el contenido del mensaje no empieza por el prefix

//Definimos prefix y commands
const args = message.content.slice(prefix.length).trim().split(' ');
const command = args.shift().toLocaleLowerCase();

const CHANNEL_ID = process.env.CHANNEL_ID;
const dest = CHANNEL_ID; //Channel ID (Discord)

if( command === 'ayuda'){
    message.channel.send('Lo siento, Este bot aun esta en fase BETA!! :pensive: ').then(msg => msg.delete({timeout: 3000}));;

    message.delete();
}

if(message.content.includes('t.me/' || 'https://t.me/')) {
    let perms = message.member.hasPermission("MANAGE_ROLES");

    if(perms) return;
    message.channel.send(`No se permiten compartir grupos de Telegram en este Discord`).then(msg => msg.delete({timeout: 3000}));
    
    client.channels.cache.get(dest).send(`El usuario <@${message.author.id}> envió este grupo de telegram ${message.content}`);
    message.delete();

    console.log(message.author.username);
}



//Expulsar a un usuario
if(command === 'kick'){
    let mencionado = message.mentions.users.first();
    let razon = args.slice(1).join(' ');
    
    let perms = message.member.hasPermission("MANAGE_ROLES");

    if(!perms) return message.channel.send("No tienes permisos suficientes, para expulsar personas.");
    if(!mencionado) return message.channel.send('Mencione a un usuario');
    if(!razon) return message.channel.send('Debe escribir una razon para expulsar al usuario\n\n**Ejemplo:** -kick @usuariomencionado El usuario ha roto las reglas del servidor');

    message.guild.member(mencionado).kick(razon);
    message.channel.send(`El usuario :point_right_tone3: **${mencionado.tag}** fue expulsado del servidor.\n\n**Razón: **${razon}`);

    message.delete();

}

//Banear a un usuario
if(command === 'ban'){
    let mencionado = message.mentions.users.first();
    let razon = args.slice(1).join(' ');


    if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("No tienes permisos suficientes, para banear usuarios.");
    if(!mencionado) return message.channel.send('Mencione a un usuario');
    if(!razon) return message.channel.send('Debe escribir una razon para banear al usuario.\n\n**Ejemplo:** -ban @usuariomencionado El usuario ha roto las reglas del servidor');

    message.guild.member(mencionado).ban(razon).reason;
    message.channel.send(`El usuario :point_right_tone3: **${mencionado.tag}** fue baneado del servidor.\n\n**Razón: **${razon}\n\nhttps://giphy.com/gifs/ban-banned-admin-fe4dDMD2cAU5RfEaCU`);

    message.delete();

}

//Agregar rol de usuario
if(command === 'arol'){
    let miembro = message.mentions.members.first();
    let nombrerol = args.slice(1).join(' ');

    let role = message.guild.roles.cache.find(r => r.name === nombrerol);
    let perms = message.member.hasPermission("MANAGE_ROLES");

    if(!perms) return message.channel.send("No tienes permisos suficientes, para agregar roles.");
    if(!miembro) return message.reply('Debe mencionar a un miembro.');
    if(!nombrerol) return message.channel.send('Escriba el nombre del rol a agregar.');
    if(!role) return message.channel.send('Rol no encontrado en el servidor.');

    miembro.roles.add(role).catch(console.error);
    message.channel.send(`El rol **${role.name}** fue agregado a **<@${miembro.id}>**.`);

    message.delete();

}

//Eliminar rol de usuario
if(command === 'erol'){
    let miembro = message.mentions.members.first();
    let nombrerol = args.slice(1).join(' ');

    let role = message.guild.roles.cache.find(r => r.name === nombrerol);
    let perms = message.member.hasPermission("MANAGE_ROLES");

    if(!perms) return message.channel.send("No tienes permisos suficientes, para remover roles.");
    if(!miembro) return message.reply('Debe mencionar a un miembro.');
    if(!nombrerol) return message.channel.send('Escriba el nombre del rol a remover.');
    if(!role) return message.channel.send('Rol no encontrado en el servidor.');

    miembro.roles.remove(role).catch(console.error);
    message.channel.send(`El rol **${role.name}** fue eliminado de **<@${miembro.id}>**.`);

    message.delete();

    
}


});



client.login(DISCORD_TOKEN); //Llamamos al TOKEN