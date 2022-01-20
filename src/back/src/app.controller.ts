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

  @Get()
  getHello() : string {
    return ( "ciao");
  }
}
