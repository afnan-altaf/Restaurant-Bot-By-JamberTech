const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

// 🌟 FIREBASE URL FROM GITHUB SECRETS 🌟
const FIREBASE_URL = process.env.FIREBASE_URL;

const orderStates = {}; 

// Firebase se live menu fetch karo
async function getMenuFromApp() {
    try {
        const response = await fetch(`${FIREBASE_URL}/dishes.json`);
        const data = await response.json();
        if (!data) return [];
        
        return Object.keys(data).map(key => ({
            id: key,
            name: data[key].name,
            price: data[key].price,
            imageUrl: data[key].imageUrl
        }));
    } catch (error) {
        console.error("Menu fetch error:", error);
        return [];
    }
}

async function startBot() {
    if (!FIREBASE_URL) {
        console.log("❌ ERROR: FIREBASE_URL GitHub Secrets mein nahi hai!");
        process.exit(1);
    }

    const { state, saveCreds } = await useMultiFileAuthState('session_data');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ["S", "K", "1"] 
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.clear(); 
            console.log('\n==================================================');
            console.log('⚠️ QR CODE BARA HA? "View raw logs" par click karein!');
            console.log('==================================================\n');
            qrcode.generate(qr, { small: true }); 
        }

        if (connection === 'open') console.log('✅ JAMBERTECH RESTAURANT BOT ONLINE HA!');
        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) startBot();
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;
        if (msg.key.fromMe) return;

        const sender = msg.key.remoteJid;
        const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").toLowerCase();

        console.log(`📩 Message: ${text}`);

        // --- STEP 2: ADDRESS LENA AUR ORDER SAVE KARNA ---
        if (orderStates[sender]?.step === 'WAITING_FOR_ADDRESS') {
            const customerDetails = text;
            const item = orderStates[sender].item;
            const customerWaNumber = sender.split('@')[0];

            const order = {
                userId: "whatsapp_" + customerWaNumber,
                userEmail: "whatsapp@jambertech.com",
                phone: customerWaNumber,
                address: customerDetails,
                location: { lat: 0, lng: 0 },
                items: [{
                    id: item.id,
                    name: item.name,
                    price: parseFloat(item.price),
                    img: item.imageUrl || "",
                    quantity: 1
                }],
                total: (parseFloat(item.price) + 100).toFixed(2), // Rs 100 delivery charge
                status: "Placed",
                method: "Cash on Delivery (WhatsApp)",
                timestamp: new Date().toISOString()
            };

            try {
                await fetch(`${FIREBASE_URL}/orders.json`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(order)
                });
            } catch (error) {
                console.log("Firebase Error: ", error);
            }

            await sock.sendMessage(sender, { 
                text: `✅ *Order Ho Gaya!* 🎉\n\nShukria! Aapka *${item.name}* ka order receive ho gaya hai.\n\n*Total:* Rs ${order.total} (Delivery Shamil)\n*Status:* Tayyar Ho Raha Hai\n\nHum jald hi aapke address par deliver kar dein ge. Shukria! 🙏` 
            });
            delete orderStates[sender]; 
            return;
        }

        // --- STEP 1: ORDER SHURU KARNA ---
        if (text.startsWith("order ")) {
            const productRequested = text.replace("order ", "").trim().toLowerCase();
            const currentMenu = await getMenuFromApp();
            
            const matchedItem = currentMenu.find(item => item.name.toLowerCase().includes(productRequested));

            if (!matchedItem) {
                await sock.sendMessage(sender, { 
                    text: `❌ Maafi chahta hoon, *${productRequested}* aaj hamare menu mein nahi hai.\n\n*menu* type karein poora menu dekhne ke liye.` 
                });
                return;
            }

            orderStates[sender] = { step: 'WAITING_FOR_ADDRESS', item: matchedItem };
            
            const captionText = `🛒 *Order Shuru Ho Gaya!*\n\nAapne select kiya: *${matchedItem.name}* (Rs ${matchedItem.price})\n\nBrahye apna *Poora Naam, Phone Number aur Delivery Address* reply mein bhejein.`;
            
            if (matchedItem.imageUrl) {
                await sock.sendMessage(sender, { 
                    image: { url: matchedItem.imageUrl }, 
                    caption: captionText 
                });
            } else {
                await sock.sendMessage(sender, { text: captionText });
            }
        }
        else if (text === "order") { 
            await sock.sendMessage(sender, { 
                text: "🛒 *Order Kaise Karein:*\n'order' ke baad dish ka naam likhein.\nMisal: *order pizza*" 
            });
        }
        
        // --- LIVE MENU ---
        else if (text.includes("menu") || text.includes("price") || text.includes("list") || text.includes("khana") || text.includes("food")) {
            const currentMenu = await getMenuFromApp();
            
            if (currentMenu.length === 0) {
                await sock.sendMessage(sender, { text: "Hamare menu mein abhi kuch nahi hai. Thodi der baad dobara check karein!" });
                return;
            }

            let menuMessage = "🍔 *JAMBERTECH RESTAURANT - LIVE MENU* 🍕\n\n";
            currentMenu.forEach(item => {
                menuMessage += `🔸 *${item.name}* - Rs ${item.price}\n`;
            });
            menuMessage += "\n_Order karne ke liye: 'order [dish ka naam]' likhein_";
            
            await sock.sendMessage(sender, { text: menuMessage });
        }

        // --- SALAM ---
        else if (text.includes("hi") || text.includes("hello") || text.includes("salam") || text.includes("assalam") || text.includes("hey")) {
            await sock.sendMessage(sender, { 
                text: "👋 *Assalam-o-Alaikum! JamberTech Restaurant mein Khush Aamdeed!* 🇵🇰\n\nMain aapka AI Assistant hoon.\n📋 *menu* type karein khana dekhne ke liye\n🛒 *order [dish]* type karein order karne ke liye!" 
            });
        }
        else if (text.includes("contact") || text.includes("call") || text.includes("rabta")) {
            await sock.sendMessage(sender, { 
                text: "📞 *JamberTech Restaurant se Rabta:*\n\n- *Email:* support@jambertech.com\n- *WhatsApp:* Is number par message karein" 
            });
        }
        else if (text.includes("shukriya") || text.includes("thanks") || text.includes("thank")) {
            await sock.sendMessage(sender, { text: "🙏 *Shukriya!* Dobara tashreef layein. JamberTech Restaurant har waqt aapki khidmat mein hazir hai! 🇵🇰" });
        }
        else {
            await sock.sendMessage(sender, { 
                text: "🤔 Mujhe samajh nahi aaya.\n\n📋 *menu* type karein khane ki list dekhne ke liye\n🛒 *order [khana]* type karein order karne ke liye!" 
            });
        }
    });
}

startBot().catch(err => console.log("Error: " + err));
