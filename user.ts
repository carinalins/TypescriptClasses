import { Entity, PrimaryGeneratedColumn, Column,  OneToMany, OneToOne } from "typeorm";
import { Link } from "./link";
import { Vote } from "./vote";
import { Comment } from "./comment";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    public userId!: number;

    @OneToMany(type => Link, link => link.user)
    public links!: Link[];

    @OneToOne(type => Vote, vote => vote.user)
    public vote!: Vote[];

    @OneToMany(type => Comment, comment => comment.user)
    public comments!: Comment[];

    @Column()
    public email!: string;

    @Column()
    public password!: string;
    id: any;

   
   
}