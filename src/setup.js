import dotenv from "dotenv";

let envFile;

if (process.env.NODE_ENV === "prof") envFile = ".env.prod";
else if (process.env.NODE_ENV === "test") envFile = ".env.test";
else if (process.env.NODE_ENV === "dev") envFile = ".env.dev";
else envFile = ".env";

console.log(`Using ${envFile} file to supply environment variables`);

dotenv.config({ path: envFile });
