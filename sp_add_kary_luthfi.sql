DELIMITER $$

CREATE PROCEDURE sp_add_kary_luthfi(
    IN p_nip VARCHAR(50),
    IN p_nama VARCHAR(200),
    IN p_alamat VARCHAR(200),
    IN p_gend ENUM('L','P'),
    IN p_photo TEXT,
    IN p_tgl_lahir DATE,
    IN p_status INT,
    IN p_insert_by VARCHAR(50)
)
BEGIN
    DECLARE v_error INT DEFAULT 0;
    DECLARE v_message TEXT DEFAULT '';

    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION 
    BEGIN
        SET v_error = 1;
        SET v_message = 'Error saat insert karyawan';
        ROLLBACK;
    END;

    START TRANSACTION;

    IF EXISTS(SELECT 1 FROM karyawan WHERE nip = p_nip) THEN
        SET v_error = 1;
        SET v_message = CONCAT('NIP ', p_nip, ' sudah ada.');
        ROLLBACK;
    ELSE
        INSERT INTO karyawan(nip, nama, alamat, gend, photo, tgl_lahir, status, insert_at, insert_by)
        VALUES(p_nip, p_nama, p_alamat, p_gend, p_photo, p_tgl_lahir, p_status, NOW(), p_insert_by);

        COMMIT;
        SET v_message = 'Berhasil insert karyawan.';
    END IF;

    INSERT INTO log_trx_api(api, request, response, insert_at)
    VALUES(
        'sp_add_kary_luthfi',
        JSON_OBJECT(
            'nip', p_nip,
            'nama', p_nama,
            'alamat', p_alamat,
            'gend', p_gend,
            'photo', p_photo,
            'tgl_lahir', p_tgl_lahir,
            'status', p_status,
            'insert_by', p_insert_by
        ),
        v_message,
        NOW()
    );

END$$

DELIMITER ;
