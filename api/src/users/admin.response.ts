import { Expose } from 'class-transformer';

export class AdminResponse {
  @Expose()
  message!: string;
}
