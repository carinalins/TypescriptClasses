import { Entity,  PrimaryGeneratedColumn,  Column, ManyToOne } from "typeorm";
import { User } from "./user";
import { Link } from "./link";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    public commentId!: number;

    @ManyToOne(type => User, user => user.comments)
    public user!: User;

    
    @ManyToOne(type => Link, link => link.comments)
    public link!: Link;

    @Column("text")
    public commentsField!: string;
}