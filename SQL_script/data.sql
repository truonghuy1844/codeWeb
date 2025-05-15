
Use web_code
go

-- Thêm người dùng
INSERT INTO user_tb (user_name, password, admin, buyer, seller, date_created)
VALUES 
    ('user2', 'pass2', 0, 1, 0, '2025-05-01'),
    ('user3', 'pass3', 0, 1, 0, '2025-04-30'),
    ('user4', 'pass4', 0, 1, 0, '2025-04-29');



GO
-- Thêm chi tiết người dùng
INSERT INTO user_tb2 (user_id, name, birthday, phone_number, address, email)
VALUES 
    (1, N'User 2', '1990-01-01', '090000002', N'Address 2', 'user2@example.com'),
    (2, N'User 3', '1990-01-01', '090000003', N'Address 3', 'user3@example.com'),
    (3, N'User 4', '1990-01-01', '090000004', N'Address 4', 'user4@example.com');
Go
-- Thêm danh mục
INSERT INTO category (category_id, category_name)
VALUES ('cate01', N'Danh mục 1');

-- Thêm nhóm sản phẩm
INSERT INTO group_tb (group_tb_id, group_tb_name, type)
VALUES ('grp01', N'Nhóm 1', 1);

Go

INSERT INTO brand (brand_id, brand_name, brand_name2, description, status)
VALUES
    ('br001', N'Brand A', N'Thương Hiệu A', N'Description of Brand A', 1),
    ('br002', N'Brand B', N'Thương Hiệu B', N'Description of Brand B', 1),
    ('br003', N'Brand C', N'Thương Hiệu C', N'Description of Brand C', 0);

-- Thêm sản phẩm
INSERT INTO product (product_id, name, brand_id, category_id, group_tb_1, uom, price1, date_apply1)
VALUES 
    ('prd02', N'Product 2','br001', 'cate01', 'grp01', N'Cái', 4764067, '2025-05-03'),
    ('prd03', N'Product 3','br002' ,'cate01', 'grp01', N'Cái', 2910113, '2025-05-03'),
    ('prd04', N'Product 4','br003', 'cate01', 'grp01', N'Cái', 1516373, '2025-05-03');
----
	INSERT INTO product_in (pi_id, product_id, date_created, name, quantity, cost)
VALUES 
    ('pi01', 'prd02', '2025-05-01', N'Nhập hàng đợt 1', 50, 4000000),
	('pi03', 'prd04', '2025-05-01', N'Nhập hàng đợt 1', 70, 1000000),
    ('pi02', 'prd03', '2025-05-02', N'Nhập hàng đợt 2', 100, 2500000);

-- Thêm thuế
INSERT INTO tax (tax_id, tax_name, tax_name2, rate, date_start)
VALUES ('tax01', N'Thuế GTGT', N'VAT', 10, '2025-01-01');

-- Thêm đơn hàng
INSERT INTO order_tb (order_id, date_created, buyer, seller)
VALUES 
    ('ord02', '2025-05-01', 3,1),
    ('ord03', '2025-04-30', 1,2),
    ('ord04', '2025-04-29', 3,1);
SELECT * from product_in
-- Thêm chi tiết đơn hàng
INSERT INTO order_d (order_id, product_id,pi_id, quantity, cost, price, tax)
VALUES 
    ('ord02', 'prd04','pi03', 2, 1697199, 1969338, 'tax01'),
    ('ord02', 'prd03','pi02', 3, 1412665, 1626053, 'tax01'),
    ('ord03', 'prd03','pi02', 2, 1113107, 1371328, 'tax01');

-- Thêm tồn kho sản phẩm

-- Thêm phương thức thanh toán
INSERT INTO payment_method (method_id, name, type, date_created)
VALUES ('pm01', N'Thanh toán chuyển khoản', 1, '2025-05-01');

-- Thêm hóa đơn
INSERT INTO invoice (invoice_id, order_id, date_created, method, amount, amount_payable, payment, balanced)
VALUES 
    ('inv01', 'ord02', '2025-05-01', 'pm01', 5000000, 5000000, 5000000, 0);

-- Thêm wishlist
INSERT INTO wishlist (user_id, product_id, product_name, product_description)
VALUES (2, 'prd02', 'Product 2', N'Mô tả sản phẩm 2');
GO
-- Thêm đánh giá
INSERT INTO rating (product_id, user_id, date_created, rate, description)
VALUES ('prd02', 2, '2025-05-02', 5, N'Hài lòng');

-- Thêm lịch sử đăng nhập
INSERT INTO log_hisory (user_id, date_log, IP, status)
VALUES (2, '2025-05-02 10:00:00', '192.168.1.1', 1);

-- Thêm lịch sử thay đổi
INSERT INTO change_history (user_id, date_act, type, table_change, old_val, new_val, status)
VALUES (2, '2025-05-02 12:00:00', 'UPDATE', 'user_tb', 'pass2', 'pass2new', 1);

-- Thêm địa chỉ
INSERT INTO address (address_id, name, phone, user_id)
VALUES ('addr01', N'Nhà riêng', '090000002', 2);

-- Thêm đơn giao hàng
INSERT INTO shipment (shipment_id, date_created, order_id, address_id, name_receive, phone_receive)
VALUES ('ship01', '2025-05-02', 'ord02', 'addr01', N'Người nhận 1', '090000002');

-- Thêm chi tiết giao hàng
INSERT INTO shipment_d (shipment_id, product_id, order_id, quantity)
VALUES ('ship01', 'prd04', 'ord02', 2);

-- Thêm hỗ trợ
INSERT INTO support (support_id, user_ask, ask, date_ask, product_id, order_id)
VALUES ('sup01', 2, N'Làm sao theo dõi đơn hàng?', '2025-05-03', 'prd04', 'ord02');

-- Thêm chat
INSERT INTO chat_tab (chat_id, date_created, name)
VALUES ('chat01', '2025-05-03', N'Hỗ trợ đơn hàng');

-- Thêm thành viên chat
INSERT INTO chat_member ( member_name, user_id, chat_id, date_joined)
VALUES ( N'User 2', 2, 'chat01', '2025-05-03');

-- Thêm tin nhắn chat
INSERT INTO chat_detail (member_send, name_send, msg_txt, date_created, isRead, pin)
VALUES (1, 2, N'Xin chào, tôi cần hỗ trợ đơn hàng.', '2025-05-03 10:00:00', 0, 0);

-- Thêm lượt click sản phẩm
INSERT INTO click_product (product_id, user_id)
VALUES ('prd02', 2);

-- Insert data into the promotion table
INSERT INTO promotion (
    promotion_id,
    promotion_name,
    promotion_name2,
    type,
    calculate,
    date_created,
    date_start,
    date_end,
    value,
    quantity,
    description,
    quan_cond,
    val_cond,
    oder_tb_cond,
    group_tb_cond,
    rank_cond
) VALUES
    ('promo001', N'Giảm giá đặc biệt', N'Khuyến mãi đặc biệt', 1, 1, '2025-05-01', '2025-05-05', '2025-05-10', 0.1, 100, N'Giảm 10% cho đơn hàng trên 100 sản phẩm', 100, 0, 0, NULL, 0),
    ('promo002', N'Mua 1 tặng 1', N'Mua một tặng một', 2, 0, '2025-05-02', '2025-05-07', '2025-05-15', NULL, NULL, N'Mua một sản phẩm tặng một sản phẩm cùng loại', 0, 100000, 1, 'grp01', 0),
    ('promo003', N'Giảm giá theo hạng', N'Giảm giá theo cấp độ thành viên', 3, 1, '2025-05-03', '2025-05-10', '2025-05-20', 0.05, NULL, N'Giảm 5% cho thành viên hạng VIP', 0, 500000, 0, NULL, 2);

-- Insert data into the promotion_product table
INSERT INTO promotion_product (
    promotion_id,
    product_id
) VALUES
    ('promo001', 'prd02'),
    ('promo001', 'prd03'),
    ('promo002', 'prd04'),
    ('promo003', 'prd02');
