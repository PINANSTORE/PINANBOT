const { default: WASocket, useSingleFileAuthState, fetchLatestBaileysVersion, DisconnectReason, jidDecode } = require('@adiwajshing/baileys')
const Pino = require('pino')
const { sessionName } = require('./config.json')
const { Boom } = require('@hapi/boom')
const { existsSync } = require('fs')
const path = require('path')
const fs = require('fs')
let version=[0x12fc+-0xef2+-0x408,0xc*0x2d4+0xa*0x22d+-0x2eaa,0x14e*0x1+-0x1*-0xc7+-0x20e];
const { state, saveState } = useSingleFileAuthState(path.resolve(`BOT.json`), Pino({ level: 'silent' }))
const { getBuffer, serialize } = require("./utils/myfunc")
const messageHandler = require('./handler/message')

const connect = async () => {
    let { isLatest } = await fetchLatestBaileysVersion()

    console.log(`HALLO KAK`)
    
    console.log(`SCRIPT PINAN STORE!!!`)
    
    console.log(`SCRIPT INI JANGAN DI JUAL KEMBALI !!!`)
    
    const sock = WASocket({
        printQRInTerminal: true,
        auth: state,
        logger: Pino({ level: 'silent' }),
        version,
    })

    sock.ev.on('creds.update', saveState)
    sock.ev.on('connection.update', async (up) => {
        const { lastDisconnect, connection } = up
        if (connection) {
            console.log('Status Koneksi: ', connection)
        }

        if (connection === 'close') {
            let reason = new Boom(lastDisconnect.error).output.statusCode
            if (reason === DisconnectReason.badSession) {
                console.log(`Bad Session File, Please Delete ${sessionName}-session.json and Scan Again`)
                sock.logout()
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log('Pastikan Terhubung Ke Internet....')
                connect()
            } else if (reason === DisconnectReason.connectionLost) {
                console.log('Koneksi Hilang dari Server...')
                connect()
            } else if (reason === DisconnectReason.connectionReplaced) {
                console.log('Koneksi Diganti, Sesi Baru Dibuka, Harap Tutup Sesi Saat Ini Terlebih Dahulu')
                sock.logout()
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(`Device Logged Out, Please Delete ${sessionName}-session.json and Scan Again.`)
                sock.logout()
            } else if (reason === DisconnectReason.restartRequired) {
                console.log('Restart Required, Restarting...')
                connect()
            } else if (reason === DisconnectReason.timedOut) {
                console.log('Batas Waktu Koneksi, Menghubungkan Kembali...')
                connect()
            } else {
                sock.end(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`)
            }
        }
    })

    // messages.upsert
    sock.ev.on('messages.upsert', ({ messages, type }) => {
        if (type !== 'notify') return
        messageHandler(sock, messages[0])
    })

    sock.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }    

}
connect()
