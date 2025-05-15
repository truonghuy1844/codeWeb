-- Khai báo các biến để chứa username và password
DECLARE @username_input VARCHAR(25) = 'user2';  -- Gán biến thực tế
DECLARE @password_input VARCHAR(100) = 'pass2'; -- Gán biến thực tế thực tế

-- Thực thi stored procedure và hiển thị kết quả
EXEC sp_login_user @user_name = @username_input, @password = @password_input;





-------Store tra cứu sản phẩm, tồn kho
-- Khai báo các biến
DECLARE @product_id_param VARCHAR(25) = '';
DECLARE @category_id_param VARCHAR(25) = '';
DECLARE @group1_param VARCHAR(25) = '';
DECLARE @group2_param VARCHAR(25) = '';
DECLARE @group3_param VARCHAR(25) = '';
DECLARE @group4_param VARCHAR(25) = '';
DECLARE @product_name_param NVARCHAR(75) = '';
DECLARE @order_by_param VARCHAR(50) = '';
DECLARE @type_order_by_param VARCHAR(10) = '';

-- Gán giá trị cho các biến (ví dụ)
SET @product_id_param = '';
SET @category_id_param = '';  -- Thay bằng ID danh mục của bạn
SET @group1_param = '';        -- Thay bằng giá trị nhóm 1
SET @group2_param = '';                    -- Có thể để NULL nếu không muốn lọc
SET @group3_param = '';
SET @group4_param = '';
SET @product_name_param =''; -- Thay bằng phần tên sản phẩm bạn muốn tìm
set @order_by_param = 'quantity_in';
set @type_order_by_param = 'ASC';

-- Thực thi stored procedure với các biến
EXEC sp_filter_product_inventory
	@product_id = @product_id_param,
    @category_id = @category_id_param,
    @group1 = @group1_param,
    @group2 = @group2_param,
    @group3 = @group3_param,
    @group4 = @group4_param,
    @product_name = @product_name_param,
	@order_by = @order_by_param,
	@type_order_by = @type_order_by_param;










-----EXEC đơn mua hàng
-- Khai báo các biến
DECLARE @buyer_id_param INT = -1;
DECLARE @from_date_param DATE = NULL;
DECLARE @to_date_param DATE = NULL;
DECLARE @order_id_param varchar(25) = '';

-- Gán giá trị cho các biến
SET @buyer_id_param = '1';  -- Biến thực tế bạn muốn
SET @from_date_param = null; -- Thay bằng ngày bắt đầu
SET @to_date_param = null;   -- Thay bằng ngày kết thúc
SET @order_id_param = ''; -- Biến đơn h

-- Thực thi stored procedure
EXEC sp_get_orders_by_buyer
    @buyer_id = @buyer_id_param,
    @from_date = @from_date_param,
    @to_date = @to_date_param,
	@order_id = @order_id_param;




	-----Đơn bán hàng
	-- Khai báo các biến
DECLARE @seller_id_param INT = -1;
DECLARE @from_date_param DATE = NULL;
DECLARE @to_date_param DATE = NULL;
DECLARE @order_id_param varchar(25) = '';

-- Gán giá trị cho các biến
SET @seller_id_param = '2';  -- Biến thực tế bạn muốn
SET @from_date_param = null; -- Thay bằng ngày bắt đầu
SET @to_date_param = null;   -- Thay bằng ngày kết thúc
SET @order_id_param = ''; -- Biến đơn h

-- Thực thi stored procedure
EXEC sp_get_orders_by_seller
    @seller_id = @seller_id_param,
    @from_date = @from_date_param,
    @to_date = @to_date_param,
	@order_id = @order_id_param;




----- EXEC hóa đơn, đơn hàng, chi tiét

EXEC sp_get_invoice_details 

    @method = 'pm01',
    @status = 1;


	select * from product
select * from product_in
select * from order_d
select * from order_tb
select * from brand
select * from invoice
Select * from promotion
Select * from promotion_product
update order_tb set pro_discount = 'promo001' where order_id = 'ord02'