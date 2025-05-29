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
