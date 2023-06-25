const { WASocket, proto, getContentType, downloadContentFromMessage } = require('@adiwajshing/baileys')
const axios = require('axios').default
const moment = require('moment-timezone')
const FormData = require('form-data')
const { PassThrough } = require('stream')
const ffmpeg = require('fluent-ffmpeg')
const chalk = require('chalk')
const fs = require('fs')
const qs = require('qs')
const speed = require("performance-now");
const ms = require('parse-ms')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const crypto = require('crypto')
const toMS = require("ms");
const Math_js = require('mathjs');
const { getBuffer, serialize, getRandom, fetchJson, runtime, reSize, sleep } = require("../utils/myfunc");
let mess = JSON.parse(fs.readFileSync('./utils/mess.json'))
/**
 *
 * @param { string } text
 * @param { string } color
 */
const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)]
}

moment.tz.setDefault("Asia/Jakarta").locale("id");

/**
 * @param {WASocket} sock
 * @param {proto.IWebMessageInfo} msg
 */
module.exports = async (sock, msg, m) => {
    const { ownerNumber, ownerName, botName, apikey, footer, gamewaktu, merchant, secret, sign } = require('../config.json')
    const { isQuotedMsg, quotedMsg, now, fromMe, isBaileys } = msg

    const time = moment().tz('Asia/Jakarta').format('HH:mm:ss')
    if (msg.key && msg.key.remoteJid === 'status@broadcast') return
    if (!msg.message) return

    m = serialize(sock, msg)
    const type = getContentType(msg.message)
    const quotedType = getContentType(msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) || null
    const botId = sock.user.id.includes(':') ? sock.user.id.split(':')[0] + '@s.whatsapp.net' : sock.user.id
    const numbernye = `0`;
    const from = msg.key.remoteJid
    const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type == "templateButtonReplyMessage" && msg.message.templateButtonReplyMessage.selectedId) ? msg.message.templateButtonReplyMessage.selectedId : (type == "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : (type == "messageContextInfo") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
    const body = type == 'conversation' ? msg.message?.conversation : msg.message[type]?.caption || msg.message[type]?.text || ''
    const responseMessage = type == 'listResponseMessage' ? msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId || '' : type == 'buttonsResponseMessage' ? msg.message?.buttonsResponseMessage?.selectedButtonId || '' : ''
    const isGroup = from.endsWith('@g.us')
    const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
    
    const gy = '```'
    
    const tanggal = moment().tz("Asia/Jakarta").format("dddd, ll")
    const jam = moment().format("HH:mm:ss z")
    let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
    const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
    
    const pushname = msg.pushName

    const groupMetadata = isGroup ? await sock.groupMetadata(from) : null
    const groupName = groupMetadata?.subject || ''
    const groupMembers = groupMetadata?.participants || []
    const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)
    var prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
		
			     
    const command = chats.toLowerCase().split(' ')[0] || ''
    const isCmd = command.startsWith(prefix)
   
    const isGroupAdmins = groupAdmins.includes(sender)
    const isBotGroupAdmins = groupMetadata && groupAdmins.includes(botId)
    const isOwner = ownerNumber.includes(sender)
    const argus = chats.split(' ')
    
    const budy = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : ''
    let responseId = msg?.message?.listResponseMessage?.singleSelectReply?.selectedRowId || msg?.message?.buttonsResponseMessage?.selectedButtonId || null
    let args = body.trim().split(' ').slice(1)
    let full_args = body.replace(command, '').slice(1).trim()
    let q = args.join(" ")
    let randomString = 'NS-'
		charSet = "ABCDEF0123456789"
		for (let i = 0; i < 8; i++) {
		let randomPoz = Math.floor(Math.random() * charSet.length)
		randomString += charSet.substring(randomPoz, randomPoz + 1)
	    }
    let sku = `${args[0]}`;
    
    const isImage = type == 'imageMessage'
    const isVideo = type == 'videoMessage'
    const isAudio = type == 'audioMessage'
    const isSticker = type == 'stickerMessage'
    const isContact = type == 'contactMessage'
    const isLocation = type == 'locationMessage'

   const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
    const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
    const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
    mention != undefined ? mention.push(mentionByReply) : []
    const mentionUser = mention != undefined ? mention.filter(n => n) : []
    let mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
   

    const isQuoted = type == 'extendedTextMessage'
    const isQuotedImage = isQuoted && quotedType == 'imageMessage'
    const isQuotedVideo = isQuoted && quotedType == 'videoMessage'
    const isQuotedAudio = isQuoted && quotedType == 'audioMessage'
    const isQuotedSticker = isQuoted && quotedType == 'stickerMessage'
    const isQuotedContact = isQuoted && quotedType == 'contactMessage'
    const isQuotedLocation = isQuoted && quotedType == 'locationMessage'
    let timestamp = speed(); 
    let latensi = speed() - timestamp
    var mediaType = type
    var stream
    if (isQuotedImage || isQuotedVideo || isQuotedAudio || isQuotedSticker) {
        mediaType = quotedType
        msg.message[mediaType] = msg.message.extendedTextMessage.contextInfo.quotedMessage[mediaType]
        stream = await downloadContentFromMessage(msg.message[mediaType], mediaType.replace('Message', '')).catch(console.error)
    }

    if (!isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ PRIVATE ]', 'aqua'), color(body.slice(0, 50), 'white'), 'from', color(sender, 'yellow'))
    if (isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[  GROUP  ]', 'aqua'), color(body.slice(0, 50), 'white'), 'from', color(sender, 'yellow'), 'in', color(groupName, 'yellow'))
    if (!isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMMAND ]', 'aqua'), color(body, 'white'), 'from', color(sender, 'yellow'))
    if (isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMMAND ]', 'aqua'), color(body, 'white'), 'from', color(sender, 'yellow'), 'in', color(groupName, 'yellow'))

    const reply = async (text) => {
        return sock.sendMessage(from, { text: text.trim() }, { quoted: msg })
    }
    const fkon = {key: {fromMe: false, participant: `${numbernye}@s.whatsapp.net`, ...(from ? {remoteJid: "status@broadcast" } : {}) }, message: {contactMessage: {displayName: `${pushname}`, vcard: 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'N:Bot;Xrell;Ganz;;\n' + 'FN:Xrutz-Bot\n' + 'item1.TEL;waid=6283871990243:+62 838-719-90243\n' + 'item1.X-ABLabel:Telepon\n' + 'END:VCARD'}}}
    const replyk = async (text) => {
        return sock.sendMessage(from, { text: text.trim() }, { quoted: fkon })
    }
    
    
var myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    var date = new Date();
    var thisDay = date.getDay(),
    thisDay = myDays[thisDay];

    function mentions(teks, mems = [], id) {
        if (id == null || id == undefined || id == false) {
            let res = sock.sendMessage(from, { text: teks, mentions: mems })
            return res
        } else {
            let res = sock.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
            return res
        }
    }    



function hitungmundur(bulan, tanggal) {
          let from = new Date(`${bulan} ${tanggal}, 2022 00:00:00`).getTime();
          let now = Date.now();
          let distance = from - now;
          let days = Math.floor(distance / (1000 * 60 * 60 * 24));
          let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((distance % (1000 * 60)) / 1000);
          return days + "Hari " + hours + "Jam " + minutes + "Menit " + seconds + "Detik"
        }

        async function downloadAndSaveMediaMessage (type_file, path_file) {
            if (type_file === 'image') {
                var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
            } else if (type_file === 'video') {
                var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
            } else if (type_file === 'audio') {
                var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
            }
        }


        function randomNomor(min, max = null) {
            if (max !== null) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            } else {
                return Math.floor(Math.random() * min) + 1
            }
        }

        const pickRandom = (arr) => {
            return arr[Math.floor(Math.random() * arr.length)]
        }

        let runmek = runtime(process.uptime())

    // Auto Read & Presence Online
       
    await sock.readMessages([msg.key])
    await sock.sendPresenceUpdate('available', from) 
    switch (command) {    

                case prefix+'owner':
            const vcard =
                'BEGIN:VCARD\n' + // metadata of the contact card
                'VERSION:3.0\n' +
                `FN:${ownerName}\n` + // full name
                `ORG:${botName};\n` + // the organization of the contact
                `TEL;type=MSG;type=CELL;type=VOICE;waid=${ownerNumber[ownerNumber.length - 1].split('@')[0]}:+${ownerNumber[ownerNumber.length - 1].split('@')[0]}\n` + // WhatsApp ID + phone number
                'END:VCARD'

            sock.sendMessage(from, {
                contacts: {
                    displayName: ownerName,
                    contacts: [{ vcard }],
                },
            })
            break
            
         case 'menu': case prefix + 'menu':
         if (!isOwner) return reply('only owner')
         let kut = `mla (smile one)
mlb (uni brl)
mlc (uni my)
ff (kiosgamer)
${prefix}menu`
reply(kut)
break
            
            case 'mla':
    if (!q) return reply(`${command} 86 500890547 8018`)
    if (!isOwner) return  reply(`Perintah ini hanya bisa digunakan oleh owner bot`)
  axios.get(`https://v1.apigames.id/transaksi/http-get-v1?merchant=${merchant}&secret=${secret}&produk=ML${args[0]}&tujuan=${args[1]}${args[2]}&ref=${randomString}`)
  .then(({data}) => {
  let epep = `*「 Transaksi ${data.data.status} 」*

*› Game* : Mobile Legends
*› Order ID* : ${args[1]} (${args[2]})
*› Item* : ${args[0]} Diamonds 
*› Date* : ${tanggal}
*› RefId* : ${randomString}
*› Sn* : ${data.data.sn}

*Terima Kasih Sudah Order*

${botName}
  `;
  reply(epep)
    })
    .catch((err) => {
    reply(`Gagal`);
    });
    break
    
  case 'epep':
    if (!q) return reply(`${command} 720 449474128`)
    if (!isOwner) return  reply(`Perintah ini hanya bisa digunakan oleh owner bot`)
  axios.get(`https://v1.apigames.id/transaksi/http-get-v1?merchant=${merchant}&secret=${secret}&produk=FF${args[0]}&tujuan=${args[1]}&ref=${randomString}`)
  .then(({data}) => {
  let epep = `*「 Transaksi ${data.data.status} 」*

*› Game* : Free Fire id
*› Order ID* : ${args[1]}
*› Item* : ${args[0]} Diamonds 
*› Date* : ${tanggal}
*› RefId* : ${randomString}
*› Sn* : ${data.data.sn}

*Terima Kasih Sudah Order*

${botName}
  `;
  reply(epep)
    })
    .catch((err) => {
    reply(`Gagal`);
    });
    break
    
   case 'mlb':
    if (!q) return reply(`${command} 86 500890547 8018`)
    if (!isOwner) return  reply(`Perintah ini hanya bisa digunakan oleh owner bot`)
  axios.get(`https://v1.apigames.id/transaksi/http-get-v1?merchant=${merchant}&secret=${secret}&produk=UBRMBL${args[0]}&tujuan=${args[1]}${args[2]}&ref=${randomString}`)
  .then(({data}) => {
  let epep = `*「 Transaksi ${data.data.status} 」*

*› Game* : Mobile Legends
*› Order ID* : ${args[1]} (${args[2]})
*› Item* : ${args[0]} Diamonds 
*› Date* : ${tanggal}
*› RefId* : ${randomString}
*› Sn* : ${data.data.sn}

*Terima Kasih Sudah Order*

${botName}
  `;
  reply(epep)
    })
    .catch((err) => {
    reply(`Gagal`);
    });
    break

 case 'mlc':
    if (!q) return reply(`${command} 86 500890547 8018`)
    if (!isOwner) return  reply(`Perintah ini hanya bisa digunakan oleh owner bot`)
  axios.get(`https://v1.apigames.id/transaksi/http-get-v1?merchant=${merchant}&secret=${secret}&produk=UPMYMBL${args[0]}&tujuan=${args[1]}${args[2]}&ref=${randomString}`)
  .then(({data}) => {
  let epep = `*「 Transaksi ${data.data.status} 」*

*› Game* : Mobile Legends
*› Order ID* : ${args[1]} (${args[2]})
*› Item* : ${args[0]} Diamonds 
*› Date* : ${tanggal}
*› RefId* : ${randomString}
*› Sn* : ${data.data.sn}

*Terima Kasih Sudah Order*

${botName}
  `;
  reply(epep)
    })
    .catch((err) => {
    reply(`Gagal`);
    });
    break
                
}
}
