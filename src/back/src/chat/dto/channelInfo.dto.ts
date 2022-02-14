import {  IsNotEmpty } from "class-validator";

export class ChannelInfo
{
	@IsNotEmpty()
	id: number;
	@IsNotEmpty()
	name: string;
	@IsNotEmpty()
	isPrivate: boolean;
}