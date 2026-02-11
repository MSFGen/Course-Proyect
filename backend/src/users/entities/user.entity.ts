import { UserRole } from "src/common/enums/userRole.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('Users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true })
    email: string;

    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    lastName: string;

    @Column({ type: 'text' })
    cellphone: string;
    
    @Column({ type: 'enum', enum: Object.values(UserRole), default: UserRole.USER })
    role: UserRole;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
