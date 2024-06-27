import * as dotenv from "dotenv";

const mustExist = <T>(value: T | undefined, name: string): T => {
    if (!value) {
        console.error(`Missing Config: ${name} !!!`);
        process.exit(1);
    }
    return value;
};

dotenv.config();

export const port = mustExist(+process.env.PORT!, "PORT") as number,
    appName = mustExist(process.env.APP_NAME!, "APP_NAME") as string,
    environment = process.env.ENVIRONMENT || "development",
    // Providers base url
    MONGODB_URI = {
        url: mustExist(process.env.MONGODB_URI!, "MONGODB_URI"),
    } as {
        url: string;
    },
    BASE_URL = {
        url: mustExist(process.env.BASE_URL!, "BASE_URL"),
    } as {
        url: string;
    };




