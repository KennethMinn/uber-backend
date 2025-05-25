import { Expose } from 'class-transformer';

export class GetUserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
