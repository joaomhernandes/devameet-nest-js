import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Meet, MeetDocument } from 'src/meet/schemas/meet.schema';
import { MeetObject, MeetObjectDocument } from 'src/meet/schemas/meetobject.schema';
import { Position, PositionDocument } from './schemas/position.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { RoomMessagesHelper } from './helpers/roommessages.helper';
import { UpdateUserPositionDto } from './dtos/updateposition.dto';
import { ToglMuteDto } from './dtos/toglMute.dto';

@Injectable()
export class RoomService {
    private logger = new Logger(RoomService.name);

    constructor(
        @InjectModel(Meet.name) private readonly meetModel: Model<MeetDocument>,
        @InjectModel(MeetObject.name) private readonly objectModel: Model<MeetObjectDocument>,
        @InjectModel(Position.name) private readonly positionModel: Model<PositionDocument>,
        private readonly userService: UserService
    ){}

    async getRoom(link: string){
        this.logger.debug(`getRoom - ${link}`);

        const meet = await this._getMeet(link);
        const objects = await this.objectModel.find({meet});

            return{
                link,
                name: meet.name,
                color: meet.color,
                objects
            };
        
    }

    async listUsersPositionByLink(link: string){
        this.logger.debug(`listUsersPositionByLink - ${link}`);

        const meet = await this._getMeet(link);
        return await this.positionModel.find({meet});
    }

    async deleteUserPosition(clientID: string){
        this.logger.debug(`deleteUserPosition - ${clientID}`);
        return await this.positionModel.deleteMany({clientID});
    }

    async updateUserPosition(clientID: string, dto: UpdateUserPositionDto){
        this.logger.debug(`updateUserPosition - ${dto.link}`);

        const meet = await this._getMeet(dto.link);
        const user = await this.userService.getUserById(dto.userId);
        if(!user){
            throw new BadRequestException(RoomMessagesHelper.JOIN_USER_NOT_VALID);
        }

        const position ={
            ...dto,
            clientID,
            user,
            meet,
            name: user.name,
            avatar: user.avatar
        }

        const userInRoom = await this.positionModel.find({meet});
        

        const loogedUserInRoom = userInRoom.find(u =>
            u.user.toString() === user._id.toString() || u.clientId === clientID);

        if(loogedUserInRoom){
            await this.positionModel.findByIdAndUpdate({_id: loogedUserInRoom.id}, position);
        }else{
            if(userInRoom && userInRoom.length > 10){
                throw new BadRequestException(RoomMessagesHelper.ROOM_MAX_USERS);
            };

            await this.positionModel.create(position);
        }

    }

    async updateUserMute(dto:ToglMuteDto){
        this.logger.debug(`updateUserMute - ${dto.link} - ${dto.userId}`);

        const meet = await this._getMeet(dto.link);
        const user = await this.userService.getUserById(dto.userId);

        await this.positionModel.updateMany({user,meet}, {muted: dto.muted});
    }


    async _getMeet(link:string){
        const meet = await this.meetModel.findOne({link});
        if(!meet){
            throw new BadRequestException(RoomMessagesHelper.JOIN_Link_NOT_VALID);
            
        }

        return meet;
    }
    
}
