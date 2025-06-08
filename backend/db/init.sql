-- 1) Borrar todo
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS renewalperiod CASCADE;
DROP TYPE IF EXISTS renewaltype CASCADE;
DROP TYPE IF EXISTS banner_position CASCADE;

-- 2) ENUMs
CREATE TYPE banner_position AS ENUM ('FLOATING_MAIN','HEADER','RIGHT_SIDE','FOOTER');
CREATE TYPE renewaltype    AS ENUM ('MANUAL','AUTOMATIC');
CREATE TYPE renewalperiod  AS ENUM ('DAYS_30','DAYS_60','DAYS_90');

-- 3) Tablas
CREATE TABLE users (
  id   SERIAL    PRIMARY KEY,
  name TEXT      NOT NULL
);

-- usuario “por defecto” para user_id=0
INSERT INTO users(id, name) VALUES (0, 'default_user');
SELECT setval(pg_get_serial_sequence('users','id'), 1, false);

CREATE TABLE banners (
  id                   SERIAL PRIMARY KEY,
  user_id              INT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url            TEXT   NOT NULL,
  client_link          TEXT   NOT NULL,
  start_date           TIMESTAMP NOT NULL,
  end_date             TIMESTAMP,
  position             banner_position NOT NULL,
  display_order        INT    NOT NULL,
  renewal_type         renewaltype NOT NULL,
  auto_renewal_period  renewalperiod
);

CREATE TABLE notifications (
  id           SERIAL   PRIMARY KEY,
  banner_id    INT      NOT NULL REFERENCES banners(id) ON DELETE CASCADE,
  notified_at  TIMESTAMP NOT NULL
);

-- 4) Índices
CREATE INDEX idx_banners_position   ON banners(position);
CREATE INDEX idx_notifications_date ON notifications(notified_at);
