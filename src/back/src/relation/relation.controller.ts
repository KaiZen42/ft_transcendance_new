import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateRelationDto } from './dto/create-relation.dto';
import { RelationService } from './relation.service';

@Controller('relations')
export class RelationController {
  constructor(private readonly relation: RelationService) {}

  @Post('friendRequest')
  async create(@Body() createRelationData: CreateRelationDto) {
    this.relation.create(createRelationData);
  }

  @Get('getRequests/:id')
  async getRequests(@Param('id') id: number) {
    return await this.relation.findRequests(id);
  }

  @Get('getFriends/:id')
  async getFriends(@Param('id') id: number) {
    return await this.relation.getFriends(id);
  }

  @Get('getFriendStatus/:id')
  async getFriendStatus(
    @Param('id') id: number,
    @Query('other') other: number,
  ) {
    const res = await this.relation.getFriendStatus(id, other);
    if (!res) return { status: null };
    return res;
  }

  @Put('acceptRequest')
  async acceptRequest(@Body() data: { id: number }) {
    await this.relation.acceptRequest(data.id);
  }

  @Delete('unfriend')
  async unfriend(@Body() data: { id: number }) {
    await this.relation.unfriend(data.id);
  }
}
