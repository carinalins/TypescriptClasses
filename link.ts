import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany } from "typeorm";
import {User} from "./user";
import { Vote } from "./vote";
import { Comment } from "./comment";

@Entity()
export class Link {

    @PrimaryGeneratedColumn()
    public linkId!: number;

    @ManyToOne(type => User, user => user.links)
    public user!: User;

    @OneToOne(type => Vote, vote => vote.link)
    public vote!: Vote; 

    @OneToMany(type => Comment, comment => comment.link)
    public comments!: Comment[];

    @Column()
    public url!: string;

    @Column()
    public title!: string;

}
