import cors from "cors";
import express from "express";
import routes from "./routes/index.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, () => {
    console.log(`RH LSD API running at http://localhost:${port}`);
});
