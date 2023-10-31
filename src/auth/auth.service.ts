import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { AuthResponse } from './types/auth-response.type';
import { SignupInput } from './dto/inputs/signup-input';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async signup(
    signupInput: SignupInput,
  ): Promise<AuthResponse> {  
    const user = await this.usersService.create({
      ...signupInput,
      password: bcrypt.hashSync(signupInput.password, 10),
    });
    const token = 'ABC1234';

    return { token, user };
  }
}
