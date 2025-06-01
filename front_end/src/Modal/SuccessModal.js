// SuccessModal.js

import React from 'react';

const SuccessModal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-80 max-w-[90%] p-6 shadow-lg">
                <h3 className="flex items-center justify-center text-lg font-semibold text-green-600 mb-4">
                    <span className="text-2xl mr-2">✅</span> Thành công
                </h3>
                <p className="text-center text-gray-700 mb-6">{message}</p>
                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
