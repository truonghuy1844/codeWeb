Use web_code
go

------ Xóa sản phẩm trong giỏ hàng
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_DeleteCartItem') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_DeleteCartItem
GO

CREATE PROCEDURE sp_DeleteCartItem
@user_id INT,
@product_id VARCHAR(25)
AS
BEGIN
SET NOCOUNT ON;
	BEGIN TRY
    -- Kiểm tra xem sản phẩm có trong giỏ hàng của người dùng không
    IF EXISTS (
        SELECT 1
        FROM cart
        WHERE user_id = @user_id AND product_id = @product_id
    )
    BEGIN
        DELETE FROM cart
        WHERE user_id = @user_id AND product_id = @product_id;

        PRINT N'Đã xóa sản phẩm khỏi giỏ hàng.';
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

END;

GO
----- Xóa toàn bộ giỏ hàng
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_ClearCart') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_ClearCart
GO

CREATE PROCEDURE sp_ClearCart
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Kiểm tra người dùng có giỏ hàng không
        IF EXISTS (SELECT 1 FROM cart WHERE user_id = @user_id)
        BEGIN
            DELETE FROM cart WHERE user_id = @user_id;
            PRINT N'Đã xóa toàn bộ giỏ hàng của người dùng.';
        END
        ELSE
        BEGIN
            RAISERROR(N'Giỏ hàng đã trống.', 16, 1);
        END
    END TRY
    BEGIN CATCH
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END;

go 

----- Xóa sản phẩm trong wishlist
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_DeleteFromWishlist') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_DeleteFromWishlist
GO

CREATE PROCEDURE sp_DeleteFromWishlist
@user_id INT,
@product_id VARCHAR(25)
AS
BEGIN
SET NOCOUNT ON;
	BEGIN TRY
    IF EXISTS (SELECT 1 FROM wishlist WHERE user_id = @user_id AND product_id = @product_id)
    BEGIN
        DELETE FROM wishlist
        WHERE user_id = @user_id AND product_id = @product_id;

        PRINT N'Đã xóa sản phẩm khỏi danh sách yêu thích.';
    END
    ELSE
    BEGIN
        RAISERROR(N'Sản phẩm không tồn tại trong danh sách yêu thích.', 16, 1);
    END
END TRY
BEGIN CATCH
    DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR(@ErrMsg, 16, 1);
END CATCH

END;

go
----Xóa toàn bộ wishlist
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_ClearWishlist') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_ClearWishlist
GO

CREATE PROCEDURE sp_ClearWishlist
@user_id INT
AS
BEGIN
SET NOCOUNT ON;
	BEGIN TRY
    IF EXISTS (SELECT 1 FROM wishlist WHERE user_id = @user_id)
    BEGIN
        DELETE FROM wishlist
        WHERE user_id = @user_id;

        PRINT N'Đã xóa toàn bộ sản phẩm trong danh sách yêu thích.';
    END
    ELSE
    BEGIN
        RAISERROR(N'Danh sách yêu thích trống.', 16, 1);
    END
END TRY
BEGIN CATCH
    DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR(@ErrMsg, 16, 1);
END CATCH

END;
Go

------ Xóa rating theo sản phẩm hoặc người đánh giá phải truyền tham số
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_DeleteRating') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_DeleteRating
GO

CREATE PROCEDURE sp_DeleteRating
@product_id VARCHAR(25) = NULL,
@user_id INT = NULL
AS
BEGIN
SET NOCOUNT ON;
	IF EXISTS (SELECT 1 FROM user_tb WHERE user_id = @user_id AND ( admin = 1 ))
	BEGIN
	BEGIN TRY  
    IF @product_id IS NULL AND @user_id IS NULL  
    BEGIN  
        RAISERROR(N'Phải cung cấp ít nhất một trong hai tham số: product_id hoặc user_id.', 16, 1);  
        RETURN;  
    END  

    DELETE FROM rating  
    WHERE (@product_id IS NULL OR product_id = @product_id)  
      AND (@user_id IS NULL OR user_id = @user_id);  

    PRINT N'Xóa đánh giá thành công.'  
END TRY  
BEGIN CATCH  
    DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();  
    RAISERROR(@ErrMsg, 16, 1);  
END CATCH  
END
	 BEGIN
        RAISERROR(N'Bạn không phải admin hoặc không phải người rate, không thể xóa', 16, 1);
    END
END;
GO

------ Loại bỏ sản phẩm áp dụng promotion
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_DeletePromotionProducts') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_DeletePromotionProducts
GO

CREATE PROCEDURE sp_DeletePromotionProducts
    @promotion_id VARCHAR(25) = '',
    @product_ids NVARCHAR(MAX) = ''  -- Chuỗi các product_id, phân tách bằng dấu phẩy
AS
BEGIN
    SET NOCOUNT ON;

    IF @promotion_id IS NULL OR LTRIM(RTRIM(@promotion_id)) = ''
    BEGIN
        RAISERROR(N'Mã khuyến mãi không được để trống.', 16, 1);
        RETURN;
    END

    IF @product_ids IS NULL OR LTRIM(RTRIM(@product_ids)) = ''
    BEGIN
        RAISERROR(N'Danh sách sản phẩm không được để trống.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        -- Tách chuỗi product_ids thành bảng tạm
        DECLARE @ProductList TABLE (product_id VARCHAR(25));

        INSERT INTO @ProductList (product_id)
        SELECT LTRIM(RTRIM(value))
        FROM STRING_SPLIT(@product_ids, ',')
        WHERE LTRIM(RTRIM(value)) <> '';

        DELETE FROM promotion_product
        WHERE promotion_id = @promotion_id
        AND product_id IN (SELECT product_id FROM @ProductList);

        PRINT N'Đã xóa sản phẩm khỏi khuyến mãi thành công.';
    END TRY
    BEGIN CATCH
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END

GO

------ Xóa nhập hàng, có thể xóa theo danh sách nhập hàng
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_DeleteProductIn') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_DeleteProductIn
GO

CREATE PROCEDURE sp_DeleteProductIn
    @pi_ids NVARCHAR(MAX) = ''  -- Chuỗi các pi_id, phân tách bằng dấu phẩy
AS
BEGIN
    SET NOCOUNT ON;

    IF @pi_ids IS NULL OR LTRIM(RTRIM(@pi_ids)) = ''
    BEGIN
        RAISERROR(N'Danh sách mã nhập kho (pi_id) không được để trống.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        DECLARE @PIList TABLE (pi_id VARCHAR(25));

        -- Chuyển chuỗi phân tách thành bảng
        INSERT INTO @PIList (pi_id)
        SELECT LTRIM(RTRIM(value))
        FROM STRING_SPLIT(@pi_ids, ',')
        WHERE LTRIM(RTRIM(value)) <> '';

        DELETE FROM product_in
        WHERE pi_id IN (SELECT pi_id FROM @PIList);

        PRINT N'Xóa dòng nhập kho thành công.';
    END TRY
    BEGIN CATCH
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END
GO

---- Xóa tin nhắn
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_DeleteChatMessage') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_DeleteChatMessage
GO

CREATE PROCEDURE sp_DeleteChatMessage
    @chat_rec INT
AS
BEGIN
    SET NOCOUNT ON;

    IF @chat_rec IS NULL
    BEGIN
        RAISERROR(N'Mã tin nhắn không được để trống.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        DELETE FROM chat_detail
        WHERE chat_rec = @chat_rec;

        PRINT N'Đã xóa tin nhắn thành công.';
    END TRY
    BEGIN CATCH
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END

GO
----- Xóa member chat
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_DeleteChatMember') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_DeleteChatMember
GO

CREATE PROCEDURE sp_DeleteChatMember
    @member_id INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra member_id có tồn tại không
    IF NOT EXISTS (SELECT 1 FROM chat_member WHERE member_id = @member_id)
    BEGIN
        RAISERROR(N'Thành viên không tồn tại.', 16, 1);
        RETURN;
    END

    BEGIN TRY
        DELETE FROM chat_member
        WHERE member_id = @member_id;

        PRINT N'Xóa thành viên thành công.';
    END TRY
    BEGIN CATCH
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END

GO
-----Xóa chat tab, xóa toàn bộ tin nhắn và thành viên liên quan
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_DeleteChatTab') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_DeleteChatTab
GO

CREATE PROCEDURE sp_DeleteChatTab
    @chat_id VARCHAR(25)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        
        -- Kiểm tra chat_id có tồn tại
        IF NOT EXISTS (SELECT 1 FROM chat_tab WHERE chat_id = @chat_id)
        BEGIN
            RAISERROR(N'Mã chat không tồn tại.', 16, 1);
            RETURN;
        END
		
        -- Xóa toàn bộ tin nhắn liên quan đến chat_id
        DELETE FROM chat_detail
        WHERE chat_rec IN (
            SELECT cd.chat_rec
            FROM chat_detail cd
            JOIN chat_member cm ON cd.member_send = cm.member_id OR cd.member_reply = cm.member_id
            WHERE cm.chat_id = @chat_id
        );

		DELETE FROM chat_member WHERE chat_id = @chat_id
        -- Xóa bản ghi chat_tab
        DELETE FROM chat_tab
        WHERE chat_id = @chat_id;

        PRINT N'Đã xóa thành công chat tab và các tin nhắn liên quan.';
    END TRY
    BEGIN CATCH
        DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@Err, 16, 1);
    END CATCH
END

Go
------Xóa hóa đơn
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_DeleteInvoice') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_DeleteInvoice
GO

CREATE PROCEDURE sp_DeleteInvoice
    @invoice_id VARCHAR(25)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF EXISTS (SELECT 1 FROM invoice WHERE invoice_id = @invoice_id)
        BEGIN
            DELETE FROM invoice WHERE invoice_id = @invoice_id;
            PRINT N'Đã xóa hóa đơn: ' + @invoice_id;
        END
        ELSE
        BEGIN
            RAISERROR(N'Hóa đơn không tồn tại: %s', 16, 1, @invoice_id);
        END
    END TRY
    BEGIN CATCH
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END

GO

----- Xóa địa chỉ
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_DeleteAddress') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_DeleteAddress
GO

CREATE PROCEDURE sp_DeleteAddress
@address_id VARCHAR(25)
AS
BEGIN
SET NOCOUNT ON;
BEGIN TRY
    IF NOT EXISTS (SELECT 1 FROM address WHERE address_id = @address_id)
    BEGIN
        RAISERROR(N'Không tìm thấy địa chỉ với ID này.', 16, 1);
        RETURN;
    END

    DELETE FROM address WHERE address_id = @address_id;

    PRINT N'Địa chỉ đã được xóa thành công.';
END TRY
BEGIN CATCH
    DECLARE @ErrMsg NVARCHAR(1000) = ERROR_MESSAGE();
    DECLARE @ErrNum INT = ERROR_NUMBER();

    -- Kiểm tra lỗi do ràng buộc khóa ngoại
    IF @ErrNum = 547
    BEGIN
        RAISERROR(N'Không thể xóa địa chỉ vì đang được sử dụng trong các bảng khác', 16, 1);
    END
    ELSE
    BEGIN
        RAISERROR(@ErrMsg, 16, 1);
    END
END CATCH

END;
GO


----Xóa đơn giao hàng
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_DeleteShipment') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_DeleteShipment
GO

CREATE PROCEDURE sp_DeleteShipment
    @shipment_id VARCHAR(25)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF EXISTS (SELECT 1 FROM shipment WHERE shipment_id = @shipment_id)
        BEGIN
            DELETE FROM shipment_d WHERE shipment_id = @shipment_id;
			DELETE FROM shipment WHERE shipment_id = @shipment_id;
            PRINT N'Đã xóa đơn giao hàng: ' + @shipment_id;
        END
        ELSE
        BEGIN
            RAISERROR(N'Đơn giao hàng không tồn tại: %s', 16, 1, @shipment_id);
        END
    END TRY
    BEGIN CATCH
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END

GO