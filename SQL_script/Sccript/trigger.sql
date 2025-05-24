use web_code
go

Go


------- Trigger ghi change_hitory bảng Product
CREATE OR ALTER TRIGGER trg_Log_Product
ON product
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @user_id INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);

    -- INSERT log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'INSERT',
        'product',
        NULL,
        (SELECT * FROM inserted i WHERE i.product_id = p.product_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        1
    FROM inserted p
    WHERE NOT EXISTS (SELECT 1 FROM deleted d WHERE d.product_id = p.product_id);

    -- UPDATE log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'UPDATE',
        'product',
        (SELECT * FROM deleted d WHERE d.product_id = i.product_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        (SELECT * FROM inserted i2 WHERE i2.product_id = i.product_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        1
    FROM inserted i
    JOIN deleted d ON i.product_id = d.product_id;

    -- DELETE log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'DELETE',
        'product',
        (SELECT * FROM deleted d2 WHERE d2.product_id = d.product_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        NULL,
        1
    FROM deleted d
    WHERE NOT EXISTS (SELECT 1 FROM inserted i WHERE i.product_id = d.product_id);
END;
Go






--------Trigeer ghi change_log cho bảng order_tb
CREATE OR ALTER TRIGGER trg_Log_Order_tb
ON order_tb
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @user_id INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);

    -- INSERT log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'INSERT',
        'order_tb',
        NULL,
        (SELECT * FROM inserted i WHERE i.order_id = p.order_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        1
    FROM inserted p
    WHERE NOT EXISTS (SELECT 1 FROM deleted d WHERE d.order_id = p.order_id);

    -- UPDATE log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'UPDATE',
        'order_tb',
        (SELECT * FROM deleted d WHERE d.order_id = i.order_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        (SELECT * FROM inserted i2 WHERE i2.order_id = i.order_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        1
    FROM inserted i
    JOIN deleted d ON i.order_id = d.order_id;

    -- DELETE log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'DELETE',
        'order_tb',
        (SELECT * FROM deleted d2 WHERE d2.order_id = d.order_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        NULL,
        1
    FROM deleted d
    WHERE NOT EXISTS (SELECT 1 FROM inserted i WHERE i.order_id = d.order_id);
END;



go




--------Trigger cho bảng order_d
CREATE OR ALTER TRIGGER trg_Log_order_d
ON order_d
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @user_id INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);

    -- INSERT log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'INSERT',
        'order_d',
        NULL,
        (SELECT * FROM inserted i WHERE i.product_id = p.product_id AND i.order_id = p.order_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        1
    FROM inserted p
    WHERE NOT EXISTS (SELECT 1 FROM deleted d WHERE d.product_id = p.product_id AND d.order_id = p.order_id);

    -- UPDATE log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'UPDATE',
        'order_d',
        (SELECT * FROM deleted d WHERE d.product_id = i.product_id AND d.order_id = i.order_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        (SELECT * FROM inserted i2 WHERE i2.product_id = i.product_id AND i2.order_id = i.order_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        1
    FROM inserted i
    JOIN deleted d ON i.product_id = d.product_id;

    -- DELETE log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'DELETE',
        'order_d',
        (SELECT * FROM deleted d2 WHERE d2.product_id = d.product_id AND d2.order_id = d.order_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        NULL,
        1
    FROM deleted d
    WHERE NOT EXISTS (SELECT 1 FROM inserted i WHERE i.product_id = d.product_id);
END;
Go


--------Trigeer ghi change_log cho bảng invoice
CREATE OR ALTER TRIGGER trg_Log_Invoice
ON invoice
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @user_id INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);

    -- INSERT log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'INSERT',
        'invoice',
        NULL,
        (SELECT * FROM inserted i WHERE i.invoice_id = p.invoice_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        1
    FROM inserted p
    WHERE NOT EXISTS (SELECT 1 FROM deleted d WHERE d.invoice_id = p.invoice_id);

    -- UPDATE log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'UPDATE',
        'product',
        (SELECT * FROM deleted d WHERE d.invoice_id = i.invoice_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        (SELECT * FROM inserted i2 WHERE i2.invoice_id = i.invoice_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        1
    FROM inserted i
    JOIN deleted d ON i.invoice_id = d.invoice_id;

    -- DELETE log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'DELETE',
        'product',
        (SELECT * FROM deleted d2 WHERE d2.invoice_id = d.invoice_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        NULL,
        1
    FROM deleted d
    WHERE NOT EXISTS (SELECT 1 FROM inserted i WHERE i.invoice_id = d.invoice_id);
END;

GO


------- Trigger bảng Product_in
CREATE OR ALTER TRIGGER trg_Log_Product_in
ON product_in
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @user_id INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);

    -- INSERT log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'INSERT',
        'product_in',
        NULL,
        (SELECT * FROM inserted i WHERE i.pi_id = p.pi_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        1
    FROM inserted p
    WHERE NOT EXISTS (SELECT 1 FROM deleted d WHERE d.pi_id = p.pi_id);

    -- UPDATE log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'UPDATE',
        'product_in',
        (SELECT * FROM deleted d WHERE d.pi_id = i.pi_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        (SELECT * FROM inserted i2 WHERE i2.pi_id = i.pi_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        1
    FROM inserted i
    JOIN deleted d ON i.pi_id = d.pi_id;

    -- DELETE log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'DELETE',
        'product_in',
        (SELECT * FROM deleted d2 WHERE d2.pi_id = d.pi_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        NULL,
        1
    FROM deleted d
    WHERE NOT EXISTS (SELECT 1 FROM inserted i WHERE i.pi_id = d.pi_id);
END;


Go


--------Trigger cho bảng user_tb
CREATE OR ALTER TRIGGER trg_Log_User_tb
ON user_tb
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @user_id INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);

    -- INSERT log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'INSERT',
        'user_tb',
        NULL,
        (SELECT * FROM inserted i WHERE i.user_id = p.user_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        1
    FROM inserted p
    WHERE NOT EXISTS (SELECT 1 FROM deleted d WHERE d.user_id = p.user_id);

    -- UPDATE log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'UPDATE',
        'user_tb',
        (SELECT * FROM deleted d WHERE d.user_id = i.user_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        (SELECT * FROM inserted i2 WHERE i2.user_id = i.user_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        1
    FROM inserted i
    JOIN deleted d ON i.user_id = d.user_id;

    -- DELETE log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'DELETE',
        'user_tb',
        (SELECT * FROM deleted d2 WHERE d2.user_id = d.user_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        NULL,
        1
    FROM deleted d
    WHERE NOT EXISTS (SELECT 1 FROM inserted i WHERE i.user_id = d.user_id);
END;
Go


--------Trigger cho bảng user_tb_2
CREATE OR ALTER TRIGGER trg_Log_User_tb_2
ON user_tb2
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @user_id INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);

    -- INSERT log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'INSERT',
        'user_tb2',
        NULL,
        (SELECT * FROM inserted i WHERE i.user_id = p.user_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        1
    FROM inserted p
    WHERE NOT EXISTS (SELECT 1 FROM deleted d WHERE d.user_id = p.user_id);

    -- UPDATE log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'UPDATE',
        'user_tb2',
        (SELECT * FROM deleted d WHERE d.user_id = i.user_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        (SELECT * FROM inserted i2 WHERE i2.user_id = i.user_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        1
    FROM inserted i
    JOIN deleted d ON i.user_id = d.user_id;

    -- DELETE log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'DELETE',
        'user_tb2',
        (SELECT * FROM deleted d2 WHERE d2.user_id = d.user_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        NULL,
        1
    FROM deleted d
    WHERE NOT EXISTS (SELECT 1 FROM inserted i WHERE i.user_id = d.user_id);
END;

Go



------Trigger cho shipment
--------Trigger cho bảng user_tb
CREATE OR ALTER TRIGGER trg_Log_Shipement
ON shipment
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @user_id INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);

    -- INSERT log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'INSERT',
        'shipment',
        NULL,
        (SELECT * FROM inserted i WHERE i.shipment_id = p.shipment_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        1
    FROM inserted p
    WHERE NOT EXISTS (SELECT 1 FROM deleted d WHERE d.shipment_id = p.shipment_id)

    -- UPDATE log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'UPDATE',
        'shipement',
        (SELECT * FROM deleted d WHERE d.shipment_id = i.shipment_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        (SELECT * FROM inserted i2 WHERE i2.shipment_id = i.shipment_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        1
    FROM inserted i
    JOIN deleted d ON i.shipment_id = d.shipment_id;

    -- DELETE log
    INSERT INTO change_history(user_id, date_act, type, table_change, old_val, new_val, status)
    SELECT 
        @user_id,
        GETDATE(),
        'DELETE',
        'shipment',
        (SELECT * FROM deleted d2 WHERE d2.shipment_id = d.shipment_id FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
        NULL,
        1
    FROM deleted d
    WHERE NOT EXISTS (SELECT 1 FROM inserted i WHERE i.shipment_id = d.shipment_id);
END;
go