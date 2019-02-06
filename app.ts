import express from "express";
import * as bodyParser from "body-parser";

import { createDbConnection } from "./db";
import { getLinksRouter } from "./backend/controllers/links_controller";
import { getAuthRouter } from "./backend/controllers/auth_controller";
import { getUserRouter } from "./backend/controllers/user_controller";



 export async function getApp() {

    // Creating db connection
    await createDbConnection();

    // Creating app
    const app = express();

    // Server config body parser tp send JSON data into HTTP request
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    //Declare controllers
    app.use("/api/v1/links", getLinksRouter());
    app.use("/api/v1/auth", getAuthRouter());
    app.use("/api/v1/users", getUserRouter());

    

    // Declaring main path
    app.get("/", (req, res) => {
        res.send("This is the home page!");
    });

    // Starting the server
    app.listen(8080, () => {
        console.log(
            "The server is running in port 8080!"
        );
    });

    return app;

 }

