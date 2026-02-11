import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "src/common/enums/userRole.enum";

export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    password:string;

    @IsString()
    @IsNotEmpty()
    name:string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    @ApiProperty({ example: 'user'})
    role:UserRole;

    @IsString()
    @IsNotEmpty()
    lastName:string;

    @IsString()
    @IsNotEmpty()
    cellphone:string;
}
