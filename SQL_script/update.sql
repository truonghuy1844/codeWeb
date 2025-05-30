USE web_code
GO
ALTER TABLE address
ALTER COLUMN user_id INT;
go
ALTER TABLE address
ADD CONSTRAINT FK_address_user
FOREIGN KEY (user_id)
REFERENCES user_tb(user_id);

ALTER TABLE user_tb2
ADD phong_ban nvarchar(50);

UPDATE user_tb set seller = 1 where user_id = 3;
	GO
	EXEC add_to_cart
    @user_id = 1,
    @product_id = '4301',
    @quantity = 20;

	EXEC add_to_cart
    @user_id = 4,
    @product_id = '4301',
    @quantity = 50;