import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RegisterDto } from 'src/user/dtos/register.dto';
import { UserMessagesHelper } from 'src/user/helpers/messages.helper';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dtos/login.dto';
import { MessagesHelper } from './helpers/messages.helper';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(private readonly userServiçe: UserService) {}

  login(dto: LoginDto) {
    this.logger.debug('Login - started');
    if (dto.login !== 'teste@teste.com' || dto.password !== 'teste@123') {
      throw new BadRequestException(
        MessagesHelper.AUTH_PASSWORD_OR_EMAIL_NOT_FOUND,
      );
    }

    return dto;
  }

  async register(dto: RegisterDto) {
    this.logger.debug('Register - started');
    if (await this.userServiçe.existsByEmail(dto.email)) {
      throw new BadRequestException(UserMessagesHelper.REGISTER_EMAIL_FOUND);
    }
    await this.userServiçe.create(dto);
  }
}
