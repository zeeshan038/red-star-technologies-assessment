import { Sequelize } from "sequelize";

const sequelize = new Sequelize('redstartech', 'postgres', '123623', {
    host: 'localhost',
    dialect: 'postgres'
});

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