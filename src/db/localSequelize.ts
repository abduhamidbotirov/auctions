import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
export const sequelize = new Sequelize({
  define: {
    freezeTableName: true,
  },
  database: process.env.PG_DATABASE as string,
  username: process.env.PG_USER as string,
  password: process.env.PG_PASSWORD as string,
  host: process.env.PG_HOST as string,  // Masalan: 'localhost' yoki boshqa manzil
  port: Number(process.env.PG_PORT),  // PostgreSQL port (default: 5432)
  dialect: 'postgres',  // PostgreSQL ma'lumotlar bazasi,
  logging: false
});
// sequelize.sync({ force: true, });
// import { associateModels } from "../models/Test/Associate/associate.js";
// associateModels(sequelize) 
(async () => {
  try {
    // Ma'lumotlar bazasiga ulanamiz
    await sequelize.authenticate();
    // await sequelize.sync({force: true});  
    // for (let model in sequelize.models) {
    //   await sequelize.models[model].sync({ alter: true })
    // }
    // sequelize.sync({ force: true }); 
    // await sequelize.models.Auction.sync({ alter: true });
    // await sequelize.models.Bid.sync({ alter: true });
    // await sequelize.sync({alter: true,});
    // await sequelize.sync({force: true,}); 
    console.log('Ma\'lumotlar bazasiga muvaffaqiyatli ulandik');
    // Modelni sinxronizatsiya qilamiz
  } catch (error) {
    console.error('Ma\'lumotlar bazasiga ulanishda xatolik:', error);
  }
})();