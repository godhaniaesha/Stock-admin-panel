import React from 'react';
import '../styles/UserDetail.css';
import { useOutletContext } from 'react-router-dom';

export default function UserDetail() {
  const { isDarkMode } = useOutletContext();

  return (
    <div className={`container py-4 d_userdetail_wrapper ${isDarkMode ? 'd_dark' : 'd_light'}`}>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow d_userdetail_card p-4">
            <div className="row align-items-center">
              <div className="col-md-4 text-center d_userdetail_left py-4 rounded">
                <div className="d_userdetail_image_wrapper mb-3 mx-auto">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="User Profile"
                    className="rounded-circle img-fluid d_userdetail_image"
                  />
                </div>
                <h5 className="d_userdetail_name mb-1">ASDkk Babariya</h5>
                <span className="d_userdetail_role">Seller</span>
              </div>
              <div className="col-md-8 pt-4 pt-md-0">
                <h4 className="d_userdetail_section_title">User Information</h4>
                <div className="d_userdetail_info_grid">
                  <div className="d_userdetail_info_item">
                    <label className="d_userdetail_label">Email</label>
                    <span className="d_userdetail_value">yatrbbbi@gmail.com</span>
                  </div>
                  <div className="d_userdetail_info_item">
                    <label className="d_userdetail_label">Phone</label>
                    <span className="d_userdetail_value">09106722109</span>
                  </div>
                  <div className="d_userdetail_info_item">
                    <label className="d_userdetail_label">Birthdate</label>
                    <span className="d_userdetail_value">March 2, 2000</span>
                  </div>
                  <div className="d_userdetail_info_item">
                    <label className="d_userdetail_label">Gender</label>
                    <span className="d_userdetail_value">Female</span>
                  </div>
                  <div className="d_userdetail_info_item">
                    <label className="d_userdetail_label">Address</label>
                    <span className="d_userdetail_value">B-1102, Apple Avenue, Gujarat</span>
                  </div>
                  <div className="d_userdetail_info_item">
                    <label className="d_userdetail_label">City</label>
                    <span className="d_userdetail_value">Surat</span>
                  </div>
                  <div className="d_userdetail_info_item">
                    <label className="d_userdetail_label">State</label>
                    <span className="d_userdetail_value">Gujarat</span>
                  </div>
                  <div className="d_userdetail_info_item">
                    <label className="d_userdetail_label">Country</label>
                    <span className="d_userdetail_value">India</span>
                  </div>
                </div>
                <div className="text-end mt-4">
                  <button className="btn d_userdetail_edit_btn">Edit Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
