import { IsNotEmpty } from "class-validator";
import { RoomMessagesHelper } from "../helpers/roommessages.helper";

export class JoinRoomDto{

    @IsNotEmpty({message:RoomMessagesHelper.JOIN_USER_NOT_VALID})
    userId: string;

    @IsNotEmpty({message:RoomMessagesHelper.JOIN_Link_NOT_VALID})
    link: string;
}