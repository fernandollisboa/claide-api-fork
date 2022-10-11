import express, { json } from "express";
import routes from "./routes/index.js";
const app = express();

const port = 4000; 

app.use(json());

app.use(routes);

app.listen(port, () => {
    console.log(`RH LSD API running at http://localhost:${port}`);
});