# BackendTest Nexa - Badaruddin Luthfi

## Cara Menjalankan

### 1. Persiapan

- Clone repository:
  ```bash
  git clone https://github.com/badaruddinl/BackendTest-Nexa-Badaruddin-Luthfi.git
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
  > Perintah ini akan otomatis build TypeScript (`npm run build`) dan menjalankan `node dist/app.js`

### 3. Jalankan di dalam container

- Build image:
  ```bash
  docker build -t employee-app .
  ```
- Jalankan container:
  ```bash
  docker run -p 3002:3002 --env-file .env employee-app
  ```
  > Anda bisa langsung menggunakan `docker-compose` juga:
  >
  > ```bash
  > docker compose up --build
  > ```

### 4. Akses API

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
