// ConfirmModal.js

// src/Modal/ConfirmModal.js
import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal-content">
                <h3 className="confirm-modal-title">
                    <span className="confirm-modal-icon">❗</span> Xác nhận
                </h3>
                <p className="confirm-modal-message">{message}</p>
                <div className="confirm-modal-actions">
                    <button
                        onClick={onCancel}
                        className="confirm-modal-btn cancel"
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={onConfirm}
                        className="confirm-modal-btn delete"
                    >
                        Xoá
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

