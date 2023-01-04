import dotenv from "dotenv";

let envFile;

if (process.env.NODE_ENV === "PROD") {
  envFile = ".env.prod";
} else if (process.env.NODE_ENV === "TEST") {
  envFile = ".env.test";
} else if (process.env.NODE_ENV === "DEV") {
  envFile = ".env.dev";
} else {
  envFile = ".env";
}

dotenv.config({ path: envFile });
