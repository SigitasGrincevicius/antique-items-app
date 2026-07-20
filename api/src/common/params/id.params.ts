import { IsNotEmpty, IsUUID } from "class-validator";

export class FindOneParams {
   @IsNotEmpty()
   @IsUUID()
   id!: string;
}