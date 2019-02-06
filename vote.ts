import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";
import { Link } from "./link";

@Entity()
export class Vote {

    @PrimaryGeneratedColumn()
    public voteId!: number;

    @ManyToOne(type => User, user => user.vote)
    public user!: User;

    @ManyToOne(type => Link, link => link.vote)
    public link!: Link;

    @Column()
    public voteFlag!: boolean;
   
}