-------------
--TABLOLAR---
-------------

--tüm kulüpler
CREATE TABLE club (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    info TEXT NOT NULL
);

--tüm öğrenciler
CREATE TABLE student (
    userid VARCHAR(30) PRIMARY KEY,
    password VARCHAR(30) NOT NULL,
    fname VARCHAR(30) NOT NULL,
    lname VARCHAR(30) NOT NULL,
    phone VARCHAR(20) NOT NULL
);

--tüm yetkililer
CREATE TABLE authority (
    id VARCHAR(30) PRIMARY KEY,
    password VARCHAR(30) NOT NULL
);


-----------------
--FONKSİYONLAR---
-----------------

--kulübe duyuru ekle
CREATE OR REPLACE FUNCTION add_announcement (p_club_id INTEGER, p_text TEXT)
RETURNS INTEGER LANGUAGE plpgsql AS $$
DECLARE
    table_name TEXT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM club WHERE id = p_club_id) THEN
        RETURN 0;
    END IF;

    IF p_text IS NULL OR LENGTH(TRIM(p_text)) = 0 THEN
        RETURN 0;
    END IF;

    table_name := '_' || p_club_id || '_announcements';

    EXECUTE
        'INSERT INTO ' || table_name || ' (text) VALUES ($1)'
    USING p_text;

    RETURN 1;
END;
$$;

--kulüp ekle
CREATE OR REPLACE FUNCTION add_club (p_name VARCHAR, p_info TEXT)
RETURNS INTEGER LANGUAGE plpgsql AS $$
DECLARE
    new_id INTEGER;
    student_table_name TEXT;
    announcement_table_name TEXT;
BEGIN
    IF EXISTS (SELECT 1 FROM club WHERE name = p_name) THEN
        RETURN 0;
    END IF;

    INSERT INTO club (name, info)
    VALUES (p_name, p_info)
    RETURNING id INTO new_id;

    student_table_name := '_' || new_id || '_students';
    announcement_table_name := '_' || new_id || '_announcements';

    EXECUTE '
        CREATE TABLE ' || student_table_name || ' (
            member_id SERIAL PRIMARY KEY,
            userid    VARCHAR(30) NOT NULL,
            fname     VARCHAR(30) NOT NULL,
            lname     VARCHAR(30) NOT NULL,
            phone     VARCHAR(20) NOT NULL
        )';

    EXECUTE '
        CREATE TABLE ' || announcement_table_name || ' (
            id   SERIAL PRIMARY KEY,
            text TEXT NOT NULL
        )';

    RETURN 1;
END;
$$;

--öğrenci ekle
CREATE OR REPLACE FUNCTION add_student (p_userid VARCHAR, p_password VARCHAR, p_fname VARCHAR, p_lname VARCHAR, p_phone VARCHAR)
RETURNS INTEGER LANGUAGE plpgsql AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM student WHERE userid = p_userid) THEN
        RETURN 0;
    END IF;

    INSERT INTO student (userid, password, fname, lname, phone)
    VALUES (p_userid, p_password, p_fname, p_lname, p_phone);

    RETURN 1;
END;
$$;

--öğrenciyi kulübe ekle
CREATE OR REPLACE FUNCTION add_student_to_club (p_club_id INTEGER, p_userid VARCHAR)
RETURNS INTEGER LANGUAGE plpgsql AS $$
DECLARE
    table_name TEXT;
    exists_flag INTEGER;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM club WHERE id = p_club_id) THEN
        RETURN 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM student WHERE userid = p_userid) THEN
        RETURN 0;
    END IF;

    table_name := '_' || p_club_id || '_students';

    EXECUTE
        'SELECT 1 FROM ' || table_name || ' WHERE userid = $1'
    INTO exists_flag
    USING p_userid;

    IF exists_flag IS NOT NULL THEN
        RETURN 0;
    END IF;

    EXECUTE
        'INSERT INTO ' || table_name || ' (userid, fname, lname, phone)
         SELECT userid, fname, lname, phone
         FROM student
         WHERE userid = $1'
    USING p_userid;

    RETURN 1;
END;
$$;

--yetkili girişi kontrolü
CREATE OR REPLACE FUNCTION check_authority (p_id VARCHAR, p_password VARCHAR)
RETURNS INTEGER LANGUAGE plpgsql AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM authority
        WHERE id = p_id
          AND password = p_password
    ) THEN
        RETURN 1;
    END IF;

    RETURN 0;
END;
$$;

--öğrenci girişi kontrolü
CREATE OR REPLACE FUNCTION check_student_login (p_userid VARCHAR, p_password VARCHAR)
RETURNS INTEGER LANGUAGE plpgsql AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM student
        WHERE userid = p_userid
          AND password = p_password
    ) THEN
        RETURN 1;
    END IF;

    RETURN 0;
END;
$$;

--kulübü sil
CREATE OR REPLACE FUNCTION delete_club (p_id INTEGER)
RETURNS INTEGER LANGUAGE plpgsql AS $$
DECLARE
    student_table_name TEXT;
    announcement_table_name TEXT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM club WHERE id = p_id) THEN
        RETURN 0;
    END IF;

    student_table_name := '_' || p_id || '_students';
    announcement_table_name := '_' || p_id || '_announcements';

    EXECUTE 'DROP TABLE IF EXISTS ' || student_table_name;
    EXECUTE 'DROP TABLE IF EXISTS ' || announcement_table_name;

    DELETE FROM club WHERE id = p_id;

    RETURN 1;
END;
$$;

--öğrenci sil
CREATE OR REPLACE FUNCTION delete_student (p_userid VARCHAR)
RETURNS INTEGER LANGUAGE plpgsql AS $$
DECLARE
    club_id INTEGER;
    table_name TEXT;
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM student
        WHERE userid = p_userid
    ) THEN
        RETURN 0;
    END IF;

    DELETE FROM student
    WHERE userid = p_userid;

    FOR club_id IN
        SELECT id FROM club
    LOOP
        table_name := '_' || club_id || '_students';

        EXECUTE
            'DELETE FROM ' || table_name ||
            ' WHERE userid = ''' || p_userid || '''';
    END LOOP;

    RETURN 1;
END;
$$;

--öğrenciyi kulüpten sil
CREATE OR REPLACE FUNCTION delete_student_from_club (p_club_id INTEGER, p_userid VARCHAR)
RETURNS INTEGER LANGUAGE plpgsql AS $$
DECLARE
    table_name TEXT;
    exists_flag INTEGER;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM club WHERE id = p_club_id) THEN
        RETURN 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM student WHERE userid = p_userid) THEN
        RETURN 0;
    END IF;

    table_name := '_' || p_club_id || '_students';

    EXECUTE
        'SELECT 1 FROM ' || table_name || ' WHERE userid = $1'
    INTO exists_flag
    USING p_userid;

    IF exists_flag IS NULL THEN
        RETURN 0;
    END IF;

    EXECUTE
        'DELETE FROM ' || table_name || ' WHERE userid = $1'
    USING p_userid;

    RETURN 1;
END;
$$;

--öğrenci bilgilerini al
CREATE OR REPLACE FUNCTION get_student (p_userid VARCHAR)
RETURNS TABLE (
    userid VARCHAR,
    fname  VARCHAR,
    lname  VARCHAR,
    phone  VARCHAR
)
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT userid, fname, lname, phone
    FROM student
    WHERE userid = p_userid;
END;
$$;

--duyuruları listele
CREATE OR REPLACE FUNCTION list_announcements (p_club_id INTEGER)
RETURNS TABLE (
    id   INTEGER,
    text TEXT
)
LANGUAGE plpgsql AS $$
DECLARE
    table_name TEXT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM club WHERE id = p_club_id) THEN
        RETURN;
    END IF;

    table_name := '_' || p_club_id || '_announcements';

    RETURN QUERY EXECUTE
        'SELECT id, text FROM ' || table_name || ' ORDER BY id DESC';
END;
$$;

--kulüpleri listele
CREATE OR REPLACE FUNCTION list_clubs ()
RETURNS TABLE (
    id   INTEGER,
    name VARCHAR,
    info TEXT
)
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT id, name, info
    FROM club;
END;
$$;

-- Öğrencinin üyesi olduğu kulüpleri listele
CREATE OR REPLACE FUNCTION list_clubs_of_student (p_userid VARCHAR)
RETURNS TABLE (
    id   INTEGER,
    name VARCHAR,
    info TEXT
)
LANGUAGE plpgsql AS $$
DECLARE
    club_id INTEGER;
    table_name TEXT;
    exists_flag INTEGER;
BEGIN
    FOR club_id IN
        SELECT c.id FROM club c
    LOOP
        table_name := '_' || club_id || '_students';

        EXECUTE
            'SELECT 1 FROM ' || table_name ||
            ' WHERE userid = ''' || p_userid || ''''
        INTO exists_flag;

        IF exists_flag IS NOT NULL THEN
            RETURN QUERY
            SELECT c.id, c.name, c.info
            FROM club c
            WHERE c.id = club_id;
        END IF;
    END LOOP;
END;
$$;


--kulüp üyelerini listele
CREATE OR REPLACE FUNCTION list_members_of_club (p_club_id INTEGER)
RETURNS TABLE (
    member_id INTEGER,
    userid    VARCHAR,
    fname     VARCHAR,
    lname     VARCHAR,
    phone     VARCHAR
)
LANGUAGE plpgsql AS $$
DECLARE
    table_name TEXT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM club WHERE id = p_club_id) THEN
        RETURN;
    END IF;

    table_name := '_' || p_club_id || '_students';

    RETURN QUERY EXECUTE
        'SELECT member_id, userid, fname, lname, phone FROM ' || table_name;
END;
$$;

--öğrencileri listele
CREATE OR REPLACE FUNCTION list_students ()
RETURNS TABLE (
    userid VARCHAR,
    fname  VARCHAR,
    lname  VARCHAR,
    phone  VARCHAR
)
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT userid, fname, lname, phone
    FROM student;
END;
$$;

--öğrenci kulüpte mi
CREATE OR REPLACE FUNCTION student_is_member (p_club_id INTEGER, p_userid VARCHAR)
RETURNS INTEGER LANGUAGE plpgsql AS $$
DECLARE
    table_name TEXT;
    exists_flag INTEGER;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM club WHERE id = p_club_id) THEN
        RETURN 0;
    END IF;

    table_name := '_' || p_club_id || '_students';

    EXECUTE
        'SELECT 1 FROM ' || table_name || ' WHERE userid = $1'
    INTO exists_flag
    USING p_userid;

    IF exists_flag IS NULL THEN
        RETURN 0;
    END IF;

    RETURN 1;
END;
$$;
