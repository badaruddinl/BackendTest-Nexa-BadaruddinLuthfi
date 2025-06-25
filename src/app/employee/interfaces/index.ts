interface CreateEmployeeInterface {
  nama: string;
  alamat: string;
  gend: "L" | "P";
  photo: string;
  tgl_lahir: Date;
}

interface UpdateEmployeeInterface {
  id?: number;
  nama: string;
  alamat: string;
  gend: "L" | "P";
  photo: string;
  tgl_lahir: Date;
}

interface QueryOptionInterface {
  page?: number;
  limit?: number;
  offset?: number;
  search?: string;
  params?: "name" | null;
}

export {
  CreateEmployeeInterface,
  UpdateEmployeeInterface,
  QueryOptionInterface,
};
