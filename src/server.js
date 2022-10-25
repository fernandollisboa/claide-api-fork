import "./setup.js";
import app from "./app.js";

const port = process.env.PORT || 4000;
const env = process.env.NODE_ENV || "DEV";

app.listen(port, () => {
  console.log(`clAIDe running on http://localhost:${port}`);
  console.log(`Enviroment: ${env}`);
});
