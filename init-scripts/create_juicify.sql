DO $$BEGIN
IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'juicify') THEN
    CREATE DATABASE juicify;
    GRANT ALL PRIVILEGES ON DATABASE juicify TO admin;
END IF;
END$$;
