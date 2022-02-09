import {  IsNotEmpty } from "class-validator";

export class inviteDto {

	@IsNotEmpty()
	idUser: number;
	@IsNotEmpty()
	room : string;
}
