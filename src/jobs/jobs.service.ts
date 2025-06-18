import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/auth/users.interface';
import { Job, JobDocument } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class JobsService {

  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>
  ) { }

  isExistJob = async (id: string) => {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`ID không hợp lệ: ${id}`);
    }

    const result = await this.jobModel.findOne({ _id: id });
    return result;
  }

  async create(createJobDto: CreateJobDto, user: IUser) {
    const record = await this.jobModel.create({
      ...createJobDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: record?._id,
      createdAt: record.createdAt
    };
  }

  findAll() {
    return `This action returns all jobs`;
  }

  findOne(id: string) {
    return `This action returns a #${id} job`;
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    const isExist = await this.isExistJob(id);
    if (!isExist) {
      throw new BadRequestException(`Không tồn tại job có id: ${id} trong hệ thống!`);
    }

    const record = await this.jobModel.updateOne({
      _id: id
    }, {
      ...updateJobDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return record;
  }

  remove(id: string) {
    return `This action removes a #${id} job`;
  }
}
