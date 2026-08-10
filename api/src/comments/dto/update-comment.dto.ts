import { IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @MaxLength(2000)
  content!: string;
}
