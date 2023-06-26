DO $$BEGIN
IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'juicify_strapi') THEN
    CREATE DATABASE juicify_strapi;
    GRANT ALL PRIVILEGES ON DATABASE juicify_strapi TO admin;
END IF;
END$$;
