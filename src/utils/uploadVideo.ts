import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import path from 'path';

export async function uploadVideo(req: Request, res: Response, title: string) {
    const uploadedFile: UploadedFile | undefined = req.files?.file as UploadedFile | undefined;
    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.includes('multipart/form-data')) {
        return res.status(400).json({ error: 'Fayl tipi noto\'g\'ri' });
    }
    if (!uploadedFile) {
        return res.status(400).json({ error: 'Fayl yuklanmagan' });
    }

    // Faylni "public/video" papkasiga saqlash
    const fileExt = path.extname(uploadedFile.name); // Fayl kengaytmasini aniqlash
    const allowedExtensions = ['.mp4', '.avi', '.mov']; // Qabul qilingan fayl kengaytmalari
    let dynamicFileName = `${title}-${Date.now()}`; // Fayl nomi

    if (allowedExtensions.includes(fileExt.toLowerCase())) {
        dynamicFileName += fileExt;
    } else {
        return res.status(400).json({ error: 'Fayl formati qo\'llanilganlardan farq qiladi' });
    }

    const videoDir = path.join(process.cwd(), 'src', 'public', 'video');
    if (fs.existsSync(videoDir)) {
        try {
            await uploadedFile.mv(path.join(videoDir, dynamicFileName));
            const video_link = `/video/${dynamicFileName}`; // Fayl manzili
            return video_link;
        } catch (error) {
            return res.status(500).json({ error: 'Video saqlashda xatolik yuz berdi' });
        }
    }
}

export default uploadVideo;
