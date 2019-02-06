
import { getUserRepository } from "../repositories/user_Repository";
import * as jwt from "jsonwebtoken";
import { User } from "../entities/user";
import { Repository} from "typeorm";
import { Router, Request, Response } from "express";


export function getHandlers(user_Repository: Repository<User>) {
    
    const getTokenHandler = (req: Request, res: Response) => {
        (async () => {
            const body = req.body;
            const email = body.email;
            const password = body.password;


            // Checking email and password 
            if (!email || !password) {
                res.status(400).send();
            } else {
                const user = await user_Repository.findOne({
                    where: {
                        email: email,
                        password: password
                    }
                });
                
                if (!user) {
                    res.status(401).send();
                } else {
                    const payload = { id: user.id };
                    const secret = process.env.AUTH_SECRET;
                    if (typeof secret === "string") {
                        const token = jwt.sign(payload, secret);
                        res.json({ token: token });
                    } else {
                        res.status(500).send();
                    }
                }
            }
        })();
    };
    return {
        getTokenHandler
    };
}

export function getAuthRouter() {
    const handlers = getHandlers(getUserRepository());
    const authRouter = Router();
    // Returns an auth token
    authRouter.post("/login/", handlers.getTokenHandler);
    return authRouter;
}