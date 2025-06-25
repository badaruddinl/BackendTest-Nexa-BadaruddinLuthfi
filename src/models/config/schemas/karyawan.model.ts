import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("karyawan")
export class Karyawan {
  @PrimaryColumn({ length: 50, type: "varchar", nullable: false })
  nip!: string;

  @Column({ type: "int", unsigned: true })
  id!: number;

  @Column({ length: 200, type: "varchar", nullable: false })
  nama!: string;

  @Column({ length: 200, type: "varchar", nullable: true })
  alamat?: string;

  @Column({ type: "enum", enum: ["L", "P"], nullable: true })
  gend?: "L" | "P";

  @Column({ type: "text", nullable: true })
  photo?: string;

  @Column({ type: "date", nullable: true })
  tgl_lahir?: Date;

  @Column({ type: "int", nullable: true, default: 1 })
  status?: number;

  @Column({
    type: "datetime",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  insert_at?: Date;

  @Column({ length: 50, type: "varchar", nullable: true })
  insert_by?: string;

  @Column("datetime", {
    nullable: true,
    onUpdate: "CURRENT_TIMESTAMP",
  })
  update_at?: Date;

  @Column({ length: 50, type: "varchar", nullable: true })
  update_by?: string;
}
