import fs from 'fs'
import https from 'https'
import path from 'path'

export async function SavaImg(SavePath, ResData) {
    const saveDir = SavePath;
    if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir);
    }

    ResData.expeditions.forEach(expedition => {
        expedition.avatars.forEach(avatarUrl => {
            const filename = path.basename(avatarUrl);
            const savePath = path.join(saveDir, filename);
            if (fs.existsSync(savePath)) {
                return;
            }
            const file = fs.createWriteStream(savePath);
            https.get(avatarUrl, function (response) {
                response.pipe(file);
            });
        });
    });
}