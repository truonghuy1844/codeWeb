// ConfirmModal.js
import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>❗ Xác nhận</h3>
                <p>{message}</p>
                <div className="actions">
                    <button onClick={onCancel}>Huỷ</button>
                    <button onClick={onConfirm} className="btn-delete">Xoá</button>
                </div>

            </div>
        </div>
    );
};

export default ConfirmModal;
