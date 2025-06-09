import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}

export class CreateUserDto {
    // Create User phía admin
    @IsNotEmpty({ message: "Họ tên không được để trống" })
    name: string;

    @IsNotEmpty({ message: "Email không được để trống" })
    @IsEmail({}, { message: "Email không đúng định dạng" })
    email: string;

    @IsNotEmpty({ message: "Password không được để trống" })
    password: string;

    @IsNotEmpty({ message: "Tuổi không được để trống" })
    age: string;

    @IsNotEmpty({ message: "Giới tính không được để trống" })
    gender: string;

    @IsNotEmpty({ message: "Địa chỉ không được để trống" })
    address: string;

    @IsNotEmpty({ message: "Quyền không được để trống" })
    role: string;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
}
export class RegisterUserDto {
    // Create User phía client

    @IsNotEmpty({ message: "Họ tên không được để trống" })
    name: string;

    @IsNotEmpty({ message: "Email không được để trống" })
    @IsEmail({}, { message: "Email không đúng định dạng" })
    email: string;

    @IsNotEmpty({ message: "Password không được để trống" })
    password: string;

    @IsNotEmpty({ message: "Tuổi không được để trống" })
    age: string;

    @IsNotEmpty({ message: "Giới tính không được để trống" })
    gender: string;

    @IsNotEmpty({ message: "Địa chỉ không được để trống" })
    address: string;
}
