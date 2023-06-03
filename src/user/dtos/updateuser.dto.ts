import { IsString, MinDate, MinLength } from "class-validator";
import { UserController } from "../user.controller";
import { UserMessagesHelper } from "../helpers/messages.helper";


export class UpdateUserDto {
    @MinLength(2, {message: UserMessagesHelper.REGISTER_NAME_NOT_VALID})
    name : string;

    @IsString()
    avatar: string;

}