// SuccessModal.js
import React from 'react';
import './SuccessModal.css';

const SuccessModal = ({ message, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>✅ Thành công</h3>
                <p>{message}</p>
                <div className="actions">
                    <button className="btn-ok" onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;