import { Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common';
import { MeetService } from './meet.service';
import { GetMeetDto } from './dtos/getmeet.dto';
import { CreateMeetDto } from './dtos/createmeet.dto';
import { UpdateMeetDto } from './dtos/updademeet.dto';

@Controller('meet')
export class MeetController {
    constructor(
        private readonly meetService: MeetService
    ){}

    @Get()
    async getUser(@Request() req){
        const { userId } = req?.user;

        const result = await this.meetService.getMeetsByUse(userId);

        return result.map(m => ({
            id: m._id.toString(),
            name: m.name,
            color: m.color,
            link: m.link
        }) as unknown as GetMeetDto);
    }

    @Post()
    async createMeet(@Request() req, @Body() dto: CreateMeetDto){
        const { userId } = req?.user;
        await this.meetService.createMeet(userId, dto);
    }

    @Delete(':id')
    async deleteMeet(@Request() req, @Param() params){
        const { userId } = req?.user;
        const { id } = params;
        await this.meetService.deleteMeetByUser(userId, id);
    }

    @Get('object/:id')
    async getObjectsByMeetId(@Request() req, @Param() params){
        const { userId } = req?.user;
        const { id } = params;
        return await this.meetService.getMeetObjects(id, userId);
    }

    @Put(':id')
    async updateMeet(@Request() req, @Param() params, @Body() dto: UpdateMeetDto){
        const { userId } = req?.user;
        const { id } = params;
        await this.meetService.update(userId, userId, dto);
    }
}
