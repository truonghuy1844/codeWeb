

CREATE DATABASE web_code
GO
USE web_code
GO

-- User table
CREATE TABLE user_tb (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    user_name VARCHAR(25) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    admin BIT DEFAULT 0,
    buyer BIT DEFAULT 1,
    seller BIT DEFAULT 0,
    rank INT DEFAULT 0,
    ban BIT DEFAULT 0,
    freeze BIT DEFAULT 0,
    notify BIT DEFAULT 0,
    date_created DATE,
    status BIT DEFAULT 1
);

-- User details table
CREATE TABLE user_tb2 (
    user_id INT PRIMARY KEY,
    name NVARCHAR(50),
    name2 NVARCHAR(50),
    birthday DATE,
    phone_number CHAR(10),
    address NVARCHAR(200),
    email NVARCHAR(50),
    social_url1 NVARCHAR(300) ,
    social_url2 NVARCHAR(300) ,
    social_url3 NVARCHAR(300) ,
    logo_url NVARCHAR(MAX),
    FOREIGN KEY (user_id) REFERENCES user_tb(user_id)
);

-- Category table
CREATE TABLE category (
    category_id VARCHAR(25) PRIMARY KEY,
    category_name NVARCHAR(75) NOT NULL,
    category_name2 NVARCHAR(75),
    description NVARCHAR(1000),
    status BIT DEFAULT 1
);

-- Group table
CREATE TABLE group_tb (
    group_tb_id VARCHAR(25) PRIMARY KEY,
    group_tb_name NVARCHAR(75) NOT NULL,
    group_tb_name2 NVARCHAR(75),
    type INT,
    description NVARCHAR(1000),
    status BIT DEFAULT 1
);
CREATE TABLE brand (
    brand_id VARCHAR(25) PRIMARY KEY,
    brand_name NVARCHAR(75) NOT NULL,
    brand_name2 NVARCHAR(75),
    description NVARCHAR(1000),
    status BIT DEFAULT 1,

);
go
-- Product table
CREATE TABLE product (
    product_id VARCHAR(25) PRIMARY KEY,
    name NVARCHAR(75) NOT NULL,
    name2 NVARCHAR(75),
    description NVARCHAR(1000),
	brand_id varchar(25),
    category_id VARCHAR(25) NOT NULL,
    group_tb_1 VARCHAR(25),
    group_tb_2 VARCHAR(25),
    group_tb_3 VARCHAR(25),
    group_tb_4 VARCHAR(25),
    uom NVARCHAR(20),
    price1 MONEY,
    date_apply1 DATETIME,
    price2 MONEY,
    date_apply2 DATETIME,
	url_image1 varchar(300),
	url_image2 varchar(300),
	url_image3 varchar(300),
    user_id VARCHAR(25),
    status BIT DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES category(category_id),
    FOREIGN KEY (group_tb_1) REFERENCES group_tb(group_tb_id),
    FOREIGN KEY (group_tb_2) REFERENCES group_tb(group_tb_id),
    FOREIGN KEY (group_tb_3) REFERENCES group_tb(group_tb_id),
    FOREIGN KEY (group_tb_4) REFERENCES group_tb(group_tb_id),
	FOREIGN KEY (brand_id) REFERENCES brand(brand_id)
);

-- Product inventory table
CREATE TABLE product_in (
    pi_id VARCHAR(25) PRIMARY KEY,
    product_id VARCHAR(25) NOT NULL,
    date_created DATETIME,
    date_start DATETIME DEFAULT GETDATE(),
    date_end DATETIME,
    name NVARCHAR(75) NOT NULL,
    name2 NVARCHAR(75),
    quantity int,
    cost MONEY,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- Promotion table
CREATE TABLE promotion (
    promotion_id VARCHAR(25) PRIMARY KEY,
    promotion_name NVARCHAR(75) NOT NULL,
    promotion_name2 NVARCHAR(75),
    type INT NOT NULL,
    calculate INT NOT NULL,
    date_created DATE,
    date_start DATE NOT NULL,
    date_end DATE,
    value int,
    quantity INT,
    description NVARCHAR(1000),
    quan_cond INT,
    val_cond MONEY,
    oder_tb_cond INT,
    group_tb_cond VARCHAR(25),
    rank_cond INT,
    status BIT DEFAULT 1
);

-- Promotion product table
CREATE TABLE promotion_product (
    promotion_id VARCHAR(25),
    product_id VARCHAR(25),
    status BIT DEFAULT 1,
    PRIMARY KEY (promotion_id, product_id),
    FOREIGN KEY (promotion_id) REFERENCES promotion(promotion_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);




-- Tax table
CREATE TABLE tax (
    tax_id VARCHAR(25) PRIMARY KEY,
    seq_num INT,
    tax_name NVARCHAR(75),
    tax_name2 NVARCHAR(75),
    date_created DATE,
    date_start DATE,
    date_end DATE,
    description NVARCHAR(1000),
    rate NUMERIC,
    quan_cond INT,
    val_cond MONEY,
    group_tb_cond VARCHAR(25),
    rank_cond INT,
    status BIT DEFAULT 1
);

-- Order table
CREATE TABLE order_tb (
    order_id VARCHAR(25) PRIMARY KEY,
    date_created DATE,
    buyer INT,
    seller INT,
    pro_ship VARCHAR(25),
    pro_new VARCHAR(25),
    pro_saleoff VARCHAR(25),
    pro_discount VARCHAR(25),
    description NVARCHAR(1000),
    status INT DEFAULT 0,
    FOREIGN KEY (pro_ship) REFERENCES promotion(promotion_id),
    FOREIGN KEY (pro_new) REFERENCES promotion(promotion_id),
    FOREIGN KEY (pro_saleoff) REFERENCES promotion(promotion_id),
    FOREIGN KEY (pro_discount) REFERENCES promotion(promotion_id)
);




-- Cart table
CREATE TABLE cart (
    user_id INT,
    product_id VARCHAR(25),
    product_name NVARCHAR(75),
    quantity INT,
    price MONEY,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES user_tb(user_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- Order detail table
CREATE TABLE order_d (
    order_id VARCHAR(25),
    product_id VARCHAR(25),
	pi_id VARCHAR(25),
    quantity INT,
    cost MONEY,
    price MONEY,
	tax VARCHAR(25),
    PRIMARY KEY (order_id, product_id, pi_id),
    FOREIGN KEY (order_id) REFERENCES order_tb(order_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (tax) REFERENCES tax(tax_id),
	FOREIGN KEY (pi_id) REFERENCES product_in(pi_id)
);

-- Payment method table
CREATE TABLE payment_method (
    method_id VARCHAR(25) PRIMARY KEY,
    name NVARCHAR(75),
    type INT,
    description NVARCHAR(1000),
    date_created DATETIME,
    fee_rate INT,
    url NVARCHAR(200),
    logo_url NVARCHAR(200),
    bank NVARCHAR(100),
    num_account INT,
	name_account nvarchar(75),
    refund BIT,
    sort INT,
    status BIT DEFAULT 1
);

-- Invoice table
CREATE TABLE invoice (
    invoice_id VARCHAR(25) PRIMARY KEY,
    order_id VARCHAR(25),
    date_created DATE,
    date_payment DATE,
    method VARCHAR(25),
    amount MONEY,
    ship_amount MONEY,
    tax_amount MONEY,
    promotion MONEY,
    cost MONEY,
    amount_payable MONEY,
    payment MONEY,
    balanced MONEY,
    description NVARCHAR(1000),
    status INT DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES order_tb(order_id),
    FOREIGN KEY (method) REFERENCES payment_method(method_id)
);

-- Wishlist table
CREATE TABLE wishlist (
    user_id INT,
    product_id VARCHAR(25),
    product_name VARCHAR(25),
    product_description NVARCHAR(1000),
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES user_tb(user_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- Rating table
CREATE TABLE rating (
    product_id VARCHAR(25),
    user_id INT,
    date_created DATE,
    rate INT,
    description NVARCHAR(1000),
    PRIMARY KEY (product_id, user_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (user_id) REFERENCES user_tb(user_id)
);


-- Log history table
CREATE TABLE log_hisory (
    user_id INT,
    date_log DATETIME,
    IP VARCHAR(50),
    status INT,
    FOREIGN KEY (user_id) REFERENCES user_tb(user_id)
);

-- Change history table
CREATE TABLE change_history (
    user_id INT,
    date_act DATETIME,
    type VARCHAR(25),
    table_change VARCHAR(25),
    old_val NVARCHAR(MAX),
    new_val NVARCHAR(MAX),
    status INT,
    FOREIGN KEY (user_id) REFERENCES user_tb(user_id)
);

-- Address table
CREATE TABLE address (
    address_id VARCHAR(25) PRIMARY KEY,
    name NVARCHAR(75),
    phone CHAR(10),
    description NVARCHAR(1000),
    country NVARCHAR(75),
    city NVARCHAR(75),
    district NVARCHAR(75),
    ward NVARCHAR(75),
    street NVARCHAR(75),
    detail NVARCHAR(75),
    user_id VARCHAR(25),
    status BIT DEFAULT 1
);

-- Shipment table
CREATE TABLE shipment (
    shipment_id VARCHAR(25) PRIMARY KEY,
    date_created DATETIME,
    date_receipt DATETIME,
    date_est_deli DATETIME,
    date_actual_deli DATETIME,
    shipper1_id VARCHAR(25),
    shipper1_name NVARCHAR(75),
    phone1 CHAR(10),
    shipper2_id VARCHAR(25),
    shipper2_name NVARCHAR(75),
    phone2 CHAR(10),
    order_id VARCHAR(25),
    address_id VARCHAR(25),
    name_receive NVARCHAR(75),
    phone_receive CHAR(10),
    description NVARCHAR(1000),
    status INT DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES order_tb(order_id),
    FOREIGN KEY (address_id) REFERENCES address(address_id)
);

-- Shipment detail table
CREATE TABLE shipment_d (
    shipment_id VARCHAR(25),
    product_id VARCHAR(25),
    order_id VARCHAR(25),
    quantity INT,
    PRIMARY KEY (shipment_id, product_id, order_id),
    FOREIGN KEY (shipment_id) REFERENCES shipment(shipment_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (order_id) REFERENCES order_tb(order_id)
);

-- Support table
CREATE TABLE support (
    support_id VARCHAR(25) PRIMARY KEY,
    user_ask int,
    ask NVARCHAR(1000),
    date_ask DATETIME,
    product_id VARCHAR(25),
    order_id VARCHAR(25),
    user_answer int,
    answer NVARCHAR(1000),
    date_answer DATETIME,
    support_in VARCHAR(25),
    FOREIGN KEY (user_ask) REFERENCES user_tb(user_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (order_id) REFERENCES order_tb(order_id),
    FOREIGN KEY (user_answer) REFERENCES user_tb(user_id),
);

-- Chat table
CREATE TABLE chat_tab (
    chat_id VARCHAR(25) PRIMARY KEY,
    date_created DATETIME,
    name NVARCHAR(75)
); 

-- Chat member table
CREATE TABLE chat_member (
    member_id INT PRIMARY KEY IDENTITY(1,1),
    member_name NVARCHAR(75),
    user_id INT,
    chat_id VARCHAR(25),
    date_joined DATETIME,
    FOREIGN KEY (user_id) REFERENCES user_tb(user_id),
    FOREIGN KEY (chat_id) REFERENCES chat_tab(chat_id)
);

-- Chat detail table
CREATE TABLE chat_detail (
    chat_rec INT identity(1,1),
    member_send INT not null,
    name_send INT,
    msg_txt NVARCHAR(MAX),
    date_created DATETIME,
    chat_reply INT,
    member_reply INT,
    isRead BIT,
    pin BIT,
    PRIMARY KEY (chat_rec)
);




---Click product
CREATE TABLE click_product (
    click_rec INT IDENTITY(1,1) PRIMARY KEY, -- Auto-increment click record
    product_id VARCHAR(25) NOT NULL,
    user_id INT NOT NULL,
    date_click DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (user_id) REFERENCES user_tb(user_id)
);

-- index cho việc truy vấn đơn hàng theo thời gian tạo gần nhất
CREATE NONCLUSTERED INDEX idx_order_user_date ON order_tb(buyer, date_created DESC);

-- Cho việc tính tổng tồn kho
CREATE NONCLUSTERED INDEX IX_product_in_product_id 
ON product_in(product_id)
INCLUDE (quantity);

CREATE NONCLUSTERED INDEX IX_product_filter 
ON product(category_id, group_tb_1, group_tb_2, group_tb_3, group_tb_4, status)
INCLUDE (product_id, name, description);

-- Cho việc tính tổng đã bán
CREATE NONCLUSTERED INDEX IX_order_d_product_id 
ON order_d(product_id)
INCLUDE (quantity);
-- Cho đăng nhập
CREATE NONCLUSTERED INDEX idx_login_username ON user_tb(user_name);

-- Truy vấn theo trạng thái đơn hàng
CREATE NONCLUSTERED INDEX idx_order_status ON order_tb(status);


