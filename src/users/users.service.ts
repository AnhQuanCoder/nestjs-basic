import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose from 'mongoose';
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/auth/users.interface';
import { use } from 'passport';
import aqp from 'api-query-params';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash
  }

  async isExist(email: string) {
    const isExistEmail = await this.userModel.findOne({ email });
    return isExistEmail;
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { name, email, password, age, gender, address, role, company } = createUserDto;
    const isExistEmail = await this.isExist(email);

    if (isExistEmail) {
      throw new BadRequestException(`Email ${email} đã tồn tại trong hệ thống`);
    }

    const hashPassword = this.getHashPassword(password);
    let newUser = await this.userModel.create({
      email, name,
      password: hashPassword,
      age, gender, address, role, company,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

    return newUser;
  }

  async findAll(currentPage: number, limit: number, queryString: string) {
    const { filter, sort, projection, population } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "Not found user";
    }

    const user = this.userModel.findOne({ _id: id }).select("-password");
    return user;
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    })
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "Not found user";
    }

    const { email } = updateUserDto;
    const isExistEmail = await this.isExist(email);

    if (isExistEmail) {
      throw new BadRequestException(`Email ${email} đã tồn tại trong hệ thống`)
    }

    let updateUser = await this.userModel.updateOne({
      _id: id
    }, {
      ...updateUserDto,
      updateBy: {
        _id: user._id,
        name: user.name,
      }
    })

    return updateUser;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "Not found user";
    }
    await this.userModel.updateOne(
      {
        _id: id
      },
      {
        deletedBy: {
          _id: user._id,
          name: user.name
        }
      })

    const record = await this.userModel.softDelete({ _id: id })

    return record;
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;

    const isExistEmail = await this.isExist(email);

    if (isExistEmail) {
      throw new BadRequestException(`Email ${email} đã tồn tại trong hệ thống`)
    }

    const hashPassword = this.getHashPassword(password);
    let newRegister = await this.userModel.create({
      name, email, password: hashPassword, age, gender, address, role: "USER"
    })
    return newRegister;
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({
      _id: _id
    }, {
      refreshToken
    })
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken }).select("-password");
  }
}
