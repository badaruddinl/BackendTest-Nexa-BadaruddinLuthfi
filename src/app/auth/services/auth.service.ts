import { StatusCodes } from "http-status-codes";
import { AppDataSource } from "models/config/database";
import { Admin, AdminToken } from "models/config/schemas";
import * as crypto from "crypto";
import { decodeExpAsDate, generateJWT } from "services/jwt";
import { MoreThan } from "typeorm";

export class AuthService {
  private readonly admin = AppDataSource.getRepository(Admin);
  private readonly adminToken = AppDataSource.getRepository(AdminToken);

  constructor() {}

  public async register(body: { username: string; password: string }) {
    const user = await this.admin.findOneBy({ username: body.username });

    if (user) {
      return {
        statusCodes: StatusCodes.UNAUTHORIZED,
        success: false,
        code: "01",
        message: "username already exist!",
      };
    }

    if (!body.username) {
      return {
        statusCodes: StatusCodes.BAD_REQUEST,
        success: false,
        code: "01",
        message: "username is required",
      };
    }

    if (!body.password) {
      return {
        statusCodes: StatusCodes.BAD_REQUEST,
        success: false,
        code: "01",
        message: "password is required",
      };
    }

    const hash = crypto.createHash("sha256").update(body.password).digest();

    const newUser = await this.admin.create({
      username: body.username,
      password: hash,
    });

    const result = await this.admin.save(newUser);

    return {
      statusCodes: StatusCodes.CREATED,
      success: false,
      code: "00",
      message: "create admin successfully",
      data: result,
    };
  }

  public async login(body: { username: string; password: string }) {
    const user = await this.admin.findOneBy({ username: body.username });

    if (!user) {
      return {
        statusCodes: StatusCodes.UNAUTHORIZED,
        success: false,
        code: "01",
        message: "check username and password",
      };
    }

    if (!body.username) {
      return {
        statusCodes: StatusCodes.BAD_REQUEST,
        success: false,
        code: "01",
        message: "username is required",
      };
    }

    if (!body.password) {
      return {
        statusCodes: StatusCodes.BAD_REQUEST,
        success: false,
        code: "01",
        message: "password is required",
      };
    }

    const hashToCompare = crypto
      .createHash("sha256")
      .update(body.password)
      .digest();

    const isMatch = user.password.equals(hashToCompare);

    if (!isMatch) {
      return {
        statusCodes: StatusCodes.UNAUTHORIZED,
        success: false,
        code: "01",
        message: "check username and password",
      };
    }

    const getUser = await this.admin.findOneBy({
      username: body.username,
      password: hashToCompare,
    });
    let resultToken: string;
    const checkToken = await this.adminToken.findOneBy({
      id_admin: getUser.id,
      expired_at: MoreThan(new Date()),
    });

    if (checkToken) {
      resultToken = checkToken.token;
    } else {
      const token = await generateJWT({
        id: getUser.id,
        username: getUser.username,
      });

      const expiredAt = decodeExpAsDate(token);
      const saveToken = this.adminToken.create({
        id_admin: getUser.id,
        token,
        expired_at: expiredAt,
      });
      await this.adminToken.save(saveToken);

      resultToken = token;
    }

    return {
      statusCodes: StatusCodes.OK,
      success: true,
      code: "00",
      message: "login successfully",
      data: { access_token: resultToken },
    };
  }

  public async checkID(id: number) {
    const user = await this.admin.findOneBy({ id });

    if (!user) {
      return {
        statusCodes: StatusCodes.NOT_FOUND,
        success: true,
        code: "00",
        message: "Doesn't have user",
      };
    }

    return {
      statusCodes: StatusCodes.OK,
      success: true,
      code: "00",
      message: "Data user founded!",
    };
  }
}
