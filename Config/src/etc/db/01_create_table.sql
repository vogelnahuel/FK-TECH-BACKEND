CREATE TABLE IF NOT EXISTS sales(
    country varchar(2) NOT NULL,
    store varchar(3) NOT NULL UNIQUE,
    business_date varchar(8) NOT NULL,
    pos_number integer NOT NULL,
    sales_data jsonb NOT NULL,
    checkpoints jsonb NOT NULL,
    sale_types jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS events(
    country varchar(2) NOT NULL,
    store varchar(3) NOT NULL UNIQUE,
    business_date varchar(8) NOT NULL,
    pos_number integer NOT NULL,
    data_events jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS config(
    actions jsonb NOT NULL,
    apps jsonb NOT NULL,
    custom jsonb NOT NULL,
    denominations jsonb NOT NULL,
    disable_fields jsonb NOT NULL,
    employees jsonb NOT NULL,
    enabled_actions jsonb NOT NULL,
    roles jsonb NOT NULL,
    store jsonb NOT NULL,
    taxes jsonb NOT NULL,
    tenders jsonb NOT NULL,
    transfer jsonb NOT NULL,
    views jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS shifts(
    country varchar(2) NOT NULL,
    store varchar(3) NOT NULL UNIQUE,
    business_date varchar(8) NOT NULL,
    pos_number integer NOT NULL,
    close jsonb NOT NULL,
    data jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS product(
    country varchar(2) NOT NULL,
    store varchar(3) NOT NULL UNIQUE,
    data jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS users(
    country varchar(2) NOT NULL,
    stores TEXT [] NOT NULL,
    document varchar(30) NOT NULL,
    "user" jsonb NOT NULL,
    status jsonb NOT NULL,
    security_questions jsonb NOT NULL,
    sessions jsonb NOT NULL,
    PRIMARY KEY (country, document)
);
