# BackendTest Nexa - Badaruddin Luthfi

## Cara Menjalankan

### 1. Persiapan

- Clone repository:
  ```bash
  git clone https://github.com/badaruddinl/BackendTest-Nexa-BadaruddinLuthfi.git
  cd BackendTest-Nexa-Badaruddin-Luthfi
  ```
- Buat file `.env` di root project:

  ```env
  APP_PORT=3002

  DB_HOST=gmedia.bz
  DB_PORT=3306
  DB_UNAME=gmedia_democase2
  DB_PASS=Janglidalam29J
  DB_NAME=gmedia_democase

  JWT_SECRET=nexatest
  JWT_EXPIRES_IN=4
  ```

### 2. Jalankan secara lokal

- Install dependencies:
  ```bash
  npm install
  ```
- Build dan jalankan project:

  ```bash
  npm run docker-start
  ```

  > Perintah ini akan otomatis build dengan docker`

  - Stop project:

  ```bash
  ctrl + c
  ```

  atau

  ```bash
  cmnd + c
  ```

  > Perintah ini jalankan 2x akan otomatis stop project docker`

### 3. Akses API

Setelah container berjalan, Anda bisa mengakses API di:

```
http://localhost:3002
```

---

## Catatan

- Pastikan file `.env` sudah diisi benar sebelum build & run.
- Jika mau menggunakan hot-reload untuk development lokal:
  ```bash
  npm run dev
  ```
