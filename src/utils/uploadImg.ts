import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import path from 'path';

export async function uploadImg(req: Request, res: Response, title: string) {
    const uploadedFile: UploadedFile | undefined = req.files?.file as UploadedFile | undefined;
    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.includes('multipart/form-data')) {
        return res.status(400).json({ error: 'Fayl tipi noto\'g\'ri' });
    }
    if (!uploadedFile) {
        return res.status(400).json({ error: 'Fayl yuklanmagan' });
    }

    // Faylni "public/img" papkasiga saqlash
    const fileExt = path.extname(uploadedFile.name); // Fayl kengaytmasini aniqlash
    const allowedExtensions = ['.jpg', '.png', '.jpeg']; // Qabul qilingan fayl kengaytmalari
    let dynamicFileName = `${title}-${Date.now()}`; // Fayl nomi
    if (allowedExtensions.includes(fileExt.toLowerCase())) {
        dynamicFileName += fileExt;
    } else {
        return res.status(400).json({ error: 'Fayl formati qo\'llanilganlardan farq qiladi' });
    }
    const imgDir = path.join(process.cwd(), 'src', 'public', 'img');
    if (fs.existsSync(imgDir)) {
        try {
            await uploadedFile.mv(path.join(imgDir, dynamicFileName));
            const img_link = `/img/${dynamicFileName}`; // Fayl manzili
            return img_link;
        } catch (error) {
            return res.status(500).json({ error: 'Faylni saqlashda xatolik yuz berdi' });
        }
    }
    // const imgPath = path.join(process.cwd(), 'public', 'img', dynamicFileName);
    // console.log('imgPath :', imgPath);

    // try {
    //     await uploadedFile.mv(imgPath);
    //     const img_link = `/img/${dynamicFileName}`; // Fayl manzili
    //     return img_link;
    // } catch (error) {
    //     return res.status(500).json({ error: 'Faylni saqlashda xatolik yuz berdi' });
    // }
}

