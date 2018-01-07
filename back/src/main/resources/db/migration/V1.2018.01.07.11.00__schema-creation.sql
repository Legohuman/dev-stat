CREATE TABLE country
(
  code VARCHAR(3) PRIMARY KEY NOT NULL
);

CREATE TABLE country_fact
(
  uuid          UUID PRIMARY KEY NOT NULL,
  country_code  VARCHAR(3)       NOT NULL,
  actual_date   DATE             NOT NULL,
  dev_count     INT              NOT NULL,
  vacancy_count INT              NOT NULL,
  economy_level INT              NOT NULL,
  UNIQUE (country_code, actual_date),
  FOREIGN KEY (country_code) REFERENCES country (code)
);

CREATE TABLE developer_fact
(
  uuid         UUID PRIMARY KEY NOT NULL,
  country_code VARCHAR(3)       NOT NULL,
  actual_date  DATE             NOT NULL,
  salary       INT              NOT NULL,
  age          INT              NOT NULL,
  experience   INT              NOT NULL,
  company_size INT              NOT NULL,
  FOREIGN KEY (country_code) REFERENCES country (code)
);