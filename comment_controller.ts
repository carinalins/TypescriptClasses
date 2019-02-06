import { getLinkRepository } from "../repositories/link_Repository";
import { getUserRepository } from "../repositories/user_Repository";
import { getCommentRepository } from "../repositories/comment_Repository";
import express = require("express");
import * as joi from "joi";
import { authMiddleware } from "../middleware/auth_middleware";

export function getHandlers(){
    
    const linkRepository    = getLinkRepository();
    const userRepository    = getUserRepository();
    const commentRepository = getCommentRepository();
    
    const createComment = (req: express.Request, res: express.Response) => {
        
        const commentDetailSchema = joi.object({
            comment: joi.string().required(),
            linkId: joi.number().greater(0).required()
        }).required();
        
        
        const result = joi.validate(req.body, commentDetailSchema);
        
        if (result.error) {
            res.status(400).json({ code: 400, message: "Bad request", reason: result.error.message });
        }else{
            
            (async () => {
                
                const userId = (req as any).userId
                const user = await userRepository.findOne({ id: userId });
                const link = await linkRepository.findOne({ id: req.body.linkId });
                
                if (link && user) {
                    try {
                        const newComment = { comment: req.body.comment, user: user, link: link };
                        const comment = await commentRepository.save(newComment);
                        res.json(comment);
                        
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({ code: 500, message: "Internal Server Error", reason: "" });
                    }
                }else{
                    res.status(404).json({ code: 404, message: "Not Found", reason: "Link or User Not Found" });
                }
                    
            })();
        }

    };
    
    const updateComment = (req: express.Request, res: express.Response) => {
        
        const commentDetailSchema = joi.object({
            comment: joi.string().required(),
        }).required();
        
        const result = joi.validate(req.body, commentDetailSchema);
        
        if (result.error) {
            res.status(400).json({ code: 400, message: "Bad request", reason: result.error.message });
        } else {
            (async () => {
                
                const userId = (req as any).userId;
                const commentId = req.params.id;
                const user      = await userRepository.findOne({ id: userId });
                const comment = await commentRepository.findOne({ id: commentId, user: { id: userId }});
                
                if (comment && user) {
                    try {
                        
                        // use the following format if repository is of type repository
                        // const newComment = { comment: req.body.comment, user: { id: userId }, link: { id: req.body.linkId} };
                        const newComment = req.body.comment;
                        comment.commentId = newComment;
                        
                        const updatedComment = await commentRepository.save(comment);
                        
                        res.json(updatedComment);
                        
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({ code: 500, message: "Internal Server error", reason: "" });
                    }
                } else {
                    res.status(404).json({ code: 404, message: "Not Found", reason: "Wrong parameters" });
                }
                
            })();
        }
        
    }
    
    const deleteComment = (req: express.Request, res: express.Response) => {
        (async () => {
            
            const userId = (req as any).userId;
            const commentId = req.params.id;
            
            const user = await userRepository.findOne({ id: userId });
            const comment = await commentRepository.findOne({ id: commentId, user: { id: userId } });
            
            if (comment && user) {
                try {
                    const deletedEntry = await commentRepository.remove(comment);
                    res.json(deletedEntry);
                } catch (error) {
                    console.log(error);
                    res.status(500).json({ code: 500, message: "Internal Server error", reason: "" });
                }
            } else {
                res.status(404).json({ code: 404, message: "Not Found", reason: "Wrong parameters" });
            }
            
        })();
    };
    
    
    return {
        createComment: createComment,
        updateComment: updateComment,
        deleteComment: deleteComment,
    }
}

export function getCommentController() {
    
    const router = express.Router();
    const handlers = getHandlers();
    
    router.post("/",        authMiddleware, handlers.createComment)
    router.patch("/:id",    authMiddleware, handlers.updateComment)
    router.delete("/:id",   authMiddleware, handlers.deleteComment)
    
    return router;
}
