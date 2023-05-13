import { Controller, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from 'src/image/service/image.service';

@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService){}
    
    @Post("upload")
    @UseInterceptors(FileInterceptor('file',{
        fileFilter: (req,file,cb) =>{
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/gi))
                return cb( new Error('Invalid Format type'), false);

            cb(null, true);
        }
    }))
    async uploadFile(@UploadedFile() file){
        return this.imageService.saveImage(file)
    }
}