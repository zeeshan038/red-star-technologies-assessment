import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { dbConnection } from "./config/db.js";
import router from './routes/index.js';
const app = express();
app.use(cors());
app.use(express.json());
// Call database connection
dbConnection();
const PORT = process.env.PORT || 3000;
//Routes
app.use("/api", router);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
