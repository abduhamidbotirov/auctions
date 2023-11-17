// import "../db/mongo.js";
// import "../db/localMongo.js";
// import "../db/globalMongo.js";
// .env faylidan o'qib oladi
import "../db/localSequelize.js";
import "../models/associations/index.js"
import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import indexRouter from "../models/index.routes.js";
import errorMiddleware from "../middleware/errorHandler.js";
import fileUpload from "express-fileupload";
const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;
app.use(cors());

app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${process.cwd()}/src/public`));
app.use("/api", indexRouter);
// Ilovdagi boshqa faylda, masalan, app.js yoki server.js
// import { User, Post } from '../models/index.js'; // models papkasidagi index.js faylidan import qilamiz

// // Foydalanuvchini yaratish
// User.create({
//   username: 'testuser',
//   email: 'test@example.com',
// }).then((user:any) => {
//   // Yangi foydalanuvchi yaratildi
//   // Endi uni bog'langan postlar bilan boshqa amallar bajarishingiz mumkin
// });

// // Post yaratish va bog'langan foydalanuvchini aniqlash
// Post.create({
//   title: 'Yangi post',
//   content: 'Bu post yangi',
//   userId: 1, // Foydalanuvchi ID sifati
// }).then((post :any)=> {
//   // Yangi post yaratildi
//   // Endi uni tegishli foydalanuvchini aniqlash uchun "User" modelini ishlatishingiz mumkin
//   post.getUser().then((user:any) => {
//     // Foydalanuvchi aniqlandi
//   });
// });


// const CarModel = sequelize.define('car', {
//   model: {
//     type: DataTypes.STRING(30),
//     unique: true,
//   },
//   color: {
//     type: DataTypes.STRING(12),
//     defaultValue: 'white'
//   },
//   year: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   }
// },
//   {
//     timestamps: false,
// }
// );

// class CarModel extends Model { };
// CarModel.init(
//   {
//     model: {
//       type: DataTypes.STRING(30),
//       unique: true,
//     },
//     color: {
//       type: DataTypes.STRING(12),
//       defaultValue: 'white'
//     },
//     year: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     }
//   },
//   {
//     sequelize,
//     timestamps: false,
//   }
// )

// CarModel.sync();


app.get("/api", async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: "Welcome to the Jop API.",
      postmen: "https://documenter.getpostman.com/view/24139682/2s93si1pwE",
    });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
