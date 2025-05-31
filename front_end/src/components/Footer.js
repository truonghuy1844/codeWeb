import React from 'react';
import './Footer.css';
import { FaInstagram, FaYoutube, FaFacebookF, FaTwitter, FaPinterestP } from 'react-icons/fa';
import { MdAccessTime, MdEmail, MdPhone } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img
          src="https://img.freepik.com/premium-vector/colorful-illustrative-educational-kids-toy-store-logo_1343544-69.jpg?semt=ais_hybrid&w=740"
          alt="Toys"
        />
      </div>

      <div className="footer-right">
        <h2 className="footer-logo">TOY STORE</h2>

        <p className="footer-follow">Theo dõi chúng tôi</p>
        <div className="footer-socials">
          <FaInstagram />
          <FaYoutube />
          <FaFacebookF />
          <FaTwitter />
          <FaPinterestP />
        </div>

        <div className="footer-contact">
          <h4>Thông tin liên hệ</h4>
          <p><MdAccessTime /> Thứ 2 - Thứ 7: 8:00 - 17:00</p>
          <p><MdAccessTime /> Chủ nhật: 8:00 - 12:00</p>
          <p><MdPhone /> <a href="tel:123456789">123 456 789</a></p>
          <p><MdEmail /> <a href="mailto:toystore@gmail.com">toystore@gmail.com</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
