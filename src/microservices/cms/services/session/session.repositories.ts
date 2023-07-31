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

    pagination.arrange_and_send(
      await Session.findAndCountAll({
        where: {
          [Op.or]: [
            {
              ip_address: {
                [Op.like]: `%${pagination.search_string}%`,
              },
            },
            {
              address_details: {
                [Op.like]: `%${pagination.search_string}%`,
              },
            },
            {
              device_details: {
                [Op.like]: `%${pagination.search_string}%`,
              },
            },
            {
              user_agent: {
                [Op.like]: `%${pagination.search_string}%`,
              },
            },
          ],
        },

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

  /* public async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id)
        return next(new ErrorResponse("Invalid Request!", 400));
      const {
        first_name,
        last_name,
        username,
        gender,
        display_picture,
        email,
        default_address,
      } = req.body;

      var user = await User.findByPk(req.params.id, {});

      if (!user) return next(new ErrorResponse("No user found!", 404));

      await user.update({
        first_name,
        last_name,
        username,
        gender,
        display_picture,
        email,
        default_address,
      });

      res.status(204).json({
        success: true,
        message: "Information updated successfully",
      });
    } catch (error) {
      next(error);
    }
  } */
}

export default SessionRepository;