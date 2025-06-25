-- Buat view
CREATE OR REPLACE VIEW karyawan_luthfi AS
SELECT
    nip,
    nama,
    alamat,
    CASE gend
        WHEN 'L' THEN 'Laki - Laki'
        WHEN 'P' THEN 'Perempuan'
    END AS Gend,
    CONCAT(
        DAY(tgl_lahir), ' ',
        CASE MONTH(tgl_lahir)
            WHEN 1 THEN 'Januari' WHEN 2 THEN 'Februari' WHEN 3 THEN 'Maret' WHEN 4 THEN 'April'
            WHEN 5 THEN 'Mei' WHEN 6 THEN 'Juni' WHEN 7 THEN 'Juli' WHEN 8 THEN 'Agustus'
            WHEN 9 THEN 'September' WHEN 10 THEN 'Oktober' WHEN 11 THEN 'November' WHEN 12 THEN 'Desember'
        END,
        ' ', YEAR(tgl_lahir)
    ) AS `Tanggal lahir`
FROM karyawan;

-- Pisahkan eksekusi
SET @no := 0;
SELECT @no := @no + 1 AS No, v.* 
FROM karyawan_luthfi v
ORDER BY v.nip;