USE web_code
GO
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'sp_upsert_user') AND type in (N'P', N'PC'))
    DROP PROCEDURE sp_upsert_user
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
@phong_ban nvarchar(50) = NULL,

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

    SET @result = 1;
    SET @message = N'Cập nhật người dùng thành công.';
END

END;

GO

