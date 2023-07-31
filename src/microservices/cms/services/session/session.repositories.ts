import { Request, Response, NextFunction } from "express";
import Session from "./session.model";
import Pagination from "@/utils/Pagination";
const ErrorResponse = require("@/middleware/Error/error.response");
import { Op } from "sequelize";

class SessionRepository {
  constructor() {}

  public async find(req: Request, res: Response, next: NextFunction) {
    const pagination = new Pagination(req, res, next);
    const { offset, limit } = pagination.get_attributes();
    console.log(req.query);
    pagination.arrange_and_send(
      await Session.findAndCountAll({
        where: {},
        offset,
        limit,
      })
    );
  }

  public async findById(req: Request, res: Response, next: NextFunction) {
    try {
      var session = await Session.findByPk(req.params.id, {
        attributes: {
          exclude: ["password"],
        },
      });
      if (!session) return next(new ErrorResponse("No session found!", 404));

      res.status(200).json({
        success: true,
        //message: "Information fetched successfully",
        data: session,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default SessionRepository;
