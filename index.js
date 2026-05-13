const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const pino = require('pino')

const BOT_NAME = "MyBot"
const PREFIX = "."

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state
    })

    sock.ev.on('connection.update', (update) => {
        if(update.qr) {
            console.log('📱 QR code scan කරන්න:', update.qr)
        }
        if(update.connection === 'open') {
            console.log(`✅ ${BOT_NAME} Bot connected!`)
        }
    })

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if(!msg.message || msg.key.fromMe) return
        const from = msg.key.remoteJid
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text

        if(text === PREFIX + 'menu') {
            const menu = `*🌍 ${BOT_NAME} BOT MENU*\n\n` +
                         `*1️⃣ OWNER MENU*\n` +
                         `*2️⃣ AI MENU*\n` +
                         `*3️⃣ TOOLS MENU*\n\n` +
                         `Reply number එකක් දාන්න`
            await sock.sendMessage(from, { text: menu })
        }
    })

    sock.ev.on('creds.update', saveCreds)
}

startBot()
