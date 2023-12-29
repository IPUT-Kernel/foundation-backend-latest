import httpStatus from "http-status";
import Class from "../models/Class";
import User from "../models/User";
import { Request, Response, Router } from "express";

const classRoute = Router()

//クラス
classRoute.post("/", async (req, res) => {
  const newClass = new Class(req.body);
  try {
    const savedClass = await newClass.save();
    res.status(httpStatus.OK).json(savedClass);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

classRoute.put("/:id", async (req, res) => {
  try {
    const post = await Class.findById(req.params.id);
    if (post!.userId! === req.body.userId) {
      await post!.updateOne({
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

classRoute.delete("/:id", async (req, res) => {
  try {
    const post = await Class.findById(req.params.id);
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
classRoute.get("/:id", async (req, res) => {
  try {
    const classes = await Class.findById(req.params.id)
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
    return res.status(httpStatus.OK).json(classes);
  } catch (err) {
    return res.status(httpStatus.FORBIDDEN).json(err);
  }
});

// クラスをすべて取得
classRoute.get("/", async (req: Request, res: Response) => {
  try {
    const classes = await Class.find();
    return res.status(httpStatus.OK).json(classes);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

export default classRoute;