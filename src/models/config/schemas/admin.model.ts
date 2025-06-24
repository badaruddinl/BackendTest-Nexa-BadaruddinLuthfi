import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("admin")
export class Admin {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ length: 100, type: "varchar", nullable: true })
  username?: string;

  @Column({ length: 11, type: "varbinary", nullable: true })
  password?: Buffer;

  @Column({ length: 100, type: "varchar", nullable: true })
  note?: string;
}
