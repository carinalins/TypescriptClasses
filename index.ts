import "reflect-metadata";
import { getApp } from "./app";
import { createDbConnection } from "./db";

// Starting point
(async function() {
    await createDbConnection();
    const port = 8080;
    const app = await getApp();
    
    //HTTP LISTEN
    app.listen(port, () => {
        console.log(`The Server is running at http://127.0.0.1:${port}.`);
    });
})();