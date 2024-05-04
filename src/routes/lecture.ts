import httpStatus from "http-status";
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { RequestWithUser, authenticateJWT } from "../jwtAuth";

const lectureRoute = Router();
const prisma = new PrismaClient();

// Lecture作成
lectureRoute.post(
  "/common",
  authenticateJWT,
  async (req: RequestWithUser, res) => {
    if (req.user!.credLevel < 3) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send("科目を追加する権限がありません。");
    }
    try {
      await prisma.$transaction(async (prisma) => {
        // dataオブジェクトの基本構造
        const data = {
          class: {
            connect: { id: req.body.classId },
          },
          subject: {
            connect: { id: req.body.subjectId },
          },
          timetable: {
            connect: { id: req.body.timetableId },
          },
          room: {},
          teacher: {},
        };

        if (req.body.roomNumber) {
          data.room = {
            connect: { number: req.body.roomNumber },
          };

          await prisma.room.update({
            where: {
              number: req.body.roomNumber,
            },
            data: {
              commonLecture: {
                connect: { id: req.body.roomNumber },
              },
            },
          });
        }

        if (req.body.teacherId) {
          data.teacher = {
            connect: { id: req.body.teacherId },
          };
        }

        const newLecture = await prisma.commonLecture.create({
          data: data,
          include: {
            class: true,
            subject: true,
            room: true,
            timetable: true,
          },
        });

        return res.status(httpStatus.OK).json(newLecture);
      });
    } catch (err) {
      console.log(err);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send("内部エラーが発生しました。");
    }
  },
);

lectureRoute.post(
  "/extra",
  authenticateJWT,
  async (req: RequestWithUser, res) => {
    if (req.user!.credLevel < 3) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send("科目を追加する権限がありません。");
    }
    try {
      await prisma.$transaction(async (prisma) => {
        // dataオブジェクトの基本構造
        const data = {
          subject: {
            connect: { id: req.body.subjectId },
          },
          timetable: {
            connect: { id: req.body.timetableId },
          },
          room: {},
          teacher: {},
        };

        if (req.body.roomNumber) {
          data.room = {
            connect: { number: req.body.roomNumber },
          };

          await prisma.room.update({
            where: {
              number: req.body.roomNumber,
            },
            data: {
              extraLecture: {
                connect: { id: req.body.roomNumber },
              },
            },
          });
        }

        if (req.body.teacherId) {
          data.teacher = {
            connect: { id: req.body.teacherId },
          };
        }

        const newLecture = await prisma.extraLecture.create({
          data: data,
          include: {
            students: true,
            subject: true,
            room: true,
            timetable: true,
          },
        });

        return res.status(httpStatus.OK).json(newLecture);
      });
    } catch (err) {
      console.log(err);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send("内部エラーが発生しました。");
    }
  },
);

// Subject更新
lectureRoute.put("/:id", async (req, res) => {
  try {
    const subject = await prisma.subject.update({
      where: {
        id: req.params.id,
      },
      data: {},
    });
    return res.status(httpStatus.OK).json(subject);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

// Subject削除
lectureRoute.delete("/:id", async (req: RequestWithUser, res) => {
  try {
    if (req.user!.credLevel < 4) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send("科目を削除する権限がありません。");
    }
    const deletedSubject = await prisma.subject.delete({
      where: {
        id: req.params.id,
      },
    });
    return res.status(httpStatus.OK).json(deletedSubject);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

// 全てのSubject取得
lectureRoute.get("/", async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany();
    return res.status(httpStatus.OK).json(subjects);
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  }
});

export default lectureRoute;