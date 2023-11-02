import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { AuthResponse } from './types/auth-response.type';
import { SignupInput } from './dto/inputs/signup-input';
import { UsersService } from '../users/users.service';
import { SigninInput } from './dto/inputs/signin-input';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwt(userId: string) {
    return this.jwtService.sign({ userId });
  }

  async signup(
    signupInput: SignupInput,
  ): Promise<AuthResponse> {
    const user =
      await this.usersService.create(signupInput);

    const token = this.getJwt(user.id);

    return { token, user };
  }

  async signin(
    signinInput: SigninInput,
  ): Promise<AuthResponse> {
    const { email, password } = signinInput;
    const user =
      await this.usersService.findOneByEmail(email);

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException(
        'Email / password do not match',
      );
    }

    const token = this.getJwt(user.id);

    return { token, user };
  }
}
