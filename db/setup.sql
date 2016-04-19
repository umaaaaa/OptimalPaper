DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS paper;
DROP TABLE IF EXISTS user;

CREATE TABLE IF NOT EXISTS user(
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  auth TINYINT NOT NULL,
  id_auth BIGINT UNSIGNED NOT NULL,
  name NVARCHAR(64) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS paper(
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  repo TINYINT NOT NULL,
  id_repo BIGINT UNSIGNED NOT NULL,
  title NVARCHAR(1024) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS review(
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  paper_id INT UNSIGNED NOT NULL,
  rate TINYINT,
  comment TEXT,
  PRIMARY KEY(id),
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (paper_id) REFERENCES paper(id)
);

