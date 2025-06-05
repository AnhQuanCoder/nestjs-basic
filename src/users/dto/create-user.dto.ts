import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: "Email không được để trống" })
    @IsEmail({}, { message: "Email không đúng định dạng" })
    email: string;

    @IsNotEmpty({ message: "Password không được để trống" })
    password: string;
    name: string;
    address: string;
}
