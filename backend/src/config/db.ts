import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

const dbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection created');
        await sequelize.sync();
        console.log('db sync successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};


export { dbConnection, sequelize };