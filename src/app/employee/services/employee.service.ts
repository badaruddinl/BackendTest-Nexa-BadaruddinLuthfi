import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "models/config/database";
import { Admin, AdminToken, Karyawan } from "models/config/schemas";
import * as crypto from "crypto";
import { decodeExpAsDate, generateJWT } from "services/jwt";
import { DeepPartial, MoreThan } from "typeorm";
import fs from "fs";
import { getBase64FromUrl } from "utils/getBase64FromUrl.utils";
import { isValidUrl } from "utils/validUrl.utils";
import {
  CreateEmployeeInterface,
  QueryOptionInterface,
  UpdateEmployeeInterface,
} from "../interfaces";
import { BASE_API } from "config";

export class EmployeeService {
  private readonly employee = AppDataSource.getRepository(Karyawan);

  constructor() {}

  public async ceateEmployee(body: CreateEmployeeInterface) {
    const allowedGend = ["L", "P"] as const;
    if (!allowedGend.includes(body.gend)) {
      return {
        statusCodes: StatusCodes.BAD_REQUEST,
        success: false,
        code: "01",
        message: `gend must be L or P`,
      };
    }

    const year = new Date().getFullYear().toString();

    const maxNip = await this.employee
      .createQueryBuilder("e")
      .select("e.nip")
      .where("e.nip LIKE :year", { year: `${year}%` })
      .orderBy("e.nip", "DESC")
      .getRawOne();

    let numberNip = 1;

    if (maxNip && maxNip.e_nip) {
      numberNip = parseInt(maxNip.e_nip.replace(year, ""), 10) + 1;
    }

    const paddedNumber = numberNip.toString().padStart(4, "0");

    const nipCreate = `${year}${paddedNumber}`;

    let photoBase64;

    if (isValidUrl(body.photo)) {
      photoBase64 = await getBase64FromUrl(body.photo); // ubah URL → base64 string
      if (photoBase64.statusCodes === StatusCodes.BAD_REQUEST) {
        return {
          statusCodes: photoBase64.statusCodes,
          success: photoBase64.success,
          code: photoBase64.code,
          message: photoBase64.message,
        };
      }
    } else {
      return {
        statusCodes: StatusCodes.BAD_REQUEST,
        success: false,
        code: "00",
        message: "Invalid photo URL",
      };
    }

    const createEmployee = {
      ...body,
      nip: nipCreate,
      photo: `data:${photoBase64.data.mimeType};base64,${photoBase64.data.photo}`,
    } as Partial<Karyawan>;

    const dataEmployee = this.employee.create(createEmployee);
    const result = await this.employee.save(dataEmployee);

    return {
      statusCodes: StatusCodes.CREATED,
      success: true,
      code: "00",
      message: "create employee successfully",
      data: result,
    };
  }

  public async getEmployee(options: QueryOptionInterface) {
    let { page, limit, offset, search, params } = options;

    if (page <= 0) {
      page = 1;
    }

    const query = this.employee
      .createQueryBuilder("e")
      .select([
        "e.nip AS nip",
        "e.id AS id",
        "e.nama AS nama",
        "e.alamat AS alamat",
        "e.gend AS gender",
        "e.photo AS photo",
        "e.tgl_lahir AS tgl_lahir",
        "e.status AS status",
        "e.insert_at AS insert_at",
        "e.insert_by AS insert_by",
        "e.update_at AS update_at",
        "e.update_by AS update_by",
      ])
      .orderBy("e.insert_at", "DESC");

    if (params && search) {
      query.andWhere(`e.${params} LIKE :search`, { search: `%${search}%` });
    }

    const totalFiltered = await query.getCount();

    const totalPages = Math.ceil(totalFiltered / limit) || 1;

    if (page > totalPages) {
      return {
        statusCodes: StatusCodes.BAD_REQUEST,
        success: false,
        code: "01",
        message: "Page cannot reach!",
      };
    }

    const calculatedOffset = offset || (page - 1) * limit;
    const pageData = await query
      .take(limit)
      .skip(calculatedOffset)
      .getRawMany();

    return {
      statusCodes: StatusCodes.OK,
      success: pageData.length > 0,
      code: "00",
      message: pageData.length > 0 ? "Data found!" : "Data not found!",
      data: {
        meta: {
          page,
          limit,
          totalFiltered,
          totalPages,
        },
        data: pageData,
      },
    };
  }

  public async updateEmployee(
    nip: string,
    body: UpdateEmployeeInterface,
    update_by: string
  ) {
    const employee = await this.employee.findOneBy({ nip });

    if (!employee) {
      return {
        statusCodes: StatusCodes.NOT_FOUND,
        success: false,
        code: "01",
        message: "Employee not found!",
      };
    }

    const updateData = this.employee.merge(employee, {
      ...body,
      update_by,
    } as DeepPartial<Karyawan>);
    const saveData = await this.employee.save(updateData);

    return {
      statusCodes: StatusCodes.OK,
      success: true,
      code: "00",
      message: "Employee updated successfully!",
      data: saveData,
    };
  }

  public async updateStatusEmployee(nip: string, update_by: string) {
    const employee = await this.employee.findOneBy({ nip });

    if (!employee)
      return {
        statusCodes: StatusCodes.NOT_FOUND,
        code: "01",
        message: "Employee not found!",
      };

    let newStatus;
    let status;

    if (employee.status === 1) {
      newStatus = "Inactive";
      status = 9;
    } else {
      newStatus = "Active";
      status = 1;
    }

    await this.employee.update(
      { nip },
      { status: employee.status === 1 ? 9 : 1, update_by }
    );

    return {
      statusCodes: StatusCodes.OK,
      success: true,
      code: "00",
      message: "update status successfully",
      data: {
        newStatus,
        employee: { ...employee, status },
      },
    };
  }
}
