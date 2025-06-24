import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("admin_token")
export class AdminToken {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ type: "int", unsigned: true })
  id_admin!: number;

  @Column({ type: "text", nullable: true })
  token?: string;

  @Column({ type: "datetime", nullable: true })
  expired_at?: Date;
}
