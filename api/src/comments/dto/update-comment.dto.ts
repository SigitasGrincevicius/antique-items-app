import { IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsUUID()
  @MaxLength(2000)
  content!: string;
}
