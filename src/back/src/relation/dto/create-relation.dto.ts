import { IsNotEmpty } from 'class-validator';

export class CreateRelationDto {
  @IsNotEmpty()
  requesting: number;

  @IsNotEmpty()
  receiving: number;
}
