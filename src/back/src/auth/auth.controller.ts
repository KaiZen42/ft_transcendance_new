import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Param, 
  Req,
  Res, UseGuards,
  UseInterceptors,
  Query,
  ValidationPipe,
  Redirect,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginUsreDto } from 'src/user/dto/login-user.dto';
import { Request, Response } from 'express';
import { User } from '../user/models/user.entity';
import { AuthGuard } from "./auth.guard";
import { JwtService } from '@nestjs/jwt';
import fetch from 'node-fetch';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { UpdateUser } from 'src/user/dto/update-user.dto';
// import {JwtAuthGuard} from './auth/jwt-auth.guard';
// import RequestWithUser from '../requestWithUser.interface';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
	constructor(private readonly user: UserService,
		private readonly jwt: JwtService,
    private readonly twoFaAuthService: TwoFactorAuthenticationService,
    private readonly userService: UserService) { }

  @Post('generate')
  @UseInterceptors(ClassSerializerInterceptor)
  // @UseGuards(JwtAuthGuard)
  async check(@Body()data: CreateUserDto, @Res() response: Response, @Req() request) {
    
    const { otpauthUrl } = await this.twoFaAuthService.generatetwoFaAuthSecret(data);
 
    return this.twoFaAuthService.pipeQrCodeStream(response, otpauthUrl);
  }

  @Post('turn2fa')
  @HttpCode(200)
  // @UseGuards(JwtAuthenticationGuard)
  async turnOnTwoFactorAuthentication(
    @Req() request: Request,
    @Body() data: UpdateUser
  ) {
    const cookie = request.cookies['token'];
    const user = await this.user.userCookie(cookie);
    const isCodeValid = this.twoFaAuthService.checkTwoFaAuthCode(
      data.twoFaAuthCode, user
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.userService.turnOnTwoFaAuth(user.id);
  }

  @Post('auth2fa')
  @HttpCode(200)
  async auth2fa(
    @Req() request: Request,
    @Body() data: UpdateUser
  ) {
    const cookie = request.cookies['token'];
    const user = await this.user.userCookie(cookie);
    const isCodeValid = this.twoFaAuthService.checkTwoFaAuthCode(
      data.twoFaAuthCode, user
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
 
    const accessTokenCookie = this.twoFaAuthService.getCookieWithJwtAccessToken(user.id, true);
 
    request.res.setHeader('2fa', [accessTokenCookie]);
 
    return user;
  }

  @Get('login')
  async login(
    @Query('code') code: string ,
    @Query('state') path: string ,
    @Res({ passthrough: true }) response: Response,
    ): Promise<any> {
    // if (typeof code === 'undefined')
    // {
    //   const url: string = "https://api.intra.42.fr/oauth/authorize?client_id=" + process.env.CLIENT_ID +"&redirect_uri="+ process.env.REDIRECT_URI +"&response_type=code";
    //   return response.redirect(url);
    // }
    console.log(code, path)
    await this.user.login(code, response);
    return response.redirect(`http://${process.env.BASE_IP}:8080${path}`);
  }

  
  /*@Get('login/return')
  //@UseGuards(AuthGuard)
  async */


  //@UseGuards(AuthGuard)
  @Get('user')
  async userCookie(@Req() request: Request) {
    const cookie = request.cookies['token'];
    console.log("cookie is: " + cookie);
    if (typeof cookie === 'undefined')
      return {id: null};
      //return "ritorno cookie errore";
    const user = await this.user.userCookie(cookie);
    console.log("user="+user.username);
    return (user);
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    return {
      message: 'Success',
    };
  }
}
