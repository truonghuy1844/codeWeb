USE web_code
GO

-- Kiểm tra tồn tại và drop nếu tồn tại cho các stored procedures

-- sp_upsert_user
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_upsert_user') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_upsert_user
GO
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'upsert_promotion_and_assign') AND type in (N'P', N'PC'))
    DROP PROCEDURE upsert_promotion_and_assign
GO


IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_UpdateUserStatus') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_UpdateUserStatus
GO
-- upsert_promotion
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'upsert_promotion') AND type in (N'P', N'PC'))
    DROP PROCEDURE upsert_promotion
GO

-- upsert_product
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'upsert_product') AND type in (N'P', N'PC'))
    DROP PROCEDURE upsert_product
GO

-- upsert_product_in
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'upsert_product_in') AND type in (N'P', N'PC'))
    DROP PROCEDURE upsert_product_in
GO

-- add_to_cart
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'add_to_cart') AND type in (N'P', N'PC'))
    DROP PROCEDURE add_to_cart
GO

-- sp_UpdateCartQuantity
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_UpdateCartQuantity') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_UpdateCartQuantity
GO

-- add_to_wishlist
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'add_to_wishlist') AND type in (N'P', N'PC'))
    DROP PROCEDURE add_to_wishlist
GO

-- upsert_rating
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'upsert_rating') AND type in (N'P', N'PC'))
    DROP PROCEDURE upsert_rating
GO

-- upsert_support
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'upsert_support') AND type in (N'P', N'PC'))
    DROP PROCEDURE upsert_support
GO

-- upsert_chat_and_add_users_from_string
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'upsert_chat_and_add_users_from_string') AND type in (N'P', N'PC'))
    DROP PROCEDURE upsert_chat_and_add_users_from_string
GO

-- upsert_chat_members_from_string
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'upsert_chat_members_from_string') AND type in (N'P', N'PC'))
    DROP PROCEDURE upsert_chat_members_from_string
GO

-- upsert_chat_message
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'upsert_chat_message') AND type in (N'P', N'PC'))
    DROP PROCEDURE upsert_chat_message
GO

-- sp_update_chat_flag
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_update_chat_flag') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_update_chat_flag
GO

-- sp_CreateOrder_FIFO
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_CreateOrder_FIFO') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_CreateOrder_FIFO
GO

-- sp_UpdateOrderStatus
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_UpdateOrderStatus') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_UpdateOrderStatus
GO

-- sp_CloneOrderWithFifo
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_CloneOrderWithFifo') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_CloneOrderWithFifo
GO

-- sp_CreateOrder_BuyNow
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_CreateOrder_BuyNow') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_CreateOrder_BuyNow
GO

-- sp_UpdateBrandStatus
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_UpdateBrandStatus') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_UpdateBrandStatus
GO

-- sp_Upsert_PaymentMethod
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_Upsert_PaymentMethod') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_Upsert_PaymentMethod
GO

-- sp_InsertLogHistory
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_InsertLogHistory') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_InsertLogHistory
GO

-- sp_InsertClickProduct
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_InsertClickProduct') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_InsertClickProduct
GO

-- sp_create_invoice_from_order
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_create_invoice_from_order') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_create_invoice_from_order
GO

-- sp_UpdateInvoice
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_UpdateInvoice') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_UpdateInvoice
GO

-- sp_UpsertAddress
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_UpsertAddress') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_UpsertAddress
GO

-- sp_CreateShipmentFromOrder
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_CreateShipmentFromOrder') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_CreateShipmentFromOrder
GO


CREATE PROCEDURE sp_upsert_user
@user_id INT = 0, -- Nếu = 0 thì insert, khác 0 thì update
@user_name VARCHAR(25),
@password VARCHAR(100),
@admin BIT = 0,
@buyer BIT = 1,
@seller BIT = 0,
@rank INT = 1,
@ban BIT = 0,
@freeze BIT = 0,
@notify BIT = 0,
@status BIT = 1,

-- Thông tin user_tb2
@name NVARCHAR(50) = NULL,
@name2 NVARCHAR(50) = NULL,
@birthday DATE = NULL,
@phone_number CHAR(10) = NULL,
@address NVARCHAR(200) = NULL,
@email NVARCHAR(50) = NULL,
@social_url1 NVARCHAR(300) = NULL,
@social_url2 NVARCHAR(300) = NULL,
@social_url3 NVARCHAR(300) = NULL,
@logo_url NVARCHAR(MAX) = NULL,

-- ID người thực hiện thao tác
@current_user_id INT,

-- Output
@result BIT OUTPUT,
@message NVARCHAR(200) OUTPUT

AS
BEGIN
    SET NOCOUNT ON;

-- Kiểm tra quyền sửa
IF @user_id != 0 AND NOT EXISTS (
    SELECT 1 FROM user_tb 
    WHERE (user_id = @user_id OR admin = 1)
)
BEGIN
    SET @result = 0;
    SET @message = N'Không có quyền cập nhật người dùng.';
    RETURN;
END

-- Kiểm tra trùng user_name
IF EXISTS (
    SELECT 1 FROM user_tb 
    WHERE user_name = @user_name AND user_id != @user_id
)
BEGIN
    SET @result = 0;
    SET @message = N'Tên đăng nhập đã tồn tại.';
    RETURN;
END

-- Kiểm tra trùng số điện thoại
IF EXISTS (
    SELECT 1 FROM user_tb2 
    WHERE phone_number = @phone_number AND user_id != @user_id
)
BEGIN
    SET @result = 0;
    SET @message = N'Số điện thoại đã được sử dụng.';
    RETURN;
END

-- Kiểm tra trùng email
IF EXISTS (
    SELECT 1 FROM user_tb2 
    WHERE email = @email AND user_id != @user_id
)
BEGIN
    SET @result = 0;
    SET @message = N'Email đã được sử dụng.';
    RETURN;
END

-- Thêm mới
IF @user_id = 0
BEGIN
    INSERT INTO user_tb (
        user_name, password, admin, buyer, seller, rank, ban, freeze, notify, date_created, status
    )
    VALUES (
        @user_name, @password, @admin, @buyer, @seller, @rank, @ban, @freeze, @notify, GETDATE(), @status
    );

    SET @user_id = SCOPE_IDENTITY();

    INSERT INTO user_tb2 (
        user_id, name, name2, birthday, phone_number, address, email,
        social_url1, social_url2, social_url3, logo_url
    )
    VALUES (
        @user_id, @name, @name2, @birthday, @phone_number, @address, @email,
        @social_url1, @social_url2, @social_url3, @logo_url
    );

    SET @result = 1;
    SET @message = N'Thêm người dùng thành công.';
END
ELSE
BEGIN
    -- Cập nhật user_tb
    UPDATE user_tb
    SET
        password = CASE WHEN password != @password THEN @password ELSE password END,
        admin = CASE WHEN admin != @admin THEN @admin ELSE admin END,
        buyer = CASE WHEN buyer != @buyer THEN @buyer ELSE buyer END,
        seller = CASE WHEN seller != @seller THEN @seller ELSE seller END,
        rank = CASE WHEN rank != @rank THEN @rank ELSE rank END,
        ban = CASE WHEN ban != @ban THEN @ban ELSE ban END,
        freeze = CASE WHEN freeze != @freeze THEN @freeze ELSE freeze END,
        notify = CASE WHEN notify != @notify THEN @notify ELSE notify END,
        status = CASE WHEN status != @status THEN @status ELSE status END
    WHERE user_id = @user_id;

    -- Cập nhật user_tb2
    UPDATE user_tb2
    SET
        name = CASE WHEN name != @name THEN @name ELSE name END,
        name2 = CASE WHEN name2 != @name2 THEN @name2 ELSE name2 END,
        birthday = CASE WHEN birthday != @birthday THEN @birthday ELSE birthday END,
        phone_number = CASE WHEN phone_number != @phone_number THEN @phone_number ELSE phone_number END,
        address = CASE WHEN address != @address THEN @address ELSE address END,
        email = CASE WHEN email != @email THEN @email ELSE email END,
        social_url1 = CASE WHEN social_url1 != @social_url1 THEN @social_url1 ELSE social_url1 END,
        social_url2 = CASE WHEN social_url2 != @social_url2 THEN @social_url2 ELSE social_url2 END,
        social_url3 = CASE WHEN social_url3 != @social_url3 THEN @social_url3 ELSE social_url3 END,
        logo_url = CASE WHEN logo_url != @logo_url THEN @logo_url ELSE logo_url END
    WHERE user_id = @user_id;

    SET @result = 1;
    SET @message = N'Cập nhật người dùng thành công.';
END

END;

GO






----- Thêm, sửa sản phẩm
CREATE  PROCEDURE upsert_product
    @product_id VARCHAR(25),
    @name NVARCHAR(75),
    @name2 NVARCHAR(75) = NULL,
    @description NVARCHAR(1000) = NULL,
    @brand_id VARCHAR(25) = NULL,
    @category_id VARCHAR(25),
    @group_tb_1 VARCHAR(25) = NULL,
    @group_tb_2 VARCHAR(25) = NULL,
    @group_tb_3 VARCHAR(25) = NULL,
    @group_tb_4 VARCHAR(25) = NULL,
    @uom NVARCHAR(20) = NULL,
    @price1 MONEY = NULL,
    @date_apply1 DATETIME = NULL,
    @price2 MONEY = NULL,
    @date_apply2 DATETIME = NULL,
    @url_image1 VARCHAR(300) = NULL,
    @url_image2 VARCHAR(300) = NULL,
    @url_image3 VARCHAR(300) = NULL,
    @user_id VARCHAR(25),
    @status BIT = 1
AS
BEGIN
    SET NOCOUNT ON;
	IF EXISTS (SELECT 1 FROM user_tb WHERE user_id = @user_id AND (seller = 1 OR admin = 1 ))
	BEGIN
    -- Kiểm tra sản phẩm đã tồn tại
    IF EXISTS (SELECT 1 FROM product WHERE product_id = @product_id)
    BEGIN
        -- Chỉ cập nhật nếu có thay đổi
        IF EXISTS (
            SELECT 1 FROM product
            WHERE product_id = @product_id AND (
                name <> @name OR
                ISNULL(name2, '') <> ISNULL(@name2, '') OR
                ISNULL(description, '') <> ISNULL(@description, '') OR
                ISNULL(brand_id, '') <> ISNULL(@brand_id, '') OR
                category_id <> @category_id OR
                ISNULL(group_tb_1, '') <> ISNULL(@group_tb_1, '') OR
                ISNULL(group_tb_2, '') <> ISNULL(@group_tb_2, '') OR
                ISNULL(group_tb_3, '') <> ISNULL(@group_tb_3, '') OR
                ISNULL(group_tb_4, '') <> ISNULL(@group_tb_4, '') OR
                ISNULL(uom, '') <> ISNULL(@uom, '') OR
                ISNULL(price1, 0) <> ISNULL(@price1, 0) OR
                ISNULL(date_apply1, '') <> ISNULL(@date_apply1, '') OR
                ISNULL(price2, 0) <> ISNULL(@price2, 0) OR
                ISNULL(date_apply2, '') <> ISNULL(@date_apply2, '') OR
                ISNULL(url_image1, '') <> ISNULL(@url_image1, '') OR
                ISNULL(url_image2, '') <> ISNULL(@url_image2, '') OR
                ISNULL(url_image3, '') <> ISNULL(@url_image3, '') OR
                user_id <> @user_id OR
                status <> @status
            )
        )
        BEGIN
            UPDATE product
            SET 
                name = @name,
                name2 = @name2,
                description = @description,
                brand_id = @brand_id,
                category_id = @category_id,
                group_tb_1 = @group_tb_1,
                group_tb_2 = @group_tb_2,
                group_tb_3 = @group_tb_3,
                group_tb_4 = @group_tb_4,
                uom = @uom,
                price1 = @price1,
                date_apply1 = @date_apply1,
                price2 = @price2,
                date_apply2 = @date_apply2,
                url_image1 = @url_image1,
                url_image2 = @url_image2,
                url_image3 = @url_image3,
                user_id = @user_id,
                status = @status
            WHERE product_id = @product_id;
        END
    END
    ELSE
    BEGIN
        -- Thêm mới sản phẩm
        INSERT INTO product (
            product_id, name, name2, description, brand_id, category_id,
            group_tb_1, group_tb_2, group_tb_3, group_tb_4, uom,
            price1, date_apply1, price2, date_apply2,
            url_image1, url_image2, url_image3,
            user_id, status
        )
        VALUES (
            @product_id, @name, @name2, @description, @brand_id, @category_id,
            @group_tb_1, @group_tb_2, @group_tb_3, @group_tb_4, @uom,
            @price1, @date_apply1, @price2, @date_apply2,
            @url_image1, @url_image2, @url_image3,
            @user_id, @status
        );
    END
END
BEGIN
        RAISERROR(N'Bạn không phải người bán hoặc không đúng người bán của sản phẩm.', 16, 1);
    END
END
 GO






---------Tao, sửa promotion và gán promotion theo nhiều sản phẩm, nhóm, category, brand (cách nhàu dấu ',')

CREATE PROCEDURE upsert_promotion_and_assign
    @promotion_id VARCHAR(25),
    @promotion_name NVARCHAR(75),
    @promotion_name2 NVARCHAR(75) = NULL,
    @type INT,
    @calculate INT,
    @date_start DATE,
    @date_end DATE = NULL,
    @value NUMERIC,
    @quantity INT,
    @description NVARCHAR(1000) = NULL,
    @quan_cond INT = NULL,
    @val_cond MONEY = NULL,
    @oder_tb_cond INT = NULL,
    @group_tb_cond VARCHAR(25) = NULL,
    @rank_cond INT = NULL,
    @status BIT = 1,
    @user_id int,
    @list_product_ids NVARCHAR(MAX) = '',
    @list_category_ids NVARCHAR(MAX) = '',
    @list_brand_ids NVARCHAR(MAX) = '',
    @list_group_ids NVARCHAR(MAX) = ''
AS
BEGIN
    SET NOCOUNT ON;
	IF EXISTS (SELECT 1 FROM user_tb WHERE user_id = @user_id AND (seller = 1 OR admin = 1 ))
	BEGIN
    -- Kiểm tra tồn tại
    IF EXISTS (SELECT 1 FROM promotion WHERE promotion_id = @promotion_id)
    BEGIN
        -- Chỉ cập nhật khi có thay đổi
        IF EXISTS (
            SELECT 1 FROM promotion
            WHERE promotion_id = @promotion_id AND (
                promotion_name     <> @promotion_name OR
                ISNULL(promotion_name2, '') <> ISNULL(@promotion_name2, '') OR
                type           <> @type OR
                calculate         <> @calculate OR
                date_start        <> @date_start OR
                ISNULL(date_end, '') <> ISNULL(@date_end, '') OR
                value           <> @value OR
                quantity       <> @quantity OR
                ISNULL(description, '') <> ISNULL(@description, '') OR
                ISNULL(quan_cond, 0) <> ISNULL(@quan_cond, 0) OR
                ISNULL(val_cond, 0) <> ISNULL(@val_cond, 0) OR
                ISNULL(oder_tb_cond, 0) <> ISNULL(@oder_tb_cond, 0) OR
                ISNULL(group_tb_cond, '') <> ISNULL(@group_tb_cond, '') OR
                ISNULL(rank_cond, 0) <> ISNULL(@rank_cond, 0) OR
                status          <> @status
            )
        )
        BEGIN
            UPDATE promotion
            SET 
                promotion_name = @promotion_name,
                promotion_name2 = @promotion_name2,
                type = @type,
                calculate = @calculate,
                date_start = @date_start,
                date_end = @date_end,
                value = @value,
                quantity = @quantity,
                description = @description,
                quan_cond = @quan_cond,
                val_cond = @val_cond,
                oder_tb_cond = @oder_tb_cond,
                group_tb_cond = @group_tb_cond,
                rank_cond = @rank_cond,
                status = @status
            WHERE promotion_id = @promotion_id;
        END
    END
    ELSE
    BEGIN
        INSERT INTO promotion (
            promotion_id, promotion_name, promotion_name2, type, calculate, date_created, date_start, date_end,
           value, quantity, description, quan_cond, val_cond, oder_tb_cond, group_tb_cond, rank_cond, status
        )
        VALUES (
            @promotion_id, @promotion_name, @promotion_name2, @type, @calculate, GETDATE(), @date_start, @date_end,
            @value, @quantity, @description, @quan_cond, @val_cond, @oder_tb_cond, @group_tb_cond, @rank_cond, @status
        );
    END

    ---------------------------
    -- Xoá & Gán lại promotion_product
    ---------------------------
    DELETE FROM promotion_product WHERE promotion_id = @promotion_id;

    -- Gán theo sản phẩm
    INSERT INTO promotion_product (promotion_id, product_id)
    SELECT @promotion_id, TRIM(value)
    FROM STRING_SPLIT(@list_product_ids, ',')
    WHERE TRIM(value) <> '';

    -- Gán theo category
    INSERT INTO promotion_product (promotion_id, product_id)
    SELECT DISTINCT @promotion_id, p.product_id
    FROM product p
    JOIN STRING_SPLIT(@list_category_ids, ',') s ON p.category_id = TRIM(s.value)
    WHERE TRIM(s.value) <> '';

    -- Gán theo brand
    INSERT INTO promotion_product (promotion_id, product_id)
    SELECT DISTINCT @promotion_id, p.product_id
    FROM product p
    JOIN STRING_SPLIT(@list_brand_ids, ',') s ON p.brand_id = TRIM(s.value)
    WHERE TRIM(s.value) <> '';

    -- Gán theo group (bất kỳ group_tb_1 đến group_tb_4)
    INSERT INTO promotion_product (promotion_id, product_id)
    SELECT DISTINCT @promotion_id, p.product_id
    FROM product p
    JOIN STRING_SPLIT(@list_group_ids, ',') s 
        ON TRIM(s.value) IN (p.group_tb_1, p.group_tb_2, p.group_tb_3, p.group_tb_4)
    WHERE TRIM(s.value) <> '';
END
BEGIN
        RAISERROR(N'Bạn không phải admin, không có quyền thêm promotion.', 16, 1);
    END
END











GO
----Thêm/ sửa nhập sản phẩm
CREATE  PROCEDURE upsert_product_in
    @pi_id VARCHAR(25),
    @product_id VARCHAR(25),
    @date_created DATETIME,
    @date_start DATETIME = NULL,
    @date_end DATETIME = NULL,
    @name NVARCHAR(75),
    @name2 NVARCHAR(75) = NULL,
    @quantity INT,
    @cost MONEY,
	@user_id int
AS
BEGIN
    SET NOCOUNT ON;
	IF EXISTS (SELECT 1 FROM user_tb WHERE user_id = @user_id AND (seller = 1 OR admin = 1 ))
	BEGIN
    -- Kiểm tra số lượng nhập > 0
    IF @quantity <= 0
    BEGIN
        RAISERROR(N'Số lượng nhập phải lớn hơn 0.', 16, 1);
        RETURN;
    END

    -- Kiểm tra sản phẩm còn hoạt động
    IF EXISTS (
        SELECT 1 FROM product p LEFT JOIN brand b ON p.brand_id = b.brand_id
        WHERE product_id = @product_id AND p.status = 1 AND b.status = 1
    )
    BEGIN
        -- Nếu tồn tại pi_id thì update khi có thay đổi
        IF EXISTS (SELECT 1 FROM product_in WHERE pi_id = @pi_id)
        BEGIN
            IF EXISTS (
                SELECT 1 FROM product_in
                WHERE pi_id = @pi_id AND (
                    product_id <> @product_id OR
                    date_created <> @date_created OR
                    ISNULL(date_start, '') <> ISNULL(@date_start, '') OR
                    ISNULL(date_end, '') <> ISNULL(@date_end, '') OR
                    name <> @name OR
                    ISNULL(name2, '') <> ISNULL(@name2, '') OR
                    quantity <> @quantity OR
                    cost <> @cost
                )
            )
            BEGIN
                UPDATE product_in
                SET 
                    product_id = @product_id,
                    date_created = @date_created,
                    date_start = @date_start,
                    date_end = @date_end,
                    name = @name,
                    name2 = @name2,
                    quantity = @quantity,
                    cost = @cost
                WHERE pi_id = @pi_id;
            END
        END
        ELSE
        BEGIN
            -- Thêm mới
		DECLARE @pi_seq int;
			 -- Sinh mã đơn hàng
        SELECT @pi_seq = ISNULL(MAX(CAST(RIGHT(@pi_id, 5) AS INT)), 0) + 1
        FROM product
        WHERE @pi_id LIKE 'ORD' + FORMAT(GETDATE(), 'yyyyMMdd') + '%';

        SET @pi_id = CONCAT('ORD', FORMAT(GETDATE(), 'yyyyMMdd'), RIGHT('00000' + CAST(@pi_seq AS VARCHAR), 5));

            INSERT INTO product_in (
                pi_id, product_id, date_created, date_start, date_end,
                name, name2, quantity, cost
            )
            VALUES (
                @pi_id, @product_id, @date_created, @date_start, @date_end,
                @name, @name2, @quantity, @cost
            );
        END
    END
    ELSE
    BEGIN
        RAISERROR(N'Sản phẩm không còn hoạt động hoặc không tồn tại.', 16, 1);
    END
END
BEGIN
        RAISERROR(N'Bạn không phải người bán hoặc không đúng người bán sản phẩm.', 16, 1);
    END
END
Go





------- Thêm, sản phẩm vào giỏ hàng
CREATE  PROCEDURE add_to_cart
    @user_id INT,
    @product_id VARCHAR(25),
    @product_name NVARCHAR(75),
    @quantity INT,
    @price MONEY
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra quantity hợp lệ
    IF @quantity <= 0
    BEGIN
        RAISERROR('Số lượng phải lớn hơn 0.', 16, 1);
        RETURN;
    END

    -- Nếu sản phẩm đã có trong giỏ → cộng số lượng và cập nhật giá
    IF EXISTS (
        SELECT 1 FROM cart 
        WHERE user_id = @user_id AND product_id = @product_id
    )
    BEGIN
        UPDATE cart
        SET 
            quantity = quantity + @quantity,
            price = @price,
            product_name = @product_name
        WHERE user_id = @user_id AND product_id = @product_id;
    END
    ELSE
    BEGIN
        -- Thêm mới vào giỏ
        INSERT INTO cart (
            user_id, product_id, product_name, quantity, price
        ) VALUES (
            @user_id, @product_id, @product_name, @quantity, @price
        );
    END
END

GO


----- Thêm wishlist

CREATE  PROCEDURE add_to_wishlist
    @user_id INT,
    @product_id VARCHAR(25),
    @product_name VARCHAR(25),
    @product_description NVARCHAR(1000)
AS
BEGIN
    SET NOCOUNT ON;

    -- Chỉ thêm nếu chưa tồn tại
    IF NOT EXISTS (
        SELECT 1 FROM wishlist
        WHERE user_id = @user_id AND product_id = @product_id
    )
    BEGIN
        INSERT INTO wishlist (
            user_id, product_id, product_name, product_description
        )
        VALUES (
            @user_id, @product_id, @product_name, @product_description
        );
    END
END


GO



------ Thêm, sửa rating kiểm tra theo người dùng đã mua hàng
CREATE  PROCEDURE upsert_rating
    @product_id VARCHAR(25),
    @user_id INT,
    @rate INT,
    @description NVARCHAR(1000)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra xem user đã từng mua sản phẩm hay chưa
    IF EXISTS (
        SELECT 1
        FROM order_tb o
        JOIN order_d od ON o.order_id = od.order_id
        WHERE o.buyer = @user_id
          AND od.product_id = @product_id
    )
    BEGIN
        -- Nếu đã tồn tại đánh giá thì cập nhật
        IF EXISTS (
            SELECT 1 FROM rating
            WHERE product_id = @product_id AND user_id = @user_id
        )
        BEGIN
            UPDATE rating
            SET rate = @rate,
                description = @description,
                date_created = GETDATE()
            WHERE product_id = @product_id AND user_id = @user_id;

            PRINT N'Cập nhật đánh giá thành công.';
        END
        ELSE
        BEGIN
            -- Nếu chưa có thì thêm mới
            INSERT INTO rating (
                product_id, user_id, date_created, rate, description
            )
            VALUES (
                @product_id, @user_id, GETDATE(), @rate, @description
            );

            PRINT N'Thêm đánh giá mới thành công.';
        END
    END
    ELSE
    BEGIN
        PRINT N'Bạn chưa từng mua sản phẩm này nên không thể đánh giá.';
    END
END





GO 
-----Thêm mới câu hỏi trợ giúp
CREATE PROCEDURE upsert_support
    @support_id VARCHAR(25),
    @user_ask INT,
    @ask NVARCHAR(1000) = NULL,
    @product_id VARCHAR(25) = NULL,
    @order_id VARCHAR(25) = NULL,
    @user_answer INT = NULL,
    @answer NVARCHAR(1000) = NULL,
    @support_in VARCHAR(25) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM support WHERE support_id = @support_id)
    BEGIN
        -- Cập nhật thông tin trả lời
        UPDATE support
        SET 
            user_answer = @user_answer,
            answer = @answer,
            date_answer = GETDATE()
        WHERE support_id = @support_id;

        PRINT N'Cập nhật trả lời hỗ trợ thành công.';
    END
    ELSE
    BEGIN
        -- Thêm mới câu hỏi
        INSERT INTO support (
            support_id, user_ask, ask, date_ask, 
            product_id, order_id, support_in
        )
        VALUES (
            @support_id, @user_ask, @ask, GETDATE(),
            @product_id, @order_id, @support_in
        );

        PRINT N'Thêm yêu cầu hỗ trợ mới thành công.';
    END
END

GO




------ Tạo/ sửa nhóm chat và thêm người
CREATE  PROCEDURE upsert_chat_and_add_users_from_string
    @chat_id VARCHAR(25),
    @chat_name NVARCHAR(75),
    @chat_date_created DATETIME,
    @user_id_string NVARCHAR(MAX) -- ví dụ: '1,2,3'
AS
BEGIN
    SET NOCOUNT ON;

    -- Tạo hoặc cập nhật chat_tab
    IF NOT EXISTS (SELECT 1 FROM chat_tab WHERE chat_id = @chat_id)
    BEGIN
        INSERT INTO chat_tab (chat_id, name, date_created)
        VALUES (@chat_id, @chat_name, @chat_date_created);
    END
    ELSE
    BEGIN
        UPDATE chat_tab
        SET name = @chat_name
        WHERE chat_id = @chat_id AND (name IS NULL OR name != @chat_name);
    END

    -- Tách user_id từ chuỗi
    ;WITH ParsedUsers AS (
        SELECT 
            TRY_CAST(value AS INT) AS user_id
        FROM STRING_SPLIT(@user_id_string, ',')
        WHERE TRY_CAST(value AS INT) IS NOT NULL
    )
    INSERT INTO chat_member (member_name, user_id, chat_id, date_joined)
    SELECT 
        ISNULL(ut.name, ut.name2),
        pu.user_id,
        @chat_id,
        GETDATE()
    FROM ParsedUsers pu
    JOIN user_tb2 ut ON pu.user_id = ut.user_id
    WHERE NOT EXISTS (
        SELECT 1 
        FROM chat_member cm 
        WHERE cm.user_id = pu.user_id AND cm.chat_id = @chat_id
    );
END



GO
----Thêm/ sủa thành viên nhóm chat
CREATE  PROCEDURE upsert_chat_members_from_string
    @chat_id VARCHAR(25),
    @user_id_string NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra nếu chat_id không tồn tại
    IF NOT EXISTS (SELECT 1 FROM chat_tab WHERE chat_id = @chat_id)
    BEGIN
        RAISERROR(N'Chat_id không tồn tại.', 16, 1);
        RETURN;
    END

    -- Tách user_id từ chuỗi
    ;WITH ParsedUserIds AS (
        SELECT TRY_CAST(value AS INT) AS user_id
        FROM STRING_SPLIT(@user_id_string, ',')
        WHERE TRY_CAST(value AS INT) IS NOT NULL
    )

    -- Chèn thành viên mới nếu chưa có
    INSERT INTO chat_member ( member_name, user_id, chat_id, date_joined)
    SELECT 
        ISNULL(ut.name, ut.name2),
        u.user_id,
        @chat_id,
        GETDATE()
    FROM ParsedUserIds u
    JOIN user_tb2 ut ON u.user_id = ut.user_id
    WHERE NOT EXISTS (
        SELECT 1 FROM chat_member cm
        WHERE cm.user_id = u.user_id AND cm.chat_id = @chat_id
    );

    -- Cập nhật tên nếu thay đổi
    UPDATE cm
    SET 
        member_name = ISNULL(ut.name, ut.name2)
    FROM chat_member cm
    JOIN user_tb2 ut ON cm.user_id = ut.user_id
    WHERE 
        cm.chat_id = @chat_id
        AND cm.member_name != ISNULL(ut.name, ut.name2);

END

GO


-----Thêm sửa tin nhắn

CREATE PROCEDURE upsert_chat_message
    @chat_rec INT = NULL,              -- NULL: thêm mới | Có giá trị: cập nhật
    @member_send INT,                 -- Thành viên gửi
    @msg_txt NVARCHAR(MAX),          -- Nội dung tin nhắn
    @chat_reply INT = NULL,          -- ID tin nhắn được phản hồi
    @member_reply INT = NULL,        -- ID thành viên được phản hồi
    @pin BIT = 0,                    -- Có ghim hay không
    @isRead BIT = 0                  -- Đã đọc hay chưa
AS
BEGIN
    SET NOCOUNT ON;

    IF @chat_rec IS NULL
    BEGIN
        -- Thêm tin nhắn mới
        INSERT INTO chat_detail (
            member_send,
            name_send,
            msg_txt,
            date_created,
            chat_reply,
            member_reply,
            isRead,
            pin
        )
        VALUES (
            @member_send,
            @member_send, -- name_send tạm thời đặt là member_send (có thể thay đổi nếu có bảng mapping)
            @msg_txt,
            GETDATE(),
            @chat_reply,
            @member_reply,
            @isRead,
            @pin
        );
    END
    ELSE
    BEGIN
        -- Kiểm tra điều kiện hợp lệ và sự thay đổi dữ liệu
        IF EXISTS (
            SELECT 1
            FROM chat_detail
            WHERE 
                chat_rec = @chat_rec
                AND member_send = @member_send
                AND DATEDIFF(MINUTE, date_created, GETDATE()) <= 10
        )
        BEGIN
            UPDATE chat_detail
            SET 
                msg_txt = @msg_txt
            WHERE chat_rec = @chat_rec;
        END
        ELSE
        BEGIN
            RAISERROR(N'Không thể sửa: dữ liệu không thay đổi hoặc vượt quá thời gian 10 phút.', 16, 1);
        END
    END
END



Go




--- Cập nhật trạng thái đọc, pin
CREATE PROCEDURE sp_update_chat_flag
	@chat_rec INT, -- ID của tin nhắn cần cập nhật
	@new_isRead BIT = NULL, -- Trạng thái đã đọc mới (NULL nếu không cập nhật)
	@new_pin BIT = NULL -- Trạng thái ghim mới (NULL nếu không cập nhật)
AS
BEGIN
SET NOCOUNT ON;


    UPDATE chat_detail
    SET 
        isRead = CASE 
                    WHEN @new_isRead IS NOT NULL THEN @new_isRead 
                    ELSE isRead 
                END,
        pin = CASE 
                  WHEN @new_pin IS NOT NULL THEN @new_pin 
                  ELSE pin 
              END
    WHERE chat_rec = @chat_rec;

END
GO



------------ Tạo đơn hàng, tính giá theo FIFO nhập trước xuát trước, từ giỏ hàng

CREATE PROCEDURE sp_CreateOrder_FIFO
    @buyer INT,
    @seller INT,
    @description NVARCHAR(1000) = NULL,
    @pro_saleoff VARCHAR(25) = NULL,
    @pro_new VARCHAR(25) = NULL,
    @pro_discount VARCHAR(25) = NULL,
    @pro_ship VARCHAR(25) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @order_id VARCHAR(25), @order_seq INT;
    DECLARE @rank INT;

    BEGIN TRY
        BEGIN TRAN;

        IF NOT EXISTS (SELECT 1 FROM cart WHERE user_id = @buyer)
        BEGIN
            RAISERROR(N'Giỏ hàng trống. Không thể tạo đơn hàng.', 16, 1);
            ROLLBACK;
            RETURN;
        END;

        SELECT @rank = rank FROM user_tb WHERE user_id = @buyer;

        -- Dữ liệu tạm từ cart
        DECLARE @tbl_cart TABLE(product_id VARCHAR(25), quantity INT, price MONEY);
        INSERT INTO @tbl_cart(product_id, quantity, price)
        SELECT product_id, quantity, price FROM cart WHERE user_id = @buyer;

        -- Kiểm tra khuyến mãi
        DECLARE @pro_list TABLE(promotion_id VARCHAR(25));
        INSERT INTO @pro_list(promotion_id)
        SELECT val FROM (VALUES (@pro_saleoff), (@pro_new), (@pro_discount), (@pro_ship)) AS x(val)
        WHERE val IS NOT NULL;

        DECLARE @pid VARCHAR(25);
        DECLARE pro_cursor CURSOR FOR SELECT promotion_id FROM @pro_list;
        OPEN pro_cursor;
        FETCH NEXT FROM pro_cursor INTO @pid;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            DECLARE @quan_cond INT, @val_cond MONEY, @oder_tb_cond INT, @group_tb_cond VARCHAR(25), @rank_cond INT, @pro_qty INT;

            SELECT 
                @quan_cond = quan_cond, @val_cond = val_cond, @oder_tb_cond = oder_tb_cond,
                @group_tb_cond = group_tb_cond, @rank_cond = rank_cond,
                @pro_qty = quantity
            FROM promotion WHERE promotion_id = @pid;

            IF @pro_qty IS NOT NULL AND @pro_qty > 0
            BEGIN
                DECLARE @used_qty_promotion INT = (
                    SELECT COUNT(*) FROM order_tb
                    WHERE pro_saleoff = @pid OR pro_new = @pid OR pro_discount = @pid OR pro_ship = @pid
                );

                IF @used_qty_promotion >= @pro_qty
                BEGIN
                    RAISERROR(N'Mã khuyến mãi %s đã hết lượt sử dụng.', 16, 1, @pid);
                    CLOSE pro_cursor; DEALLOCATE pro_cursor;
                    ROLLBACK;
                    RETURN;
                END
            END

            DECLARE @total_qty INT = 0, @total_val MONEY = 0;

            SELECT 
                @total_qty = SUM(c.quantity),
                @total_val = SUM(c.quantity * c.price)
            FROM @tbl_cart c
            WHERE EXISTS (
                SELECT 1 FROM promotion_product pp WHERE pp.promotion_id = @pid AND pp.product_id = c.product_id
            )
            AND (
                @group_tb_cond IS NULL
                OR EXISTS (
                    SELECT 1 FROM product p
                    WHERE p.product_id = c.product_id
                    AND (@group_tb_cond = p.group_tb_1 OR @group_tb_cond = p.group_tb_2 OR @group_tb_cond = p.group_tb_3 OR @group_tb_cond = p.group_tb_4)
                )
            );

            DECLARE @order_count INT = (SELECT COUNT(*) FROM order_tb WHERE buyer = @buyer);

            IF (@quan_cond IS NOT NULL AND @total_qty < @quan_cond)
                OR (@val_cond IS NOT NULL AND @total_val < @val_cond)
                OR (@oder_tb_cond IS NOT NULL AND @order_count >= @oder_tb_cond)
                OR (@rank_cond IS NOT NULL AND @rank < @rank_cond)
            BEGIN
                RAISERROR(N'Không đủ điều kiện áp dụng mã khuyến mãi %s.', 16, 1, @pid);
                CLOSE pro_cursor; DEALLOCATE pro_cursor;
                ROLLBACK;
                RETURN;
            END

            FETCH NEXT FROM pro_cursor INTO @pid;
        END

        CLOSE pro_cursor; DEALLOCATE pro_cursor;

        -- Sinh mã đơn hàng
        SELECT @order_seq = ISNULL(MAX(CAST(RIGHT(order_id, 5) AS INT)), 0) + 1
        FROM order_tb WHERE order_id LIKE 'ORD' + FORMAT(GETDATE(), 'yyyyMMdd') + '%';

        SET @order_id = CONCAT('ORD', FORMAT(GETDATE(), 'yyyyMMdd'), RIGHT('00000' + CAST(@order_seq AS VARCHAR), 5));

        -- Ghi đơn hàng
        INSERT INTO order_tb(order_id, date_created, buyer, seller, description, pro_saleoff, pro_new, pro_discount, pro_ship)
        VALUES (@order_id, GETDATE(), @buyer, @seller, @description, @pro_saleoff, @pro_new, @pro_discount, @pro_ship);

        -- FIFO từng sản phẩm
        DECLARE cur CURSOR FOR SELECT product_id, quantity, price FROM @tbl_cart;
        DECLARE @product_id VARCHAR(25), @quantity INT, @price MONEY;
        OPEN cur;
        FETCH NEXT FROM cur INTO @product_id, @quantity, @price;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            DECLARE @pro_status BIT;
            SELECT @pro_status = status FROM product WHERE product_id = @product_id;
            IF @pro_status <> 1
            BEGIN
                CLOSE cur; DEALLOCATE cur;
                RAISERROR(N'Sản phẩm không còn bán: %s', 16, 1, @product_id);
                ROLLBACK;
                RETURN;
            END;

            DECLARE fifo_cur CURSOR FOR
            SELECT pi_id, quantity, cost FROM product_in
            WHERE product_id = @product_id
            ORDER BY date_start;

            DECLARE @pi_id VARCHAR(25), @pi_qty INT, @pi_cost MONEY;
            DECLARE @qty_need INT = @quantity, @qty_available INT;

            OPEN fifo_cur;
            FETCH NEXT FROM fifo_cur INTO @pi_id, @pi_qty, @pi_cost;

            WHILE @@FETCH_STATUS = 0 AND @qty_need > 0
            BEGIN
                SELECT @qty_available = @pi_qty - ISNULL((
                    SELECT SUM(od.quantity) FROM order_d od 
                    WHERE od.pi_id = @pi_id AND od.product_id = @product_id
                ), 0);

                IF @qty_available > 0
                BEGIN
                    DECLARE @take_qty INT = CASE WHEN @qty_available >= @qty_need THEN @qty_need ELSE @qty_available END;

                    INSERT INTO order_d(order_id, product_id, pi_id, quantity, cost, price)
                    VALUES (@order_id, @product_id, @pi_id, @take_qty, @pi_cost, @price);

                    SET @qty_need -= @take_qty;
                END;

                FETCH NEXT FROM fifo_cur INTO @pi_id, @pi_qty, @pi_cost;
            END;

            CLOSE fifo_cur; DEALLOCATE fifo_cur;

            IF @qty_need > 0
            BEGIN
                CLOSE cur; DEALLOCATE cur;
                RAISERROR(N'Lỗi: Sản phẩm %s không đủ tồn kho theo FIFO.', 16, 1, @product_id);
                ROLLBACK;
                RETURN;
            END

            DELETE FROM cart WHERE user_id = @buyer AND product_id = @product_id;
            FETCH NEXT FROM cur INTO @product_id, @quantity, @price;
        END

        CLOSE cur; DEALLOCATE cur;
        COMMIT;
        PRINT N'Đơn hàng đã được tạo thành công: ' + @order_id;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        DECLARE @Err NVARCHAR(1000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END


go








------Cập nhật trạng thái đơn hàng, ghi chú
CREATE  PROCEDURE sp_UpdateOrderStatus
    @order_id VARCHAR(25),
    @new_status INT = NULL,
    @new_description NVARCHAR(1000) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Kiểm tra đơn hàng có tồn tại không
        IF NOT EXISTS (SELECT 1 FROM order_tb WHERE order_id = @order_id)
        BEGIN
            RAISERROR(N'Không tìm thấy đơn hàng với mã: %s', 16, 1, @order_id);
            RETURN;
        END;

        -- Lấy trạng thái và mô tả hiện tại
        DECLARE @current_status INT;
        DECLARE @current_description NVARCHAR(1000);

        SELECT 
            @current_status = status,
            @current_description = description
        FROM order_tb
        WHERE order_id = @order_id;

        -- Chỉ cập nhật nếu có thay đổi
        IF @new_status IS NOT NULL AND @new_status <> @current_status
        BEGIN
            UPDATE order_tb
            SET status = @new_status
            WHERE order_id = @order_id;

            PRINT N'Đã cập nhật trạng thái đơn hàng.';
        END;

        IF @new_description IS NOT NULL AND @new_description <> @current_description
        BEGIN
            UPDATE order_tb
            SET description = @new_description
            WHERE order_id = @order_id;

            PRINT N'Đã cập nhật mô tả đơn hàng.';
        END;

        IF (@new_status = @current_status OR @new_status IS NULL)
           AND (@new_description = @current_description OR @new_description IS NULL)
        BEGIN
            PRINT N'Không có thay đổi để cập nhật.';
        END;
    END TRY
    BEGIN CATCH
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END





GO


--------Tạo đơn hàng từ đơn hàng có sẵn

GO
CREATE PROCEDURE sp_CloneOrderWithFifo
    @source_order_id VARCHAR(25),
    @pro_saleoff VARCHAR(25) = NULL,
    @pro_new VARCHAR(25) = NULL,
    @pro_discount VARCHAR(25) = NULL,
    @pro_ship VARCHAR(25) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @new_order_id VARCHAR(25), @order_seq INT;
    DECLARE @buyer INT, @seller INT, @description NVARCHAR(1000), @rank INT;

    BEGIN TRY
        BEGIN TRAN;

        -- Lấy thông tin đơn hàng gốc
        SELECT @buyer = buyer, @seller = seller, @description = description
        FROM order_tb WHERE order_id = @source_order_id;

        IF @buyer IS NULL
        BEGIN
            RAISERROR(N'Không tìm thấy đơn hàng nguồn %s.', 16, 1, @source_order_id);
            ROLLBACK;
            RETURN;
        END

        SELECT @rank = rank FROM user_tb WHERE user_id = @buyer;

        -- Tạo mã đơn hàng mới
        SELECT @order_seq = ISNULL(MAX(CAST(RIGHT(order_id, 5) AS INT)), 0) + 1
        FROM order_tb WHERE order_id LIKE 'ORD' + FORMAT(GETDATE(), 'yyyyMMdd') + '%';

        SET @new_order_id = CONCAT('ORD', FORMAT(GETDATE(), 'yyyyMMdd'), RIGHT('00000' + CAST(@order_seq AS VARCHAR), 5));

        -- Clone chi tiết đơn hàng gốc và tính tổng quantity/price của sản phẩm áp khuyến mãi
        DECLARE @tbl_order_d TABLE(product_id VARCHAR(25), quantity INT, price MONEY);
        INSERT INTO @tbl_order_d(product_id, quantity, price)
        SELECT product_id, quantity, price FROM order_d WHERE order_id = @source_order_id;

        -- Hàm kiểm tra điều kiện khuyến mãi
        DECLARE @pro_list TABLE(promotion_id VARCHAR(25));
        INSERT INTO @pro_list(promotion_id)
        SELECT val FROM (VALUES (@pro_saleoff), (@pro_new), (@pro_discount), (@pro_ship)) AS x(val)
        WHERE val IS NOT NULL;

        DECLARE @pid VARCHAR(25);
        DECLARE pro_cursor CURSOR FOR SELECT promotion_id FROM @pro_list;
        OPEN pro_cursor;
        FETCH NEXT FROM pro_cursor INTO @pid;

               WHILE @@FETCH_STATUS = 0
        BEGIN
            DECLARE @quan_cond INT, @val_cond MONEY, @oder_tb_cond INT, @group_tb_cond VARCHAR(25), @rank_cond INT, @pro_qty INT;
            SELECT 
                @quan_cond = quan_cond, @val_cond = val_cond, @oder_tb_cond = oder_tb_cond,
                @group_tb_cond = group_tb_cond, @rank_cond = rank_cond,
                @pro_qty = quantity
            FROM promotion WHERE promotion_id = @pid;

            --  Kiểm tra tồn kho khuyến mãi (quantity = 0 là không giới hạn)
            IF @pro_qty IS NOT NULL AND @pro_qty > 0
            BEGIN
                DECLARE @used_qty_promotion INT = (
                    SELECT COUNT(*) FROM order_tb
                    WHERE pro_saleoff = @pid OR pro_new = @pid OR pro_discount = @pid OR pro_ship = @pid
                );

                IF  @used_qty_promotion >= @pro_qty
                BEGIN
                    RAISERROR(N'Mã khuyến mãi %s đã hết lượt sử dụng.', 16, 1, @pid);
                    CLOSE pro_cursor; DEALLOCATE pro_cursor;
                    ROLLBACK;
                    RETURN;
                END
            END


            -- Tính tổng số lượng và tổng giá trị sản phẩm thuộc khuyến mãi
            DECLARE @total_qty INT = 0, @total_val MONEY = 0;

            SELECT 
                @total_qty = SUM(d.quantity),
                @total_val = SUM(d.price * d.quantity)
            FROM @tbl_order_d d
            WHERE EXISTS (
                SELECT 1 FROM promotion_product pp 
                WHERE pp.promotion_id = @pid AND pp.product_id = d.product_id
            )
            AND (
                @group_tb_cond IS NULL
                OR EXISTS (
                    SELECT 1 FROM group_tb g INNER JOIN product p ON g.group_tb_id = p.group_tb_1 OR g.group_tb_id = p.group_tb_2 OR g.group_tb_id = p.group_tb_3 OR g.group_tb_id = p.group_tb_4
                    WHERE d.product_id = d.product_id AND @group_tb_cond = g.group_tb_id
                )
            );

            -- Kiểm tra số đơn hàng của người mua
            DECLARE @order_count INT = (
                SELECT COUNT(*) FROM order_tb WHERE buyer = @buyer
            );

            IF (@quan_cond IS NOT NULL AND @total_qty < @quan_cond)
                OR (@val_cond IS NOT NULL AND @total_val < @val_cond)
                OR (@oder_tb_cond IS NOT NULL AND @order_count >= @oder_tb_cond)
                OR (@rank_cond IS NOT NULL AND @rank < @rank_cond)
            BEGIN
                RAISERROR(N'Không đủ điều kiện áp dụng mã khuyến mãi %s.', 16, 1, @pid);
                CLOSE pro_cursor; DEALLOCATE pro_cursor;
                ROLLBACK;
                RETURN;
            END

            FETCH NEXT FROM pro_cursor INTO @pid;
        END

        CLOSE pro_cursor; DEALLOCATE pro_cursor;

        -- Thêm đơn hàng mới
        INSERT INTO order_tb(order_id, date_created, buyer, seller, pro_saleoff, pro_new, pro_discount, pro_ship, description)
        VALUES (@new_order_id, GETDATE(), @buyer, @seller, @pro_saleoff, @pro_new, @pro_discount, @pro_ship, @description);

        -- Clone theo FIFO từng sản phẩm
        DECLARE cur CURSOR FOR SELECT product_id, quantity, price FROM @tbl_order_d;
        DECLARE @product_id VARCHAR(25), @quantity INT, @price MONEY;
        OPEN cur;
        FETCH NEXT FROM cur INTO @product_id, @quantity, @price;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            DECLARE @qty_needed INT = @quantity;
            DECLARE @pi_id VARCHAR(25), @available_qty INT, @cost MONEY;

            DECLARE fifo CURSOR FOR
            SELECT pi.pi_id, (pi.quantity - ISNULL(od.qty_used, 0)) AS available_qty, pi.cost
            FROM product_in pi
            LEFT JOIN (
                SELECT pi_id, SUM(quantity) AS qty_used
                FROM order_d
                WHERE product_id = @product_id
                GROUP BY pi_id
            ) od ON pi.pi_id = od.pi_id
            WHERE pi.product_id = @product_id
                AND (pi.quantity - ISNULL(od.qty_used, 0)) > 0
            ORDER BY pi.date_start;

            OPEN fifo;
            FETCH NEXT FROM fifo INTO @pi_id, @available_qty, @cost;

            WHILE @@FETCH_STATUS = 0 AND @qty_needed > 0
            BEGIN
                DECLARE @used_qty INT = CASE WHEN @qty_needed > @available_qty THEN @available_qty ELSE @qty_needed END;

                INSERT INTO order_d(order_id, product_id, pi_id, quantity, cost, price)
                VALUES (@new_order_id, @product_id, @pi_id, @used_qty, @cost, @price);

                SET @qty_needed -= @used_qty;

                FETCH NEXT FROM fifo INTO @pi_id, @available_qty, @cost;
            END

            CLOSE fifo;
            DEALLOCATE fifo;

            IF @qty_needed > 0
            BEGIN
                CLOSE cur;
                DEALLOCATE cur;
                RAISERROR(N'Tồn kho không đủ cho sản phẩm %s.', 16, 1, @product_id);
                ROLLBACK;
                RETURN;
            END

            FETCH NEXT FROM cur INTO @product_id, @quantity, @price;
        END

        CLOSE cur;
        DEALLOCATE cur;

        COMMIT;
        PRINT N'Đã tạo đơn hàng mới: ' + @new_order_id;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH

END;



GO
----Tạo đơn hàng mua ngay

CREATE  PROCEDURE sp_CreateOrder_BuyNow
    @buyer INT,
    @seller INT,
    @product_id VARCHAR(25),
    @quantity INT,
    @price MONEY,
    @description NVARCHAR(1000) = NULL,
    @pro_saleoff VARCHAR(25) = NULL,
    @pro_new VARCHAR(25) = NULL,
    @pro_discount VARCHAR(25) = NULL,
    @pro_ship VARCHAR(25) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @order_id VARCHAR(25), @order_seq INT, @rank INT;

    BEGIN TRY
        BEGIN TRAN;

        -- 1. Kiểm tra trạng thái sản phẩm
        DECLARE @pro_status BIT;
        SELECT @pro_status = status FROM product WHERE product_id = @product_id;

        IF @pro_status <> 1
        BEGIN
            RAISERROR(N'Sản phẩm không còn được bán.', 16, 1);
            ROLLBACK;
            RETURN;
        END;

        -- 2. Lấy hạng người dùng
        SELECT @rank = rank FROM user_tb WHERE user_id = @buyer;

        -- 3. Kiểm tra khuyến mãi
        DECLARE @pro_list TABLE(promotion_id VARCHAR(25));
        INSERT INTO @pro_list(promotion_id)
        SELECT val FROM (VALUES (@pro_saleoff), (@pro_new), (@pro_discount), (@pro_ship)) AS x(val)
        WHERE val IS NOT NULL;

        DECLARE @pid VARCHAR(25);
        DECLARE cur CURSOR FOR SELECT promotion_id FROM @pro_list;
        OPEN cur;
        FETCH NEXT FROM cur INTO @pid;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            DECLARE @quan_cond INT, @val_cond MONEY, @oder_tb_cond INT, @group_tb_cond VARCHAR(25), @rank_cond INT, @pro_qty INT;

            SELECT 
                @quan_cond = quan_cond, @val_cond = val_cond,
                @oder_tb_cond = oder_tb_cond, @group_tb_cond = group_tb_cond,
                @rank_cond = rank_cond, @pro_qty = quantity
            FROM promotion WHERE promotion_id = @pid;

            -- Số lượt đã dùng
            IF @pro_qty IS NOT NULL AND @pro_qty > 0
            BEGIN
                DECLARE @used_qty_promotion INT = (
                    SELECT COUNT(*) FROM order_tb
                    WHERE pro_saleoff = @pid OR pro_new = @pid OR pro_discount = @pid OR pro_ship = @pid
                );
                IF @used_qty_promotion >= @pro_qty
                BEGIN
                    RAISERROR(N'Mã khuyến mãi %s đã hết lượt sử dụng.', 16, 1, @pid);
                    CLOSE cur; DEALLOCATE cur;
                    ROLLBACK;
                    RETURN;
                END
            END

            -- Kiểm tra điều kiện khuyến mãi
            DECLARE @total_qty INT = @quantity;
            DECLARE @total_val MONEY = @quantity * @price;

            IF NOT EXISTS (SELECT 1 FROM promotion_product WHERE promotion_id = @pid AND product_id = @product_id)
            BEGIN
                RAISERROR(N'Sản phẩm không nằm trong khuyến mãi %s.', 16, 1, @pid);
                CLOSE cur; DEALLOCATE cur;
                ROLLBACK;
                RETURN;
            END;

            IF @group_tb_cond IS NOT NULL
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM product 
                    WHERE product_id = @product_id
                    AND (@group_tb_cond = group_tb_1 OR @group_tb_cond = group_tb_2 OR @group_tb_cond = group_tb_3 OR @group_tb_cond = group_tb_4)
                )
                BEGIN
                    RAISERROR(N'Sản phẩm không thuộc nhóm khuyến mãi %s.', 16, 1, @pid);
                    CLOSE cur; DEALLOCATE cur;
                    ROLLBACK;
                    RETURN;
                END
            END

            IF (@quan_cond IS NOT NULL AND @total_qty < @quan_cond)
                OR (@val_cond IS NOT NULL AND @total_val < @val_cond)
                OR (@oder_tb_cond IS NOT NULL AND (
                        SELECT COUNT(*) FROM order_tb WHERE buyer = @buyer
                    ) >= @oder_tb_cond)
                OR (@rank_cond IS NOT NULL AND @rank < @rank_cond)
            BEGIN
                RAISERROR(N'Không đủ điều kiện khuyến mãi %s.', 16, 1, @pid);
                CLOSE cur; DEALLOCATE cur;
                ROLLBACK;
                RETURN;
            END

            FETCH NEXT FROM cur INTO @pid;
        END
        CLOSE cur; DEALLOCATE cur;

        -- 4. Tạo mã đơn hàng
        SELECT @order_seq = ISNULL(MAX(CAST(RIGHT(order_id, 5) AS INT)), 0) + 1
        FROM order_tb
        WHERE order_id LIKE 'ORD' + FORMAT(GETDATE(), 'yyyyMMdd') + '%';

        SET @order_id = CONCAT('ORD', FORMAT(GETDATE(), 'yyyyMMdd'), RIGHT('00000' + CAST(@order_seq AS VARCHAR), 5));

        -- 5. Ghi đơn hàng
        INSERT INTO order_tb(order_id, date_created, buyer, seller, description, pro_saleoff, pro_new, pro_discount, pro_ship)
        VALUES (@order_id, GETDATE(), @buyer, @seller, @description, @pro_saleoff, @pro_new, @pro_discount, @pro_ship);

        -- 6. FIFO nhập trước xuất trước
        DECLARE @qty_needed INT = @quantity;
        DECLARE @pi_id VARCHAR(25), @available_qty INT, @cost MONEY;

        DECLARE fifo CURSOR FOR
        SELECT pi.pi_id, (pi.quantity - ISNULL(od.qty_used, 0)) AS available_qty, pi.cost
        FROM product_in pi
        LEFT JOIN (
            SELECT pi_id, SUM(quantity) AS qty_used
            FROM order_d
            WHERE product_id = @product_id
            GROUP BY pi_id
        ) od ON pi.pi_id = od.pi_id
        WHERE pi.product_id = @product_id
          AND (pi.quantity - ISNULL(od.qty_used, 0)) > 0
        ORDER BY pi.date_start;

        OPEN fifo;
        FETCH NEXT FROM fifo INTO @pi_id, @available_qty, @cost;

        WHILE @@FETCH_STATUS = 0 AND @qty_needed > 0
        BEGIN
            DECLARE @used_qty INT = CASE WHEN @qty_needed > @available_qty THEN @available_qty ELSE @qty_needed END;

            INSERT INTO order_d(order_id, product_id, pi_id, quantity, cost, price)
            VALUES (@order_id, @product_id, @pi_id, @used_qty, @cost, @price);

            SET @qty_needed -= @used_qty;
            FETCH NEXT FROM fifo INTO @pi_id, @available_qty, @cost;
        END

        CLOSE fifo;
        DEALLOCATE fifo;

        IF @qty_needed > 0
        BEGIN
            RAISERROR(N'Tồn kho không đủ cho sản phẩm.', 16, 1);
            ROLLBACK;
            RETURN;
        END;

        COMMIT;
        PRINT N'Đã tạo đơn hàng mua ngay: ' + @order_id;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END

GO


------- Khi cập nhật brand.status = 0 thì cập nhật luôn product.status = 0
CREATE  PROCEDURE sp_UpdateBrandStatus
    @brand_id VARCHAR(25),
    @new_status BIT,
	@user_id int
AS
BEGIN
    SET NOCOUNT ON;
	IF EXISTS (SELECT 1 FROM user_tb WHERE user_id = @user_id AND ( admin = 1 ))
	BEGIN
    BEGIN TRY
        BEGIN TRAN;

        -- 1. Cập nhật brand
        UPDATE brand
        SET status = @new_status
        WHERE brand_id = @brand_id;

        -- 2. Nếu tắt brand thì cập nhật luôn product
        IF @new_status = 0
        BEGIN
            UPDATE product
            SET status = 0
            WHERE brand_id = @brand_id AND status <> 0;
        END

        COMMIT;
        PRINT N'Đã cập nhật trạng thái thương hiệu và sản phẩm liên quan.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;

        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END
END
GO
go
---------Khi  đổi trạng thái người dùng status = 0 hoặc seller = 0 thì cập nhật product.status = 0
CREATE  PROCEDURE sp_UpdateUserStatus
@user_id INT,
@new_status BIT = NULL, -- NULL nghĩa là không thay đổi
@new_seller BIT = NULL -- NULL nghĩa là không thay đổi
AS
BEGIN
SET NOCOUNT ON;

BEGIN TRY
    BEGIN TRAN;

    -- Lấy trạng thái hiện tại
    DECLARE @cur_status BIT, @cur_seller BIT;
    SELECT @cur_status = status, @cur_seller = seller
    FROM user_tb WHERE user_id = @user_id;

    -- Cập nhật nếu có thay đổi
    UPDATE user_tb
    SET
        status = ISNULL(@new_status, status),
        seller = ISNULL(@new_seller, seller)
    WHERE user_id = @user_id;

    -- Nếu status = 0 hoặc seller = 0 thì cập nhật các sản phẩm về status = 0
    IF (ISNULL(@new_status, @cur_status) = 0 OR ISNULL(@new_seller, @cur_seller) = 0)
    BEGIN
        UPDATE product
        SET status = 0
        WHERE user_id = @user_id AND status <> 0;
    END

    COMMIT;
    PRINT N'Đã cập nhật trạng thái người dùng và sản phẩm liên quan (nếu cần).';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK;
    DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR(@Err, 16, 1);
END CATCH


END



Go
-----Store cập nhật số lượng sản phẩm trong giỏ hàng
CREATE  PROCEDURE sp_UpdateCartQuantity
@user_id INT,
@product_id VARCHAR(25),
@new_quantity INT
AS
BEGIN
SET NOCOUNT ON;
	BEGIN TRY
    -- Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    IF EXISTS (
        SELECT 1
        FROM cart
        WHERE user_id = @user_id AND product_id = @product_id
    )
    BEGIN
        -- Nếu new_quantity <= 0 thì xóa khỏi giỏ hàng
        IF @new_quantity <= 0
        BEGIN
            DELETE FROM cart
            WHERE user_id = @user_id AND product_id = @product_id;

            PRINT N'Đã xóa sản phẩm khỏi giỏ hàng.';
        END
        ELSE
        BEGIN
            -- Cập nhật số lượng nếu thay đổi
            UPDATE cart
            SET quantity = @new_quantity
            WHERE user_id = @user_id AND product_id = @product_id;

            PRINT N'Đã cập nhật số lượng sản phẩm trong giỏ hàng.';
        END
    END
    ELSE
    BEGIN
        RAISERROR(N'Sản phẩm không tồn tại trong giỏ hàng.', 16, 1);
    END
END TRY
BEGIN CATCH
    DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR(@Err, 16, 1);
END CATCH

END


GO







--------- Tạo/ cập nahatj payment method
CREATE  PROCEDURE sp_Upsert_PaymentMethod
    @method_id VARCHAR(25),
    @name NVARCHAR(75),
    @type INT,
    @description NVARCHAR(1000),
    @date_created DATETIME,
    @fee_rate INT,
    @url NVARCHAR(200),
    @logo_url NVARCHAR(200),
    @bank NVARCHAR(100),
    @num_account INT,
    @name_account NVARCHAR(75),
    @refund BIT,
    @sort INT,
    @status BIT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF EXISTS (SELECT 1 FROM payment_method WHERE method_id = @method_id)
        BEGIN
            -- Chỉ cập nhật nếu có bất kỳ trường nào thay đổi
            IF EXISTS (
                SELECT 1
                FROM payment_method
                WHERE method_id = @method_id
                AND (
                    ISNULL(name, '') <> ISNULL(@name, '') OR
                    ISNULL(type, -1) <> ISNULL(@type, -1) OR
                    ISNULL(description, '') <> ISNULL(@description, '') OR
                    ISNULL(fee_rate, -1) <> ISNULL(@fee_rate, -1) OR
                    ISNULL(url, '') <> ISNULL(@url, '') OR
                    ISNULL(logo_url, '') <> ISNULL(@logo_url, '') OR
                    ISNULL(bank, '') <> ISNULL(@bank, '') OR
                    ISNULL(num_account, -1) <> ISNULL(@num_account, -1) OR
                    ISNULL(name_account, '') <> ISNULL(@name_account, '') OR
                    ISNULL(refund, -1) <> ISNULL(@refund, -1) OR
                    ISNULL(sort, -1) <> ISNULL(@sort, -1) OR
                    ISNULL(status, -1) <> ISNULL(@status, -1)
                )
            )
            BEGIN
                UPDATE payment_method
                SET
                    name = @name,
                    type = @type,
                    description = @description,
                    fee_rate = @fee_rate,
                    url = @url,
                    logo_url = @logo_url,
                    bank = @bank,
                    num_account = @num_account,
                    name_account = @name_account,
                    refund = @refund,
                    sort = @sort,
                    status = @status
                WHERE method_id = @method_id;

                PRINT N'Đã cập nhật phương thức thanh toán.';
            END
            ELSE
            BEGIN
                PRINT N'Không có thay đổi. Không cập nhật.';
            END
        END
        ELSE
        BEGIN
            -- Thêm mới
            INSERT INTO payment_method (
                method_id, name, type, description, date_created,
                fee_rate, url, logo_url, bank, num_account, name_account,
                refund, sort, status
            )
            VALUES (
                @method_id, @name, @type, @description, @date_created,
                @fee_rate, @url, @logo_url, @bank, @num_account, @name_account,
                @refund, @sort, @status
            );

            PRINT N'Đã thêm mới phương thức thanh toán.';
        END
    END TRY
    BEGIN CATCH
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END



Go 
------Ghi Login history
CREATE  PROCEDURE sp_InsertLogHistory
    @user_id INT,
    @IP VARCHAR(50),
    @status INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        INSERT INTO log_hisory (user_id, date_log, IP, status)
        VALUES (@user_id, GETDATE(), @IP, @status);
    END TRY
    BEGIN CATCH
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END
Go



-------Ghi lượt click
CREATE  PROCEDURE sp_InsertClickProduct
    @product_id VARCHAR(25),
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;
	SET @user_id = ISNULL(@user_id,-1)
    BEGIN TRY
        INSERT INTO click_product (product_id, user_id, date_click)
        VALUES (@product_id, @user_id, GETDATE());
    END TRY
    BEGIN CATCH
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END


GO

-------Tạo hóa đơn

CREATE  PROCEDURE sp_create_invoice_from_order
@order_id VARCHAR(25),
@method_id VARCHAR(25),
@invoice_id VARCHAR(25) OUTPUT,
@result BIT OUTPUT,
@ship_amount money = 30000,
@message NVARCHAR(200) OUTPUT
AS
BEGIN
SET NOCOUNT ON;
-- Kiểm tra đơn hàng tồn tại
IF NOT EXISTS (SELECT 1 FROM order_tb WHERE order_id = @order_id)
BEGIN
    SET @result = 0;
    SET @message = N'Không tồn tại đơn hàng.';
    RETURN;
END

DECLARE 
    @amount MONEY = 0,
    @promotion MONEY = 0,
    @tax_amount MONEY = 0,
    @cost MONEY = 0,
    @amount_payable MONEY = 0;

DECLARE 
    @pro_saleoff VARCHAR(25),
    @pro_new VARCHAR(25),
    @pro_discount VARCHAR(25);

SELECT 
    @pro_saleoff = pro_saleoff,
    @pro_new = pro_new,
    @pro_discount = pro_discount
FROM order_tb
WHERE order_id = @order_id;

DECLARE @tmp TABLE (
    product_id VARCHAR(25),
    quantity INT,
    price MONEY,
    cost MONEY,
    promo_saleoff MONEY,
    promo_new MONEY,
    promo_discount MONEY
);

INSERT INTO @tmp (product_id, quantity, price, cost, promo_saleoff, promo_new, promo_discount)
SELECT 
    od.product_id,
    od.quantity,
    od.price,
    od.cost,
    0, 0, 0
FROM order_d od
WHERE od.order_id = @order_id;

-- SALE OFF
IF @pro_saleoff IS NOT NULL
BEGIN
    UPDATE t
    SET promo_saleoff =
        CASE p.calculate
            WHEN 1 THEN t.price * t.quantity * p.value / 100
            WHEN 2 THEN p.value
            ELSE 0
        END
    FROM @tmp t
    JOIN promotion_product pp ON t.product_id = pp.product_id AND pp.promotion_id = @pro_saleoff
    JOIN promotion p ON p.promotion_id = @pro_saleoff
    WHERE p.status = 1 AND p.date_start <= GETDATE() AND (p.date_end IS NULL OR p.date_end >= GETDATE());
END

-- NEW
IF @pro_new IS NOT NULL
BEGIN
    UPDATE t
    SET promo_new =
        CASE p.calculate
            WHEN 1 THEN (t.price * t.quantity - t.promo_saleoff) * p.value / 100
            WHEN 2 THEN p.value
            ELSE 0
        END
    FROM @tmp t
    JOIN promotion_product pp ON t.product_id = pp.product_id AND pp.promotion_id = @pro_new
    JOIN promotion p ON p.promotion_id = @pro_new
    WHERE p.status = 1 AND p.date_start <= GETDATE() AND (p.date_end IS NULL OR p.date_end >= GETDATE());
END

-- DISCOUNT
IF @pro_discount IS NOT NULL
BEGIN
    UPDATE t
    SET promo_discount =
        CASE p.calculate
            WHEN 1 THEN (t.price * t.quantity - t.promo_saleoff - t.promo_new) * p.value / 100
            WHEN 2 THEN p.value
            ELSE 0
        END
    FROM @tmp t
    JOIN promotion_product pp ON t.product_id = pp.product_id AND pp.promotion_id = @pro_discount
    JOIN promotion p ON p.promotion_id = @pro_discount
    WHERE p.status = 1 AND p.date_start <= GETDATE() AND (p.date_end IS NULL OR p.date_end >= GETDATE());
END

-- Tổng tiền
SELECT 
    @amount = SUM(price * quantity),
    @cost = SUM(cost * quantity),
    @promotion = SUM(promo_saleoff + promo_new + promo_discount)
FROM @tmp;

-- Ship giảm nếu có pro_ship
SELECT TOP 1
    @ship_amount =
        CASE p.calculate
            WHEN 1 THEN @ship_amount - (@ship_amount * p.value / 100)
            WHEN 2 THEN CASE WHEN @ship_amount > p.value THEN @ship_amount - p.value ELSE 0 END
            ELSE @ship_amount
        END
FROM order_tb o
JOIN promotion p ON o.pro_ship = p.promotion_id
WHERE o.order_id = @order_id
  AND p.status = 1
  AND p.date_start <= GETDATE()
  AND (p.date_end IS NULL OR p.date_end >= GETDATE());

----SET @tax_amount = ROUND((@amount - @promotion) * 0.1, 0);
SET @amount_payable = @amount - @promotion + @tax_amount + @ship_amount;
SET @invoice_id = CONCAT('INV', FORMAT(GETDATE(), 'yyyyMMddHHmmss'), RIGHT(NEWID(), 5));

INSERT INTO invoice (
    invoice_id, order_id, date_created, date_payment,
    method, amount, ship_amount, tax_amount, promotion, 
    cost, amount_payable, payment, balanced, description, status
)
VALUES (
    @invoice_id, @order_id, GETDATE(), NULL,
    @method_id, @amount, @ship_amount, @tax_amount, @promotion,
    @cost, @amount_payable, 0, @amount_payable, N'Hóa đơn từ đơn hàng', 1
);

SET @result = 1;
SET @message = N'Tạo hóa đơn thành công.';
END;
GO



------Store cập nhật trạng thái, ngày thanh toán, chú thích hóa đơn
CREATE  PROCEDURE sp_UpdateInvoice
@invoice_id VARCHAR(25),
@date_payment DATE = NULL,
@description NVARCHAR(1000) = NULL,
@status INT = NULL
AS
BEGIN
SET NOCOUNT ON;
BEGIN TRY
    IF NOT EXISTS (SELECT 1 FROM invoice WHERE invoice_id = @invoice_id)
    BEGIN
        RAISERROR(N'Hóa đơn không tồn tại.', 16, 1);
        RETURN;
    END;

    UPDATE invoice
    SET
        date_payment = ISNULL(@date_payment, date_payment),
        description   = ISNULL(@description, description),
        status        = ISNULL(@status, status)
    WHERE invoice_id = @invoice_id;

    PRINT N'Đã cập nhật hóa đơn thành công.';
END TRY
BEGIN CATCH
    DECLARE @Err NVARCHAR(1000) = ERROR_MESSAGE();
    RAISERROR(@Err, 16, 1);
END CATCH
END;
GO

------- Tạo đơn giao hàng từ đơn hàng 
CREATE PROCEDURE sp_CreateShipmentFromOrder
@order_id VARCHAR(25),
@address_id VARCHAR(25),
@date_est_deli DATETIME,
@shipper1_id VARCHAR(25) = NULL,
@shipper1_name NVARCHAR(75) = NULL,
@phone1 CHAR(10) = NULL,
@description NVARCHAR(1000) = NULL
AS
BEGIN
SET NOCOUNT ON;

DECLARE @shipment_id VARCHAR(25), @shipment_seq INT;
DECLARE @name_receive NVARCHAR(75), @phone_receive CHAR(10);
DECLARE @date_receipt DATE;

BEGIN TRY
    BEGIN TRAN;

    -- Kiểm tra đơn hàng
    SELECT @date_receipt = date_created
    FROM order_tb
    WHERE order_id = @order_id;

    IF @date_receipt IS NULL
    BEGIN
        RAISERROR(N'Không tìm thấy đơn hàng.', 16, 1);
        ROLLBACK;
        RETURN;
    END;

    -- Lấy thông tin địa chỉ người nhận
    SELECT @name_receive = name, @phone_receive = phone
    FROM address
    WHERE address_id = @address_id AND status = 1;

    IF @name_receive IS NULL
    BEGIN
        RAISERROR(N'Địa chỉ không hợp lệ hoặc đã bị vô hiệu.', 16, 1);
        ROLLBACK;
        RETURN;
    END;

    -- Sinh shipment_id
    SELECT @shipment_seq = ISNULL(MAX(CAST(RIGHT(shipment_id, 5) AS INT)), 0) + 1
    FROM shipment
    WHERE shipment_id LIKE 'SHIP' + FORMAT(GETDATE(), 'yyyyMMdd') + '%';

    SET @shipment_id = CONCAT('SHIP', FORMAT(GETDATE(), 'yyyyMMdd'), RIGHT('00000' + CAST(@shipment_seq AS VARCHAR), 5));

    -- Tạo bản ghi shipment
    INSERT INTO shipment (
        shipment_id, date_created, date_receipt, date_est_deli, date_actual_deli,
        shipper1_id, shipper1_name, phone1,
        order_id, address_id,
        name_receive, phone_receive,
        description, status
    )
    VALUES (
        @shipment_id, GETDATE(), @date_receipt, @date_est_deli, NULL,
        @shipper1_id, @shipper1_name, @phone1,
        @order_id, @address_id,
        @name_receive, @phone_receive,
        @description, 0
    );

    -- Thêm dữ liệu chi tiết từ order_d
    INSERT INTO shipment_d (shipment_id, product_id, order_id, quantity)
    SELECT @shipment_id, product_id, order_id, SUM(quantity)
    FROM order_d
    WHERE order_id = @order_id
    GROUP BY product_id, order_id;

    COMMIT;
    PRINT N'Đã tạo đơn giao hàng: ' + @shipment_id;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK;
    DECLARE @Err NVARCHAR(1000) = ERROR_MESSAGE();
    RAISERROR(@Err, 16, 1);
END CATCH

END;
GO




------- tạo/ cập nhật địa chỉ
CREATE  PROCEDURE sp_UpsertAddress
@address_id VARCHAR(25),
@name NVARCHAR(75) = '',
@phone CHAR(10) = '',
@description NVARCHAR(1000) = '',
@country NVARCHAR(75) = '',
@city NVARCHAR(75) = '',
@district NVARCHAR(75) = '',
@ward NVARCHAR(75) = '',
@street NVARCHAR(75) = '',
@detail NVARCHAR(75) = '',
@user_id VARCHAR(25) = '',
@status BIT = null
AS
BEGIN
SET NOCOUNT ON;
IF NOT EXISTS (SELECT 1 FROM address WHERE address_id = @address_id)
BEGIN

    INSERT INTO address (
        address_id, name, phone, description,
        country, city, district, ward, street, detail,
        user_id, status
    )
    VALUES (
        @address_id, @name, @phone, @description,
        @country, @city, @district, @ward, @street, @detail,
        @user_id, 1
    );

    PRINT N'Đã thêm địa chỉ mới.';
END
ELSE
BEGIN
    UPDATE address
    SET
        name = CASE WHEN @name <> '' AND @name <> name THEN @name ELSE name END,
        phone = CASE WHEN @phone <> '' AND @phone <> phone THEN @phone ELSE phone END,
        description = CASE WHEN @description <> '' AND @description <> description THEN @description ELSE description END,
        country = CASE WHEN @country <> '' AND @country <> country THEN @country ELSE country END,
        city = CASE WHEN @city <> '' AND @city <> city THEN @city ELSE city END,
        district = CASE WHEN @district <> '' AND @district <> district THEN @district ELSE district END,
        ward = CASE WHEN @ward <> '' AND @ward <> ward THEN @ward ELSE ward END,
        street = CASE WHEN @street <> '' AND @street <> street THEN @street ELSE street END,
        detail = CASE WHEN @detail <> '' AND @detail <> detail THEN @detail ELSE detail END,
        user_id = CASE WHEN @user_id <> '' AND @user_id <> user_id THEN @user_id ELSE user_id END,
        status = CASE WHEN @status is not null AND @status <> status THEN @status ELSE status END
    WHERE address_id = @address_id;

    PRINT N'Đã cập nhật địa chỉ (nếu có thay đổi).';
END

END;
GO