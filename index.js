const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder, ChannelType } = require('discord.js');
const sharp = require('sharp');

// ==========================================
// ⚙️ โซนตั้งค่า (CONFIGURATION)
// ==========================================
// ระบบจะดึงรหัสผ่านจาก Environment Variables ของ Render เพื่อความปลอดภัย
const BOT_TOKEN = process.env.BOT_TOKEN; 

const CHANNEL_MAPPING = {
    // ห้องที่ 1: yellow updates (fake)
    '1520297256484339736': { 
        targetChannelId: '1520323284997115945', 
        color: '#F0E9B6', 
        title: '﹕ 𖥻﹒    🧈  yellow update', 
        thumbnail: 'https://cdn.discordapp.com/attachments/1520323215241777183/1520354280736030760/IMG_20260625_005120.jpg?ex=6a40e3c3&is=6a3f9243&hm=6e17fb8448da08082189c6227ff0f005a3c68a095d14dd802da3bd2031f9abf2',   
        description: 'new fake release ! ┆ ♡ ', 
        topicLabel: ' .🌟 ⋮ 멤버 .ᐟ ֹ ₊', 
        footer: '꒰ 🎨. yellow ──★ ˙jaoniff ̟   !!' 
    },
    // ห้องที่ 2: yellow updates (content)
    '1520297256484339740': { 
        targetChannelId: '1520323284997115945', 
        color: '#F0E9B6', 
        title: '﹕ 𖥻﹒    🧈  yellow update', 
        thumbnail: 'https://cdn.discordapp.com/attachments/1520323215241777183/1520354280736030760/IMG_20260625_005120.jpg?ex=6a40e3c3&is=6a3f9243&hm=6e17fb8448da08082189c6227ff0f005a3c68a095d14dd802da3bd2031f9abf2',
        description: 'new fake release ! ┆ ♡  ', 
        topicLabel: ' .🌟 ⋮ 멤버 .ᐟ ֹ ₊',
        footer: '꒰ 🎨. yellow ──★ ˙jaoniff ̟   !!' 
    },
    // ห้องที่ 3: white updates (fake)
    '1520297256614625294': { 
        targetChannelId: '1520323284997115945', 
        color: '#FAF9F6', 
        title: '﹕ 𖥻﹒    ☁️  white update', 
        thumbnail: 'https://cdn.discordapp.com/attachments/1520323215241777183/1520354467231563846/A46F1B18-AEEC-427D-882C-C0C08DD179D1.png?ex=6a40e3ef&is=6a3f926f&hm=27d12187ec9599ab06d1e0fe5281ba72d94ecd9829e3bb174ba0032e42211e45',
        description: 'new fake release ! ┆ ♡ ', 
        topicLabel: ' .🪽 ⋮ 멤버 .ᐟ ֹ ₊',
        footer: '꒰ 🎨. white ──★ ˙onryo ̟   !!' 
    },
    // ห้องที่ 4: white updates (special log)
    '1520297256614625299': { 
        targetChannelId: '1520323284997115945', 
        color: '#FAF9F6', 
        title: '﹕ 𖥻﹒    ☁️ white update', 
        thumbnail: 'https://cdn.discordapp.com/attachments/1520323215241777183/1520354467231563846/A46F1B18-AEEC-427D-882C-C0C08DD179D1.png?ex=6a40e3ef&is=6a3f926f&hm=27d12187ec9599ab06d1e0fe5281ba72d94ecd9829e3bb174ba0032e42211e45',
        description: 'special log release ! ┆ ♡ ', 
        topicLabel: ' .🪽 ⋮ 멤버 .ᐟ ֹ ₊',
        footer: '꒰ 🎨. white ──★ ˙onryo ̟   !!' 
    },
    // ห้องที่ 5: black updates
    '1520297256736133198': { 
        targetChannelId: '1520323284997115945', 
        color: '#36454F', 
        title: '﹕ 𖥻﹒    🐈‍⬛ black update', 
        thumbnail: 'https://cdn.discordapp.com/attachments/1520323215241777183/1520354474147840010/IMG_7086.jpg?ex=6a40e3f1&is=6a3f9271&hm=33903fbb0280f37ba3964ffa8ca8b9efefee523a9d2b5b9d00055f3908a38724',
        description: 'new fake release ! ┆ ♡', 
        topicLabel: ' .🎹 ⋮ 멤버 .ᐟ ֹ ₊',
        footer: '꒰ 🎨. black  ──★ ˙your time ̟   !!' 
    },
    //  ห้องที่ 6
    '1520351981699338382': { 
        targetChannelId: '1520323284997115945', 
        color: '#D8BFD8', 
        title: '﹕ 𖥻﹒    🪻  purple update', 
        thumbnail: 'https://cdn.discordapp.com/attachments/1520323215241777183/1520354275715448882/IMG_1172.jpg?ex=6a40e3c2&is=6a3f9242&hm=7a59f2a3d1bef9580faafc056501d580dcb1c43e7a148b1f9a245566499d1854',
        description: 'new fake release ! ┆ ♡', 
        topicLabel: ' .🔮 ⋮ 멤버 .ᐟ ֹ ₊', 
        footer: '꒰ 🎨. purple  ──★ ˙unit ̟   !!' 
    }
};

// ==========================================
// 🧠 โซนการทำงานของบอท (CORE LOGIC)
// ==========================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`✅ บอทออนไลน์แล้วในชื่อ: ${client.user.tag} (เวอร์ชันแท็ก @everyone + เพิ่มห้องที่ 6)`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; 
    if (message.channel.type !== ChannelType.PublicThread) return; 

    const config = CHANNEL_MAPPING[message.channel.parentId];
    if (!config) return; 

    try {
        // ข้ามระบบประกาศหากเป็นข้อความแรกตอนสร้างกระทู้ฟอรั่มใหม่
        if (message.id === message.channel.id) return;

        // ตรวจสอบรูปภาพในคอมเมนต์
        const attachment = message.attachments.first();
        if (!attachment || !attachment.contentType?.startsWith('image/')) {
            return; 
        }

        console.log(`📸 พบรูปภาพใหม่ในกระทู้ "${message.channel.name}" กำลังประมวลผลรูปภาพ...`);

        // จัดการรูปภาพเป็น 1:1 และเบลอ ระดับ 15 ด้วย Sharp
        const imageBuffer = await fetch(attachment.url).then(res => res.arrayBuffer());
        const processedImage = await sharp(Buffer.from(imageBuffer))
            .resize(800, 800, { fit: 'cover' }) 
            .blur(15)                           
            .toBuffer();

        const finalImage = new AttachmentBuilder(processedImage, { name: 'announcement.png' });

        // ✉️ สร้างหน้าตา Embed ประกาศ
        const embed = new EmbedBuilder()
            .setColor(config.color)                             
            .setTitle(config.title)                             
            .setThumbnail(config.thumbnail) 
            
            // รายละเอียดประกาศ
            .setDescription(
                `${config.description}\n` +
                `**${config.topicLabel || 'Topic'}:** ${message.channel.name}\n\n` + 
                ` [Click here to view ](${message.url})`
            ) 
            
            .setImage('attachment://announcement.png')          
            .setFooter({ text: config.footer });

        // 🚀 ส่งประกาศไปยังห้องเป้าหมายพร้อมแท็กทุกคน (@everyone)
        const targetChannel = await client.channels.fetch(config.targetChannelId);
        if (targetChannel) {
            await targetChannel.send({ content: '@everyone', embeds: [embed], files: [finalImage] });
            console.log(`🚀 ส่งประกาศพร้อมแท็ก @everyone จากกระทู้ "${message.channel.name}" สำเร็จ!`);
        }

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการประมวลผลข้อความประกาศ:', error);
    }
});

// ==========================================
// 🌐 ส่วนแก้ไขสำหรับ Render (Port Binding)
// ==========================================
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('🤖 บอทประกาศอัปเดตของคุณรันอยู่ตลอด 24 ชั่วโมงแล้ว!');
});

// ดึงพอร์ตที่สุ่มจาก Render (process.env.PORT) เพื่อแก้บัค No open ports detected
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Web Server สำหรับปลุกบอทพร้อมทำงานแล้วที่พอร์ต ${PORT}`);
});

client.login(BOT_TOKEN);
