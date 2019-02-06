import { createConnection } from "typeorm";
import { Link } from "./backend/entities/link";
import { Comment } from "./backend/entities/comment";
import { User } from "./backend/entities/user";
import { Vote } from "./backend/entities/vote";



export async function createDbConnection() {

    // Read enviroment variables
    const DATABASE_HOST = process.env.DATABASE_HOST;
    const DATABASE_USER = process.env.DATABASE_USER;
    const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
    const DATABASE_DB = process.env.DATABASE_DB;

    // Display connection details in console
    console.log(
        `
        host: ${DATABASE_HOST}
        password: ${DATABASE_PASSWORD}
        user: ${DATABASE_USER}
        db : ${DATABASE_DB}
        `
    );

    // Open a database connection
   const conn = await createConnection({
        type: "postgres",
        host: DATABASE_HOST,
        port: 5432,
        username: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE_DB,
        entities: [
            Link,
            User,
            Comment,
            Vote        
        ],
         // This setting will automatically create database tables in the database server
        synchronize: true
    });

}
