import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  userid!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
