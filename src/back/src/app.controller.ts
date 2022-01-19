import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Injectable,
  Redirect,
  Query,
} from '@nestjs/common';
import { json } from 'stream/consumers';
import { AppService } from './app.service';
import fetch from 'node-fetch';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  //@Redirect(", 301)
  async getCode(@Query('code') mycode: string): Promise<any> {
   // TDOO: aggiungere valori a .env
    const body: any = {
      "grant_type" : "authorization_code",
      "client_id" : "19a6005079dee78a5a9a931731c1ef2a77a4a7a3570c2c3a278a3752e0a1c4a4",
      "client_secret" : "2b9c515860b4da8707a15f7658094570c5095547816a182aa6c39c162ad0036d",
      "code": mycode,
      "redirect_uri" : "http://localhost:3000/api"
    };
    let response = await fetch('https://api.intra.42.fr/oauth/token', {
	  method: 'post',
	  body: JSON.stringify(body),
	  headers: {'Content-Type': 'application/json'}
    });
    let data = await response.json() as any;
    const token: string =  data.access_token;
    response = await fetch("https://api.intra.42.fr/v2/me", {
      headers: {'Authorization': 'Bearer '+ token}
    });
    data = await response.json() as any;
    return (data);
    // TODO recuperare dati da json
  }
}
