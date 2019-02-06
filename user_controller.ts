import { Router, Request, Response } from "express";
import { getUserRepository } from "../repositories/user_Repository";
import { Repository } from "typeorm";
import { User } from "../entities/user";
import { authMiddleware } from "../middleware/auth_middleware";

export function getHandlers(user_Repository: Repository<User>) {
    
    // Creating user
    const createUser = (req: Request, res: Response) => {
        (async () => {
           
            const email= req.body.email;
            const password = req.body.password;
            console.log(`Email: ${email}, Password ${password}`);
            if (!password || !email) {
                res.status(400).send();
            } 
            else {
                // verifying existence
                const user = await user_Repository.findOne({
                    where: {
                        email: email,
                    }
                    
                });
                // creating a new user
                if(user === undefined){
                    const newUser = await user_Repository.save({ email: email, password: password});
                    return res.json(newUser);
                }
                // error for duplication
                else {
                    res.status(400).send();
                }
            }            
        })();
    };

    // Returning all Users
    const getAllUsersHandler = (req: Request, res: Response) => {
        (async () => {
            const users = await user_Repository.find();
            res.json(users).send();
        })();
    };

    // Returning user by ID
    const getUserByIdHandler = (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const user = user_Repository.findOne({
            where: {
                id: id
            }
        });
        
        if (user === undefined) {
            res.status(404).send();
        }
        res.json(user).send();
    };

    // Deleting a User
    const deleteUser =  (req: Request, res: Response) => {
        (async () => {
            const userId = req.params.id;

            const user = await user_Repository.findOne({
                where: {
                    id: userId
                }
            });

            if (user === undefined){
                res.status(404).send(`User not found.`);
            } else {
                // Perform action if everything goes well
                const user = user_Repository.delete(userId);
                // Return an empty json
                res.json({});
            }
        })();
    };

    return {
        createUser,
        getAllUsersHandler,
        getUserByIdHandler,
        deleteUser
    };

}

export function getUserRouter() {
    const handlers = getHandlers(getUserRepository());
    const userRouter = Router();

    userRouter.post("/", handlers.createUser); // private
    userRouter.get("/", handlers.getAllUsersHandler); // public
    userRouter.get("/:id", handlers.getUserByIdHandler); // public
    userRouter.delete("/:id", authMiddleware, handlers.deleteUser); // private

    return userRouter;
}