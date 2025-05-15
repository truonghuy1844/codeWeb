----- View xem tồn kho sản phẩm
Use web_code
GO

IF OBJECT_ID('vw_product_inventory', 'V') IS NOT NULL
    DROP VIEW vw_product_inventory;
GO

CREATE VIEW vw_product_inventory AS
WITH Inventory AS (
    SELECT 
        p.product_id,
        p.name,
        p.name2,
        p.description,
		p.brand_id,
        p.category_id,
        p.group_tb_1,
        p.group_tb_2,
        p.group_tb_3,
        p.group_tb_4,
		p.price1 as price,
		p.url_image1,
		p.url_image2,
		p.url_image3,
		p.uom,
        p.status as pro_status,
		b.status as brand_status,
        ISNULL(SUM(pi.quantity), 0) AS quantity_in,
        ISNULL(SUM(od.quantity), 0) AS quantity_sold,
        ISNULL(SUM(pi.quantity), 0) - ISNULL(SUM(od.quantity), 0) AS quantity_available
    FROM product p left join brand b on p.brand_id = b.brand_id 
    LEFT JOIN product_in pi ON p.product_id = pi.product_id
    LEFT JOIN order_d od ON p.product_id = od.product_id
    GROUP BY 
        p.product_id, p.name, p.name2, p.description, p.brand_id, 
        p.category_id, p.group_tb_1, p.group_tb_2, 
        p.group_tb_3, p.group_tb_4, p.price1, p.status, b.status, p.uom, p.url_image1, p.url_image2, p.url_image3
)
SELECT * FROM Inventory;

GO

----- View xem danh sách sản phẩm

IF OBJECT_ID('vw_product_seller', 'V') IS NOT NULL
    DROP VIEW vw_product_seller;
GO

CREATE VIEW vw_product_seller AS
WITH ProductList AS (
    SELECT 
        *
    FROM product p
)
SELECT * FROM ProductList;




GO




------- View xem danh sách brand
IF OBJECT_ID('vw_brand', 'V') IS NOT NULL
    DROP VIEW vw_brand;
GO

CREATE VIEW vw_brand AS
WITH BrandList AS (
    SELECT 
        *
    FROM brand
)
SELECT * FROM BrandList;

GO





---- VIEW danh sách người dùng
IF OBJECT_ID('vw_user', 'V') IS NOT NULL
    DROP VIEW vw_user;
GO

CREATE VIEW vw_user AS
WITH UserList AS (
    SELECT 
        a.*,
		name ,
		name2 ,
		birthday ,
		phone_number,
		address ,
		email,
		social_url1,
		social_url2,
		social_url3,
		logo_url
    FROM user_tb a left join user_tb2 b on a.user_id = b.user_id
)
SELECT * FROM UserList;

GO



-----VIEW xem promotion_detail
IF OBJECT_ID('vw_promotion_detail', 'V') IS NOT NULL
    DROP VIEW vw_promotion_detail;
GO

CREATE VIEW vw_promotion_detail AS
WITH Promotion_detail AS (
    SELECT 
		p1.product_id,
        p2.*,
		p1.status as detail_status
    FROM promotion_product p1 inner join promotion p2 on p1.promotion_id = p2.promotion_id
)
SELECT * FROM Promotion_detail;

GO



----- View lượt dùng promotion
IF OBJECT_ID('vw_promotion_used', 'V') IS NOT NULL
    DROP VIEW vw_promotion_used;
GO

CREATE VIEW vw_promotion_used AS
-------Gom mã giảm thành 1 trường để count
WITH AllPromotionUsage AS (
    SELECT pro_discount AS promotion_id FROM order_tb WHERE pro_discount IS NOT NULL
    UNION ALL
    SELECT pro_new FROM order_tb WHERE pro_new IS NOT NULL
    UNION ALL
    SELECT pro_saleoff FROM order_tb WHERE pro_saleoff IS NOT NULL
    UNION ALL
    SELECT pro_ship FROM order_tb WHERE pro_ship IS NOT NULL
),
------Đếm số lượng dùng
UsageSummary AS (
    SELECT 
        promotion_id,
        COUNT(*) AS quantity_used
    FROM AllPromotionUsage
    GROUP BY promotion_id
)
SELECT 
    d.*,
    ISNULL(p.quantity, 0) AS quantity_total,
    ISNULL(u.quantity_used, 0) AS quantity_used,
    ISNULL(p.quantity, 0) - ISNULL(u.quantity_used, 0) AS quantity_available
FROM promotion p
LEFT JOIN UsageSummary u ON p.promotion_id = u.promotion_id
LEFT JOIN vw_promotion_detail d ON d.product_id = p.promotion_id



GO

----- Truy vấn thông tin wishlist
IF OBJECT_ID('vw_wishlist_detail', 'V') IS NOT NULL
    DROP VIEW vw_wishlist_detail;
GO

CREATE OR ALTER VIEW vw_wishlist_detail AS
SELECT 
    w.user_id,
    u.user_name,
    w.product_id,
    w.product_name,
    w.product_description,
    p.brand_id,
    p.category_id,
    p.group_tb_1,
    p.group_tb_2,
    p.group_tb_3,
    p.group_tb_4,
    p.price1,
    p.url_image1,
    p.status
FROM wishlist w
JOIN user_tb u ON w.user_id = u.user_id
JOIN product p ON w.product_id = p.product_id;
GO




----- View thông tin giỏ hàng
IF OBJECT_ID('vw_cart_detail', 'V') IS NOT NULL
    DROP VIEW vw_cart_detail;
GO

CREATE OR ALTER VIEW vw_cart_detail AS
SELECT 
    c.user_id,
    u.user_name,
    c.product_id,
    c.product_name,
    p.description,
    c.quantity,
    c.price,
    (c.quantity * c.price) AS total_price,
    p.category_id,
    p.brand_id,
    p.group_tb_1,
    p.group_tb_2,
    p.url_image1,
    p.status
FROM cart c
JOIN user_tb u ON c.user_id = u.user_id
JOIN product p ON c.product_id = p.product_id;


