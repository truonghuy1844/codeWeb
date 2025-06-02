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

	GO
	-- BƯỚC 1: Thêm cột banner_url vào bảng promotion nếu chưa có
IF COL_LENGTH('promotion', 'banner_url') IS NULL
BEGIN
    ALTER TABLE promotion
    ADD banner_url NVARCHAR(MAX);
END;

-- BƯỚC 2: Cập nhật URL banner tương ứng với từng chương trình khuyến mãi
UPDATE promotion
SET banner_url = 'https://img.pikbest.com/templates/20240815/banner-promoting-the-sale-of-toys-for-children-in-the-supermarket_10729034.jpg!bw700'
WHERE promotion_id = '4501';

UPDATE promotion
SET banner_url = 'https://tudongchat.com/wp-content/uploads/2024/12/mau-content-ban-do-choi-tre-em-1.jpg'
WHERE promotion_id = '4502';

UPDATE promotion
SET banner_url = 'https://img.pikbest.com/templates/20240725/sale-banner-template-to-decorate-a-shop-selling-children-27s-toys_10680872.jpg!w700wp'
WHERE promotion_id = '4503';

UPDATE promotion
SET banner_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNWkOBVp6Kx8CXy_CSknH8yr-J1QMAbbZWKQ&s'
WHERE promotion_id = '4504';

UPDATE promotion
SET banner_url = 'https://www.mykingdom.com.vn/cdn/shop/articles/mykingdom-do-choi-tre-em-gia-tot-thump.jpg?v=1686029392'
WHERE promotion_id = 'promo001';

UPDATE promotion
SET banner_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSerlwpIzE55PjOKq-HIwXM5cDA5e9gq5ZvZYPvQY-dkec7-EZ_4WHQ7SgwDbp9h0Ee-L8&usqp=CAU'
WHERE promotion_id = 'promo002';

UPDATE promotion
SET banner_url = 'https://thegioipatin.com/wp-content/uploads/2022/03/banner-t3-1-02-min.jpg'
WHERE promotion_id = 'promo003';

UPDATE promotion
SET banner_url = 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0cs7s74zu6nec'
WHERE promotion_id = 'promo004';
