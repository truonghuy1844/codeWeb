
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_upsert_user') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_upsert_user
GO


CREATE PROCEDURE sp_upsert_user
@user_id INT = 0, -- Nếu = 0 thì insert, khác 0 thì update (tài khoản được update)
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
@phong_ban nvarchar(50) = NULL,
----Người chỉnh: dùng admin sửa tài khoản khác
@exec_user int,

-- Output
@result BIT OUTPUT,
@message NVARCHAR(200) OUTPUT

AS
BEGIN
    SET NOCOUNT ON;

-- Kiểm tra quyền sửa
IF @user_id != 0 AND NOT EXISTS (
    SELECT 1 FROM user_tb 
    WHERE (user_id = @user_id OR (@admin = 1 AND @exec_user = user_id)
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
        social_url1, social_url2, social_url3, logo_url,phong_ban
    )
    VALUES (
        @user_id, @name, @name2, @birthday, @phone_number, @address, @email,
        @social_url1, @social_url2, @social_url3, @logo_url,@phong_ban
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
        status = CASE WHEN status != @status  THEN @status ELSE status END	
    WHERE user_id = @user_id;

    -- Cập nhật user_tb2
    UPDATE user_tb2
    SET
        name = CASE WHEN name != @name  THEN @name ELSE name END,
        name2 = CASE WHEN name2 != @name2 THEN @name2 ELSE name2 END,
        birthday = CASE WHEN birthday != @birthday  THEN @birthday ELSE birthday END,
        phone_number = CASE WHEN phone_number != @phone_number THEN @phone_number ELSE phone_number END,
        address = CASE WHEN address != @address THEN @address ELSE address END,
        email = CASE WHEN email != @email AND @email is not null THEN @email ELSE email END,
        social_url1 = CASE WHEN social_url1 != @social_url1 THEN @social_url1 ELSE social_url1 END,
        social_url2 = CASE WHEN social_url2 != @social_url2  THEN @social_url2 ELSE social_url2 END,
        social_url3 = CASE WHEN social_url3 != @social_url3 THEN @social_url3 ELSE social_url3 END,
        logo_url = CASE WHEN logo_url != @logo_url THEN @logo_url ELSE logo_url END,
	phong_ban = Case when phong_ban != @phong_ban AND @phong_ban is not null then @phong_ban ELSE phong_ban END
    WHERE user_id = @user_id;

    SET @result = 2;
    SET @message = N'Cập nhật người dùng thành công.';
END

END;

GO



--------Chỉnh sửa tài khoản thường
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_upsert_user_normal') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_upsert_user_normal

GO

CREATE PROCEDURE sp_upsert_user_normal
@user_id INT = 0, -- Nếu = 0 thì insert, khác 0 thì update
@user_name VARCHAR(25),
@password VARCHAR(100),
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
@phong_ban nvarchar(50) = NULL,

-- Output
@result BIT OUTPUT,
@message NVARCHAR(200) OUTPUT

AS
BEGIN
    SET NOCOUNT ON;

-- Kiểm tra quyền sửa
IF @user_id != 0 AND NOT EXISTS (
    SELECT 1 FROM user_tb 
    WHERE (user_id = @user_id)
)
BEGIN
    SET @result = 0;
    SET @message = N'Không tìm thấy người d';
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
        social_url1, social_url2, social_url3, logo_url,phong_ban
    )
    VALUES (
        @user_id, @name, @name2, @birthday, @phone_number, @address, @email,
        @social_url1, @social_url2, @social_url3, @logo_url,@phong_ban
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
        notify = CASE WHEN notify != @notify THEN @notify ELSE notify END,
        status = CASE WHEN status != @status  THEN @status ELSE status END	
    WHERE user_id = @user_id;

    -- Cập nhật user_tb2
    UPDATE user_tb2
    SET
        name = CASE WHEN name != @name  THEN @name ELSE name END,
        name2 = CASE WHEN name2 != @name2 THEN @name2 ELSE name2 END,
        birthday = CASE WHEN birthday != @birthday  THEN @birthday ELSE birthday END,
        phone_number = CASE WHEN phone_number != @phone_number THEN @phone_number ELSE phone_number END,
        address = CASE WHEN address != @address THEN @address ELSE address END,
        email = CASE WHEN email != @email AND @email is not null THEN @email ELSE email END,
        social_url1 = CASE WHEN social_url1 != @social_url1 THEN @social_url1 ELSE social_url1 END,
        social_url2 = CASE WHEN social_url2 != @social_url2  THEN @social_url2 ELSE social_url2 END,
        social_url3 = CASE WHEN social_url3 != @social_url3 THEN @social_url3 ELSE social_url3 END,
        logo_url = CASE WHEN logo_url != @logo_url THEN @logo_url ELSE logo_url END,
	phong_ban = Case when phong_ban != @phong_ban AND @phong_ban is not null then @phong_ban ELSE phong_ban END
    WHERE user_id = @user_id;

    SET @result = 2;
    SET @message = N'Cập nhật người dùng thành công.';
END

END;

GO

------- Thêm, sản phẩm vào giỏ hàng
-- add_to_cart
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'add_to_cart') AND type in (N'P', N'PC'))
    DROP PROCEDURE add_to_cart
GO
CREATE  PROCEDURE add_to_cart
    @user_id INT,
    @product_id VARCHAR(25),
    @quantity INT
AS
BEGIN

    SET NOCOUNT ON;
	
    -- Kiểm tra quantity hợp lệ
    IF @quantity <= 0
    BEGIN
        RAISERROR('Số lượng phải lớn hơn 0.', 16, 1);
        RETURN;
    END
	DECLARE @product_name NVARCHAR(75), @price MONEY
	SELECT @product_name = name,  @price = price1 FROM product where product_id = @product_id
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
GO
-- sp_CreateOrder_FIFO
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_CreateOrder_FIFO') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_CreateOrder_FIFO
GO

CREATE PROCEDURE sp_CreateOrder_FIFO
    @buyer INT,
    @seller INT,
    @description NVARCHAR(1000) = NULL,
    @pro_saleoff VARCHAR(25) = NULL,
    @pro_new VARCHAR(25) = NULL,
    @pro_discount VARCHAR(25) = NULL,
    @pro_ship VARCHAR(25) = NULL,
	@order_id  varchar(25) output
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE  @order_seq INT;
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

--Update thêm, sửa sản phẩm
ALTER PROCEDURE upsert_product
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
    
    -- Kiểm tra quyền user
    IF EXISTS (SELECT 1 FROM user_tb WHERE user_id = @user_id AND (seller = 1 OR admin = 1))
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
                    ISNULL(date_apply1, '1900-01-01') <> ISNULL(@date_apply1, '1900-01-01') OR
                    ISNULL(price2, 0) <> ISNULL(@price2, 0) OR
                    ISNULL(date_apply2, '1900-01-01') <> ISNULL(@date_apply2, '1900-01-01') OR
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
    ELSE
    BEGIN
        -- User không có quyền
        RAISERROR(N'Bạn không phải người bán hoặc không đúng người bán của sản phẩm.', 16, 1);
        RETURN;
    END
END
GO

--Thêm, sửa user
Alter PROCEDURE sp_upsert_user
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
END

