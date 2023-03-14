import { IsEmail, IsNotEmpty } from 'class-validator';
import { MessagesHelper } from '../helpers/messages.helper';

export class LoginDto {
  @IsEmail({}, { message: MessagesHelper.AUTH_LOGIN_NOT_FOUD })
  login: string;

  @IsNotEmpty({ message: MessagesHelper.AUTH_PASSWORD_NOT_FOUD })
  password: string;
}
