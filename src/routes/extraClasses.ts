import { Request, Response, Router } from "express";
import httpStatus from "http-status";
import { RequestWithUser, authenticateJWT } from "../jwtAuth";

import extraClass from "../models/ExtraClass";
import User from "../models/User";


const extraClassRoute = Router()

//クラス
extraClassRoute.post(
  "/",
  authenticateJWT,
  async (req: RequestWithUser , res) => {
    const newExtraClass = new extraClass(req.body);
    try {
      const savedExtraClass = await newExtraClass.save();
      res.status(httpStatus.OK).json(savedExtraClass);
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
});

extraClassRoute.put("/:id",
  authenticateJWT, 
  async (req: RequestWithUser, res) => {
  try {
    if (!req.user){
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send("アカウントが認証されていません。");
    }
    const currentClass = await extraClass.findById(req.params.id);
    if (currentClass!.createdUser! === req.user.id) {
      await extraClass!.updateOne({
        $set: req.body,
      });
      return res.status(httpStatus.OK).json("クラスが更新されました");
    } else {
      return res.status(httpStatus.FORBIDDEN).json("クラスを更新できません");
    }
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

extraClassRoute.delete(
  "/:id",
  authenticateJWT,
  async ( req: RequestWithUser , res ) => {
  try {
    const post = await extraClass.findById(req.params.id);
    const user = await User.findById(req.body.userId);
    if (user!.isAdmin || user!.credLevel > 5) {
      await post!.deleteOne();
      return res.status(httpStatus.OK).json("クラスが削除されました");
    } else {
      return res.status(httpStatus.FORBIDDEN).json("クラスを削除できません");
    }
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

//特定のクラスの取得
extraClassRoute.get("/:id", async (req, res) => {
  try {
    const extraClasses = await extraClass.findById(req.params.id)
      .populate([
        {
          path: "studentsId",
          model: "User",
        },
      ])
      .populate([
        {
          path: "timetableId",
          model: "Timetable",
        },
      ]);
    return res.status(httpStatus.OK).json(extraClasses);
  } catch (err) {
    return res.status(httpStatus.FORBIDDEN).json(err);
  }
});

// クラスをすべて取得
extraClassRoute.get("/", async (req: Request, res: Response) => {
  try {
    const extraClasses = await extraClass.find();
    return res.status(httpStatus.OK).json(extraClasses);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

export default extraClassRoute;
