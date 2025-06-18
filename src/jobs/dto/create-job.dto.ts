import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}
export class CreateJobDto {
    @IsNotEmpty({ message: "Tên công việc không được để trống!" })
    name: string;

    @IsArray({ message: 'Skill phải là một mảng.' })
    @ArrayNotEmpty({ message: 'Skill không được để trống.' })
    @IsString({ each: true, message: 'Mỗi skill phải là một chuỗi.' })
    @IsNotEmpty({ each: true, message: 'Skill không được chứa giá trị rỗng.' })
    skills: string[];

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @IsNotEmpty({ message: "Lương không được để trống!" })
    @IsNumber()
    salary: number;

    @IsNotEmpty({ message: "Số lượng không được để trống!" })
    @IsNumber()
    quantity: number;

    @IsNotEmpty({ message: "Mức độ không được để trống!" })
    level: number;

    @IsNotEmpty({ message: "Mô tả không được để trống!" })
    description: number;

    @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống.' })
    @Type(() => Date)
    @IsDate({ message: 'Ngày bắt đầu không hợp lệ.' })
    startDate: Date;

    @IsNotEmpty({ message: 'Ngày kết thúc không được để trống.' })
    @Type(() => Date)
    @IsDate({ message: 'Ngày kết thúc không hợp lệ.' })
    endDate: Date;

    @IsNotEmpty({ message: 'Trạng thái không được để trống.' })
    @IsBoolean({ message: 'Trạng thái phải là kiểu boolean.' })
    isActive: boolean;
}
