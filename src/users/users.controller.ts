import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/auth/users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ResponseMessage("Create a new user")
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    let newUser = await this.usersService.create(createUserDto, user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt
    }
  }

  @Get()
  @ResponseMessage("Fetch users with paginate")
  async findAll(
    @Query("page") currentPage: string,
    @Query("limit") limit: string,
    @Query() queryString
  ) {
    const records = await this.usersService.findAll(+currentPage, +limit, queryString);
    return records;
  }

  @Get(':id')
  @ResponseMessage("Fetch user by ID")
  @Public()
  async findOne(@Param('id') id: string) {
    const record = await this.usersService.findOne(id);
    return record;
  }

  @Patch(':id')
  @ResponseMessage("Update a user")
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    let updateUser = await this.usersService.update(id, updateUserDto, user);
    return updateUser;
  }

  @Delete(':id')
  @ResponseMessage("Delete a user")
  async remove(@Param('id') id: string, @User() user: IUser) {
    const deleteUser = await this.usersService.remove(id, user);
    return deleteUser;
  }
}