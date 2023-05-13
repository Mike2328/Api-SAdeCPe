import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';

@Injectable()
export class ImageService {

    async saveImage(image: any): Promise<any>{
        console.log(image);
        const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
        const path =`C:/Users/mikeg/Downloads/pruebaApi/${randomName}-${image.originalname}`;
        const writeStream = createWriteStream(path);
        writeStream.write(image.buffer);
        writeStream.end();
        
        return path; // devolvemos la ruta donde se ha guardado la imagen
    }
}