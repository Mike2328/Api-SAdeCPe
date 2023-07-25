import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { createReadStream, createWriteStream } from 'fs';
import { Response } from 'express';

@Injectable()
export class ImageService {

    async saveImage(image: any): Promise<any>{
        const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');

        const filename = `${randomName}-${image.originalname}`
        const path =`${process.env.PATH_FILES_TEMP}${filename}`;
        const writeStream = createWriteStream(path);
        writeStream.write(image.buffer);
        writeStream.end();
        
        return `image/preview/${filename}`; // devolvemos la ruta donde se ha guardado la imagen
    }

    async returnImage(image: string, response: Response){
        try{
            const stream = createReadStream(`${process.env.PATH_FILES_TEMP}${image}`);
            
            response.set({
                'Content-Disposition': `inline; filename="${image}"`,
                'Content-Type': "image/jpeg"
            });

            return new StreamableFile(stream);
        }catch{throw new NotFoundException(`No se pudo encontrar la imagen`);}

        
    }
}