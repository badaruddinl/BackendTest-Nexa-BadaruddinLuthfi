import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "models/config/database";
import { Admin, AdminToken, Karyawan } from "models/config/schemas";
import * as crypto from "crypto";
import { decodeExpAsDate, generateJWT } from "services/jwt";
import { MoreThan } from "typeorm";
import fs from "fs";
import { getBase64FromUrl } from "utils/getBase64FromUrl.utils";
import { isValidUrl } from "utils/validUrl.utils";
import { CreateEmployeeInterface } from "../interfaces";
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
      success: false,
      code: "00",
      message: "create employee successfully",
      data: result,
    };
  }
}
