import "./setup.js";
import app from "./app.js";
import * as https from "https"
import * as fs from "fs";

const port = process.env.PORT || 4000;
const env = process.env.NODE_ENV || "DEV";
const tls = process.env.TLS_ENABLE || false;
const key_path = process.env.KEY_PATH;
const cert_path = process.env.CERT_PATH;

if (tls) {
  var privateKey  = fs.readFileSync(key_path, 'utf8');
  var certificate = fs.readFileSync(cert_path, 'utf8');
  var credentials = {key: privateKey, cert: certificate};

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(port, () => {
    console.log(`clAIDe running on https://localhost:${port}`);
    console.log(`Enviroment: ${env}`);
  });
} else {
  app.listen(port, () => {
    console.log(`clAIDe running on http://localhost:${port}`);
    console.log(`Enviroment: ${env}`);
  });
}