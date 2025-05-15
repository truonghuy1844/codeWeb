Use web_code
GO
CREATE OR ALTER PROCEDURE sp_login_user
    @user_name VARCHAR(25),
    @password VARCHAR(100),
	@ip_address VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @user_id INT = NULL;

    -- Kiểm tra tồn tại user
    IF NOT EXISTS (
        SELECT 1 FROM user_tb WHERE user_name = @user_name
    )
    BEGIN
        EXEC sp_InsertLogHistory NULL, @ip_address, 0;
        SELECT N'Sai tên đăng nhập hoặc mật khẩu' AS message, 0 AS success;
        RETURN;
    END

    -- Khai báo biến
    DECLARE 
        @ban BIT, 
        @freeze BIT, 
        @real_password VARCHAR(100);

    -- Lấy thông tin tài khoản
    SELECT 
        @ban = ban,
        @freeze = freeze,
        @real_password = password,
        @user_id = user_id
    FROM user_tb
    WHERE user_name = @user_name;

    -- Kiểm tra trạng thái
    IF @ban = 1 OR @freeze = 1
    BEGIN
        EXEC sp_InsertLogHistory @user_id, @ip_address, 0;

        SELECT 
            CASE 
                WHEN @ban = 1 THEN N'Tài khoản đã bị chặn'
                WHEN @freeze = 1 THEN N'Tài khoản đang bị đóng băng'
            END AS message,
            0 AS success;
        RETURN;
    END

    -- Kiểm tra mật khẩu
    IF @real_password != @password
    BEGIN
        EXEC sp_InsertLogHistory @user_id, @ip_address, 0;
        SELECT N'Sai tên đăng nhập hoặc mật khẩu' AS message, 0 AS success;
        RETURN;
    END

    -- Đăng nhập thành công
    EXEC sp_set_session_context 'user_id', @user_id;
    EXEC sp_InsertLogHistory @user_id, @ip_address, 1;

    SELECT 
        N'Đăng nhập thành công' AS message,
        1 AS success,
        user_id,
        user_name,
        admin,
        buyer,
        seller,
        rank,
        status,
        notify,
        date_created
    FROM user_tb
    WHERE user_name = @user_name;
END
GO






---- Store lọc sản phẩm và hiển thị số lượng, lượt voucher còn lại
CREATE OR ALTER PROCEDURE sp_filter_product_inventory
    @product_id VARCHAR(25) = '',
    @category_id VARCHAR(25) = '',
    @group1 VARCHAR(25) = '',
    @group2 VARCHAR(25) = '',
    @group3 VARCHAR(25) = '',
    @group4 VARCHAR(25) = '',
    @product_name NVARCHAR(75) = '',
    @price_from MONEY = NULL,
    @price_to MONEY = NULL,
    @order_by VARCHAR(50) = '',
    @type_order_by VARCHAR(10) = 'ASC'
AS
BEGIN
    SET NOCOUNT ON;

    -- Dữ liệu tạm từ view
    SELECT 
        v.*,
        -- Tính số lượng còn lại
        ISNULL(v.quantity_available, 0) AS quantity_remaining,
        -- Trạng thái hết hàng
        CASE WHEN ISNULL(v.quantity_available, 0) <= 0 THEN 1 ELSE 0 END AS out_of_stock_flag, ------- nếu hết hàng thì giá trị 1
        -- Mặc định chưa có giảm giá
        NULL AS promo_value,
        NULL AS discounted_price
    INTO #t
    FROM vw_product_inventory v
    WHERE 
        (@product_id = '' OR v.product_id LIKE '%' + @product_id + '%') AND
        (@category_id = '' OR v.category_id = @category_id) AND
        (@group1 = '' OR v.group_tb_1 = @group1) AND
        (@group2 = '' OR v.group_tb_2 = @group2) AND
        (@group3 = '' OR v.group_tb_3 = @group3) AND
        (@group4 = '' OR v.group_tb_4 = @group4) AND
        v.pro_status = 1 AND v.brand_status = 1 AND
        (
            @product_name = '' 
            OR v.name LIKE '%' + @product_name + '%' 
            OR v.name2 LIKE '%' + @product_name + '%'
        ) AND
        (@price_from IS NULL OR v.price >= @price_from) AND
        (@price_to IS NULL OR v.price <= @price_to);

    -- Cập nhật giảm giá cho sản phẩm nếu có promotion loại 2 còn hiệu lực
    UPDATE t
    SET 
        promo_value = p.value,
        discounted_price = t.price1 - (t.price1 * p.value / 100.0)
    FROM #t t
    INNER JOIN (
        SELECT 
            pp.product_id, 
            MAX(p.value) AS value
        FROM promotion_product pp
        INNER JOIN promotion p ON pp.promotion_id = p.promotion_id
        WHERE 
            p.status = 1 AND pp.status = 1 AND
            p.type = 2 AND
            GETDATE() BETWEEN p.date_start AND ISNULL(p.date_end, GETDATE())
        GROUP BY pp.product_id
    ) p ON t.product_id = p.product_id;

    -- Output 1
    DECLARE @sql1 NVARCHAR(MAX) = N'SELECT * FROM #t';
    IF @order_by != ''
        SET @sql1 += N' ORDER BY ' + QUOTENAME(@order_by) + ' ' + 
                     CASE WHEN UPPER(@type_order_by) = 'DESC' THEN 'DESC' ELSE 'ASC' END;
    EXEC sp_executesql @sql1;

    -- Dữ liệu khuyến mãi còn hiệu lực
    SELECT * INTO #promotion
    FROM vw_promotion_used
    WHERE quantity_total = 0 OR (quantity_available > 0 AND quantity_total > 0);

    -- Output 2: chi tiết khuyến mãi
    DECLARE @sql2 NVARCHAR(MAX) = N'
        SELECT p1.product_id, p2.*, p3.quantity_available
        FROM #t t
        INNER JOIN promotion_product p1 ON t.product_id = p1.product_id
        LEFT JOIN promotion p2 ON p1.promotion_id = p2.promotion_id
        LEFT JOIN #promotion p3 ON p1.promotion_id = p3.promotion_id
        WHERE p1.status = 1 AND p2.status = 1';

    IF @order_by != ''
        SET @sql2 += N' ORDER BY ' + QUOTENAME(@order_by) + ' ' + 
                     CASE WHEN UPPER(@type_order_by) = 'DESC' THEN 'DESC' ELSE 'ASC' END;
    EXEC sp_executesql @sql2;

    DROP TABLE #t;
    DROP TABLE #promotion;
END
GO


GO



------- Store truy vấn đơn mua hàng

CREATE OR ALTER PROCEDURE sp_get_orders_by_buyer
    @buyer_id INT = -1,
    @from_date DATE = NULL,
    @to_date DATE = NULL,
    @order_id VARCHAR(25) = '',
	@status int = -1
AS
BEGIN
    SET NOCOUNT ON;

    -- Tạo bảng tạm để lưu trữ danh sách đơn hàng
    CREATE TABLE #OrderList (
        order_id VARCHAR(25),
        date_created DATETIME,
        buyer INT,
        seller INT,
        status INT,
        pro_ship INT,
        pro_new INT,
        pro_saleoff INT,
        pro_discount INT,
        description VARCHAR(255)
    );

    -----
    INSERT INTO #OrderList (order_id, date_created, buyer, seller, status, pro_ship, pro_new, pro_saleoff, pro_discount, description)
    SELECT
        o.order_id,
        o.date_created,
        o.buyer,
        o.seller,
        o.status,
        o.pro_ship,
        o.pro_new,
        o.pro_saleoff,
        o.pro_discount,
        o.description
    FROM order_tb o
    WHERE (o.buyer = @buyer_id OR @buyer_id = -1)
      AND (@from_date IS NULL OR o.date_created >= @from_date)
      AND (@to_date IS NULL OR o.date_created <= @to_date)
      AND (@order_id = '' OR @order_id = o.order_id)
	  AND (o.status = @status OR @status = -1)
    ORDER BY date_created DESC;
---- Output 1: Danh sách đơn hàng
    SELECT * FROM #OrderList;

    -- Output 2: Chi tiết sản phẩm trong đơn hàng
    SELECT
        od.order_id,
        od.product_id,
        p.name AS product_name,
		p.url_image1,
		p.url_image2,
		p.url_image3,
        p.description,
        od.quantity,
        od.cost,
        od.price,
        od.tax
    FROM #OrderList ol
    INNER JOIN order_d od ON ol.order_id = od.order_id
    INNER JOIN product p ON od.product_id = p.product_id
    ORDER BY ol.date_created DESC, od.order_id;

    -- Xóa bảng tạm
    DROP TABLE #OrderList;
END;

Go



------- Store truy vấn đơn bán hàng

Create OR ALTER PROCEDURE sp_get_orders_by_seller
    @seller_id INT = -1,
    @from_date DATE = NULL,
    @to_date DATE = NULL,
    @order_id VARCHAR(25) = '',
	@status int = -1
AS
BEGIN
    SET NOCOUNT ON;

    -- Tạo bảng tạm để lưu trữ danh sách đơn hàng
    CREATE TABLE #OrderList (
        order_id VARCHAR(25),
        date_created DATETIME,
        buyer INT,
        seller INT,
        status INT,
        pro_ship INT,
        pro_new INT,
        pro_saleoff INT,
        pro_discount INT,
        description VARCHAR(255)
    );

    -- Output 1: Danh sách đơn hàng
    INSERT INTO #OrderList (order_id, date_created, buyer, seller, status, pro_ship, pro_new, pro_saleoff, pro_discount, description)
    SELECT
        o.order_id,
        o.date_created,
        o.buyer,
        o.seller,
        o.status,
        o.pro_ship,
        o.pro_new,
        o.pro_saleoff,
        o.pro_discount,
        o.description
    FROM order_tb o
    WHERE (o.seller = @seller_id OR @seller_id = -1)
      AND (@from_date IS NULL OR o.date_created >= @from_date)
      AND (@to_date IS NULL OR o.date_created <= @to_date)
      AND (@order_id = '' OR @order_id = o.order_id)
	  AND (o.status = @status OR @status = -1)
    ORDER BY date_created DESC;

    SELECT * FROM #OrderList;

    -- Output 2: Chi tiết sản phẩm trong đơn hàng
    SELECT
        od.order_id,
        od.product_id,
        p.name AS product_name,
        p.description,
		p.url_image1,
		p.url_image2,
		p.url_image3,
        od.quantity,
        od.cost,
        od.price,
        od.tax
    FROM #OrderList ol
    INNER JOIN order_d od ON ol.order_id = od.order_id
    INNER JOIN product p ON od.product_id = p.product_id
    ORDER BY ol.date_created DESC, od.order_id;

    -- Xóa bảng tạm
    DROP TABLE #OrderList;
END;

Go





------- STORE truy vấn đơn hàng, hóa đơn, chi tiết đơn hàng

CREATE OR ALTER PROCEDURE sp_get_invoice_details
    @invoice_id VARCHAR(25) = '',
	@order_id VARCHAR(25) = '',
    @date_invoice_from DATE = NULL,
    @date_invoice_to DATE = NULL,
    @date_order_from DATE = NULL,
    @date_order_to DATE = NULL,
    @method VARCHAR(25) = '',
    @status INT = -1
AS
BEGIN
    SET NOCOUNT ON;

	----Filter hóa đơn, đơn hàng theo điều kiện lọc
    SELECT 
        i.invoice_id,
        i.order_id,
        o.date_created AS order_date,
        i.date_created AS invoice_date,
        i.date_payment,
        i.method,
        pm.name AS payment_method,
        i.amount,
        i.tax_amount,
        i.promotion AS promotion_amount,
        i.amount_payable,
        i.payment,
        i.balanced,
        i.description AS invoice_description,
        o.description AS order_description,
        i.status AS invoice_status
	INTO #invoice_filtered
    FROM invoice i
    LEFT JOIN order_tb o ON i.order_id = o.order_id
    LEFT JOIN payment_method pm ON i.method = pm.method_id
    WHERE 
        (@invoice_id = '' OR i.invoice_id = @invoice_id) AND
		(@order_id = '' OR o.order_id = @invoice_id) AND
        (@method = '' OR i.method = @method) AND
        (@status = -1 OR i.status = @status) AND
        (@date_invoice_from IS NULL OR i.date_created >= @date_invoice_from) AND
        (@date_invoice_to IS NULL OR i.date_created <= @date_invoice_to) AND
        (@date_order_from IS NULL OR o.date_created >= @date_order_from) AND
        (@date_order_to IS NULL OR o.date_created <= @date_order_to)
	ORDER BY invoice_date, order_date;
    ----------------------
    -- Output 1: Thông tin hóa đơn + đơn hàng
    ----------------------

	SELECT * FROM #invoice_filtered;
    ------------------------
    -- Bước 2: Output 2 – Chi tiết đơn hàng liên kết
    ------------------------
    SELECT 
        od.order_id,
        od.product_id,
        p.name AS product_name,
        od.quantity,
        od.price,
        od.cost,
        od.tax
    FROM order_d od
    INNER JOIN #invoice_filtered f ON od.order_id = f.order_id
    LEFT JOIN product p ON od.product_id = p.product_id;

    ------------------------
    -- Bước 3: Output 3 – Chi tiết khuyến mãi sử dụng
    ------------------------
    SELECT 
        p.promotion_id,
        p.promotion_name,
        p.promotion_name2,
        p.type,
        p.calculate,
        p.value,
        p.description,
        p.date_start,
        p.date_end,
        f.order_id
    FROM #invoice_filtered f
    INNER JOIN order_tb o ON f.order_id = o.order_id
    LEFT JOIN promotion p ON 
        p.promotion_id IN (
            o.pro_discount, o.pro_new, o.pro_saleoff, o.pro_ship
        )
    WHERE p.status = 1;

    ------------------------
    -- Clean up
    ------------------------
    DROP TABLE #invoice_filtered;
END;
GO





------- Store top sản phẩm bán chạy

CREATE OR ALTER PROCEDURE sp_get_top_selling_products
	@user_id int = -1,
    @date_from DATE = NULL,
    @date_to DATE = NULL,
	@category VARCHAR(25) = '',
	@brand_id VARCHAR(25) = '',
    @group VARCHAR(25) = '',
    @top_n INT = 10
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP (@top_n)
        p.product_id,
        p.name,
        p.group_tb_1,
        p.group_tb_2,
        p.group_tb_3,
        p.group_tb_4,
        SUM(od.quantity) AS total_quantity_sold,
        SUM(od.price * od.quantity) AS total_revenue
    FROM order_d od
    INNER JOIN order_tb o ON od.order_id = o.order_id
    INNER JOIN product p ON od.product_id = p.product_id
    WHERE 
		(@user_id = -1 OR @user_id = o.seller) AND 
        (@date_from IS NULL OR o.date_created >= @date_from) AND
        (@date_to IS NULL OR o.date_created <= @date_to) AND
        (@group = '' OR p.group_tb_1 = @group) AND
        (@group = '' OR p.group_tb_2 = @group) AND
        (@group = '' OR p.group_tb_3 = @group) AND
        (@group = '' OR p.group_tb_4 = @group) AND
		(@category = '' OR p.category_id = @category) AND
        (@brand_id = '' OR p.brand_id = @brand_id) -- Nếu brand là group_tb_1
    GROUP BY 
        p.product_id, p.name, 
        p.group_tb_1, p.group_tb_2, p.group_tb_3, p.group_tb_4
    ORDER BY 
        total_quantity_sold DESC;
END;
GO






-------- Lọc tổng đơn hàng, daonh thu, chi phí, giá trị khuyến mãi
CREATE OR ALTER PROCEDURE sp_report_order_summary_by_seller
    @seller_id INT = -1,
    @date_from DATE = NULL,
    @date_to DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        o.seller,
        COUNT(DISTINCT o.order_id) AS total_orders,
        ISNULL(SUM(i.amount), 0) AS total_revenue,
        ISNULL(SUM(i.cost), 0) AS total_cost,
        ISNULL(SUM(i.promotion), 0) AS total_promotion
    FROM order_tb o
    LEFT JOIN invoice i ON o.order_id = i.order_id
    WHERE 
        (@seller_id = -1 OR o.seller = @seller_id) AND
        (@date_from IS NULL OR o.date_created >= @date_from) AND
        (@date_to IS NULL OR o.date_created <= @date_to) AND
        o.status >= 1 -- Chỉ tính đơn hàng đã được xử lý
    GROUP BY o.seller;
END;
GO






------ Lọc đánh giá sản phẩm

CREATE OR ALTER PROCEDURE sp_report_product_rating_summary
    @product_id VARCHAR(25) = '',
    @date_from DATE = NULL,
    @date_to DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Tạm lưu danh sách sản phẩm phù hợp
    SELECT DISTINCT r.product_id
    INTO #filtered_products
    FROM rating r
    WHERE 
        (@product_id = '' OR r.product_id = @product_id) AND
        (@date_from IS NULL OR r.date_created >= @date_from) AND
        (@date_to IS NULL OR r.date_created <= @date_to);

    -- Output 1: Tổng hợp điểm đánh giá theo sản phẩm
    SELECT 
        p.product_id,
        p.name,
        COUNT(r.rate) AS total_reviews,
        AVG(CAST(r.rate AS FLOAT)) AS avg_rate,
        MAX(r.rate) AS max_rate,
        MIN(r.rate) AS min_rate
    FROM #filtered_products f
    JOIN product p ON f.product_id = p.product_id
    JOIN rating r ON p.product_id = r.product_id
    WHERE 
        (@date_from IS NULL OR r.date_created >= @date_from) AND
        (@date_to IS NULL OR r.date_created <= @date_to)
    GROUP BY p.product_id, p.name;
	
    -- Output 2: Chi tiết đánh giá theo danh sách sản phẩm đã lọc
    SELECT 
        r.product_id,
        u.user_name,
        r.rate,
        r.date_created,
        r.description
    FROM #filtered_products f
    JOIN rating r ON f.product_id = r.product_id
    JOIN user_tb u ON r.user_id = u.user_id
    WHERE 
        (@date_from IS NULL OR r.date_created >= @date_from) AND
        (@date_to IS NULL OR r.date_created <= @date_to)
    ORDER BY r.date_created DESC;

    DROP TABLE #filtered_products;
END;
GO




CREATE OR ALTER PROCEDURE sp_report_shipment_summary
	@buyer int = -1,
	@seller int = -1,
    @shipment_id VARCHAR(25) = '',
    @order_id VARCHAR(25) = '',
    @shipper_id VARCHAR(25) = '',
    @date_from DATETIME = NULL,
    @date_to DATETIME = NULL,
    @status INT = -1
AS
BEGIN
    SET NOCOUNT ON;

    -- Output 1: Tổng hợp thông tin giao hàng
    SELECT 
        s.shipment_id,
        s.order_id,
        s.date_created,
        s.date_est_deli,
        s.date_actual_deli,
        s.shipper1_id,
        s.shipper1_name,
        s.phone1,
        s.shipper2_id,
        s.shipper2_name,
        s.phone2,
        a.name AS address_name,
        a.phone,
        CONCAT_WS(', ', a.detail, a.street, a.ward, a.district, a.city, a.country) AS full_address,
        s.name_receive,
        s.phone_receive,
        s.status,
        s.description
    INTO #shipment_list
    FROM shipment s
    LEFT JOIN address a ON s.address_id = a.address_id
	LEFT Join order_tb o ON o.order_id = s.order_id
    WHERE
		(@buyer = -1 OR @buyer = o.buyer ) AND
		(@seller = -1 OR @seller = o.seller ) AND
        (@shipment_id = '' OR s.shipment_id = @shipment_id) AND
        (@order_id = '' OR s.order_id = @order_id) AND
        (@shipper_id = '' OR s.shipper1_id = @shipper_id OR s.shipper2_id = @shipper_id) AND
        (@date_from IS NULL OR s.date_created >= @date_from) AND
        (@date_to IS NULL OR s.date_created <= @date_to) AND
        (@status = -1 OR s.status = @status);

    -- Output kết quả tổng hợp
    SELECT * FROM #shipment_list;

    -- Output 2: Chi tiết sản phẩm được giao trong từng shipment
    SELECT 
        sd.shipment_id,
        sd.order_id,
        sd.product_id,
        p.name AS product_name,
        sd.quantity
    FROM #shipment_list sl
    JOIN shipment_d sd ON sl.shipment_id = sd.shipment_id
    JOIN product p ON sd.product_id = p.product_id
    ORDER BY sd.shipment_id, sd.product_id;

    DROP TABLE #shipment_list;
END;
GO




-------- Chi tiết Giỏ hàng kèm sale off


CREATE OR ALTER PROCEDURE sp_get_cart_by_user_with_promotion
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;
	SELECT *  INTO #inventory FROM vw_product_inventory

 -- Lưu kết quả vào bảng tạm
    SELECT 
        c.user_id,
        u.user_name,
        c.product_id,
        c.product_name,
        c.quantity,
        c.price AS original_price,
        ISNULL(pr.value, 0) AS promotion_value,
        CASE 
            WHEN pr.type = 2 AND pr.status = 1 
                 AND GETDATE() BETWEEN pr.date_start AND ISNULL(pr.date_end, GETDATE())
            THEN c.price * (1 - pr.value / 100.0)
            ELSE c.price
        END AS final_price,
        c.quantity * 
        CASE 
            WHEN pr.type = 2 AND pr.status = 1 
                 AND GETDATE() BETWEEN pr.date_start AND ISNULL(pr.date_end, GETDATE())
            THEN c.price * (1 - pr.value / 100.0)
            ELSE c.price
        END AS total_price,
        i.category_id,
        i.brand_id,
        i.group_tb_1,
        i.group_tb_2,
        i.url_image1,
        i.pro_status AS product_status,
		i.brand_status,
        i.quantity_available,
        CASE 
            WHEN i.pro_status = 1 AND i.brand_status = 1 AND  i.quantity_available > 0 THEN 1
            ELSE 0
        END AS product_status_flag ------ Kiểm tra sản phẩm còn bán, còn hàng không

    INTO #cart_temp
    FROM cart c
    JOIN user_tb u ON c.user_id = u.user_id
    LEFT JOIN #inventory i ON c.product_id = i.product_id
    LEFT JOIN promotion_product pp ON c.product_id = pp.product_id AND pp.status = 1
    LEFT JOIN promotion pr ON pp.promotion_id = pr.promotion_id 
                            AND pr.status = 1 
                            AND pr.type = 2
                            AND GETDATE() BETWEEN pr.date_start AND ISNULL(pr.date_end, GETDATE())
    WHERE c.user_id = @user_id;

    -- Output 1: Chi tiết giỏ hàng
    SELECT * FROM #cart_temp;

    -- Output 2: Tổng số lượng và giá trị
    SELECT 
        SUM(quantity) AS total_quantity,
        SUM(total_price) AS total_value
    FROM #cart_temp;


	DROP TABLE #inventory
    DROP TABLE #cart_temp
	
END;

GO




------ Store xử lý mở 1 sản phẩm
CREATE OR ALTER PROCEDURE sp_get_product_detail
    @product_id varchar(25) = ''
AS
BEGIN
    SET NOCOUNT ON;
	SELECT TOP 1 *  INTO #inventory FROM vw_product_inventory
	WHERE product_id = @product_id;

	SELECT p.*,
	CASE 
            WHEN pr.type = 2 AND pr.status = 1 
                 AND GETDATE() BETWEEN pr.date_start AND ISNULL(pr.date_end, GETDATE())
            THEN p.price1 * (1 - pr.value / 100.0)
            ELSE p.price1
        END AS final_price,
	i.brand_id,
	i.quantity_available,
	CASE WHEN i.quantity_available > 0 AND i.pro_status = 1 AND i.brand_id = 1 THEN 1
		ELSE 0  
		END AS status_flag ------ Trạng thái sản phẩm còn bán, hết hàng hay không
	FROM product p LEFT JOIN #inventory i ON p.product_id = i.product_id
		LEFT JOIN promotion_product p1 ON  p1.product_id = p.product_id
		LEFT JOIN promotion pr ON pr.promotion_id = p1.promotion_id

END;

GO

-----Store load danh sách người dùng
CREATE OR ALTER PROCEDURE sp_get_list_user_tb
    @user_id int
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @admin bit;
	Select @admin = admin from user_tb where @user_id = user_id
	SELECT  *  INTO #user FROM vw_user
	WHERE user_id = @user_id OR admin = 1
	----- ouput 1: Danh sách người dùng
	SELECT * FROM #user
            

END;

GO
-----Store laod thông tin chi tiết người dùng
-----Store load danh sách người dùng
CREATE OR ALTER PROCEDURE sp_get_detail_user_tb
    @user_id int
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @admin bit;
	Select @admin = admin from user_tb where @user_id = user_id
	SELECT  *  INTO #user FROM vw_user
	WHERE user_id = @user_id
	----- ouput 1: Thông tin người dùng
	SELECT * FROM #user
            

END;

GO
