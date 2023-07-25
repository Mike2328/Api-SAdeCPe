import { Controller, Get, NotFoundException, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ImageService } from 'src/image/service/image.service';


@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService){}
    
    @Post("upload-file")
    @UseInterceptors(FileInterceptor('file',{
        fileFilter: (req,file,cb) =>{
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/gi))
                return cb( new Error('Invalid Format type'), false);

            return cb(null, true);
        },
        limits: {
            fileSize: (5 * 1024 * 1024)
        }
    }))
    async uploadImage(@UploadedFile() file){
            return this.imageService.saveImage(file);
    }

    @Get('preview/:name')
    async getImage(@Param('name') image: string, @Res({ passthrough: true }) response: Response){
       return this.imageService.returnImage(image, response);
    }
}