import { Router, Request, Response } from "express";
import { getLinkRepository } from '../repositories/link_Repository';
import { getVoteRepository } from '../repositories/vote_Repository';
import { Link } from "../entities/link";
import { Vote } from "../entities/vote";
import { Repository } from "typeorm";
import { authMiddleware } from "../middleware/auth_middleware";

//HTTP requests handling
export function getHandlers(link_Repository: Repository<Link>, vote_Repository: Repository<Vote>) {
    
    //GET - links
    const getAllLinksHandler = (req: Request, res: Response) => {
        (async () => {
            const links = await link_Repository.find();
            res.json(links).send();
        })();
    };
    
    //GET - link by ID
    const getLinkByIdHandler = (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const link = link_Repository.findOne({
            where: {
                id: id
            }
        });
        res.json(link).send();
        if (link === undefined) {
            res.status(404).send();
        }
        res.json(link).send();
    };

    //  POST - creating a new link
    const createLink = (req: Request, res: Response) => {
        (async () => {
            const user = (req as any).user;
            const title = req.body.title;
            const url = req.body.url;
            if (!title || !url || !user) {
                res.status(400)
                res.send(`ERROR - No parameters`);
            } else {
                const newLink = await link_Repository.save({ title: title, url: url, user: { id: user } });
                return res.json(newLink);
            }            
        })();
    };

    // DELETE - link by ID
    const deleteLink =  (req: Request, res: Response) => {
        (async () => {
            const linkId = req.params.id;
            const userId = (req as any).userId;

            const link = await link_Repository.findOne({
                where: {
                    id: linkId,
                    user: userId
                }
            });

            if (link === undefined){
                res.status(404).send(`Link not found.`);
            } else {
                // Delete the link
                const link = link_Repository.delete(linkId);
                // Return an empty json
                res.json({});
            }
        })();
    };

    // UPVOTE a link
    const upvoteLink = (req: Request, res: Response) => {
        (async () => {
            const linkId = req.params.id;
            const userId = (req as any).userId;
            

            const foundVote = await vote_Repository.findOne({
                where: {
                    user: userId,
                    link: linkId,
                }
            });
            

            if (foundVote === undefined){
                const newVote = await vote_Repository.save({ user: {id: userId}, isUpvote: true , link: {linkId} });
                res.json(newVote);
            }
            
            else{
    
                if ((foundVote as any).isUpvote){
                    res.status(400).send();
                }
            
                else {
                    (foundVote as any).isUpvote = true; 
                    res.json(await vote_Repository.save(foundVote));
                }
            }
        })(); 
    }

    // DOWNVOTE a link
    const downvoteLink = (req: Request, res: Response) => {
        (async () => {
            const linkId = req.params.id;
            const userId = (req as any).userId;
            const foundVote = await vote_Repository.findOne({
                where: {
                    user: userId,
                    link: linkId,
                }
            });
            
            if (foundVote === undefined){
                const newVote = await vote_Repository.save({ user: {id: userId}, isUpvote: false , link: {linkId} });
                res.json(newVote);
            }
            else{
               
                if ((foundVote as any).isUpvote){
                    (foundVote as any).isUpvote = false; 
                    res.json(await vote_Repository.save(foundVote));
                }
                
                else {
                    res.status(400).send();
                }
            }
        })(); 
    }

    return {
        getAllLinksHandler,
        getLinkByIdHandler,
        createLink,
        deleteLink,
        upvoteLink,
        downvoteLink
    };
}

export function getLinksRouter() {
    const handlers = getHandlers(getLinkRepository(), getVoteRepository() );
    const linkRouter = Router();
    // Returns all links
    linkRouter.get("/", handlers.getAllLinksHandler); // public
    // Creates a new link
    linkRouter.post("/", handlers.createLink); // private
    // Deletes a link by ID
    linkRouter.delete("/:id", authMiddleware, handlers.deleteLink); // private
    // Upvotes link
    linkRouter.post("/:id/upvote", authMiddleware, handlers.upvoteLink); // private
    // Downvotes link
    linkRouter.post("/:id/downvote", authMiddleware, handlers.downvoteLink); // private
    // Returns a link by ID
    linkRouter.get("/:id/", handlers.getLinkByIdHandler); // public
    
    return linkRouter;
}






























