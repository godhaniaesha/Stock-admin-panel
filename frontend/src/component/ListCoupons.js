import React, { useEffect, useState } from 'react';
import '../styles/Z_styles.css';
import { Table, Modal } from 'react-bootstrap';
import { TbEdit } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BsCheckAll } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoupons, deleteCoupon } from '../redux/slice/coupon.slice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCaretDown, FaAngleLeft, FaAngleRight } from 'react-icons/fa';

function ListCoupons() {
    const { isDarkMode } = useOutletContext();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { coupons = [], isLoading = false, error = null } = useSelector(state => state.coupon || {});

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState(null);
    const [selectedCoupons, setSelectedCoupons] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [deleteMultiple, setDeleteMultiple] = useState(false);

    const [selectedTimeFilter, setSelectedTimeFilter] = useState('All');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    useEffect(() => {
        dispatch(fetchCoupons());
    }, [dispatch]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleDeleteClick = (coupon) => {
        setDeleteMultiple(false);
        setCouponToDelete(coupon);
        setShowDeleteModal(true);
    };

    const handleDeleteSelectedClick = () => {
        if (selectedCoupons.length === 0) return;
        setDeleteMultiple(true);
        setShowDeleteModal(true);
    };

    const handleDeleteCancel = () => {
        setCouponToDelete(null);
        setShowDeleteModal(false);
        setDeleteMultiple(false);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (deleteMultiple) {
                for (let id of selectedCoupons) {
                    await dispatch(deleteCoupon(id)).unwrap();
                }
                toast.success(`Deleted ${selectedCoupons.length} coupons successfully!`);
                setSelectedCoupons([]);
            } else if (couponToDelete) {
                await dispatch(deleteCoupon(couponToDelete._id)).unwrap();
                toast.success(`Coupon "${couponToDelete.title || couponToDelete.code}" deleted successfully!`);
            }
        } catch (err) {
            toast.error(`Delete failed: ${err.message || 'Unknown error'}`);
        } finally {
            setShowDeleteModal(false);
            setCouponToDelete(null);
            setDeleteMultiple(false);
            setSelectAll(false);
        }
    };

    const getFilteredCoupons = () => {
        let filtered = [...coupons];
        const now = new Date();

        if (selectedStatusFilter !== 'All') {
            filtered = filtered.filter(coupon =>
                coupon.status?.toLowerCase() === selectedStatusFilter.toLowerCase()
            );
        }

        if (selectedTimeFilter === 'This Month') {
            filtered = filtered.filter(coupon => {
                const d = new Date(coupon.createdAt);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });
        } else if (selectedTimeFilter === 'Last Month') {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            filtered = filtered.filter(coupon => {
                const d = new Date(coupon.createdAt);
                return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
            });
        } else if (selectedTimeFilter === 'Last 3 Months') {
            const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            filtered = filtered.filter(coupon => {
                const d = new Date(coupon.createdAt);
                return d >= threeMonthsAgo && d <= now;
            });
        }

        return filtered;
    };

    const handleCheckboxChange = (id) => {
        setSelectedCoupons(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        setSelectAll(prev => {
            const newValue = !prev;
            if (newValue) {
                setSelectedCoupons(getFilteredCoupons().map(c => c._id));
            } else {
                setSelectedCoupons([]);
            }
            return newValue;
        });
    };

    const displayedCoupons = getFilteredCoupons();

    // Add pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCoupons = displayedCoupons.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(displayedCoupons.length / itemsPerPage);

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 1;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 2) {
                for (let i = 1; i <= maxVisiblePages; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 1) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }
        return pageNumbers;
    };

    return (
        <section className={`Z_product_section mx-0 mx-lg-2 my-md-3 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
            <div className="Z_table_wrapper">
                <div className="Z_table_header">
                    <h4>All Coupons List</h4>
                    <div className="Z_table_actions">
                        <button className="Z_add_product_btn" onClick={() => navigate('/coupons/add')}>Add Coupon</button>
                        <button className="Z_add_product_btn" onClick={handleDeleteSelectedClick}>Delete Selected</button>
                        <div className='Z_select_wrapper'>
                            <select
                                className="Z_time_filter"
                                value={selectedStatusFilter}
                                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="FuturePlan">Future Plan</option>

                            </select>
                            <div className="Z_select_caret"><FaCaretDown size={20} color='white' /></div>
                        </div>
                    </div>
                </div>
                <div className="Z_table_scroll_container">
                    {isLoading ? (
                        <p>Loading coupons...</p>
                    ) : error ? (
                        <p className="text-danger">Error: {error}</p>
                    ) : displayedCoupons.length === 0 ? (
                        <p>No coupons found matching your criteria.</p>
                    ) : (
                        <Table className="Z_product_table p-1">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="Z_custom_checkbox">
                                            <input type="checkbox" id="selectAll" className="Z_checkbox_input" checked={selectAll} onChange={handleSelectAll} />
                                            <label htmlFor="selectAll" className="Z_checkbox_label"></label>
                                        </div>
                                    </th>
                                    <th>Code</th>
                                    <th>Discount</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCoupons.map((coupon) => (
                                    <tr key={coupon._id}>
                                        <td>
                                            <div className="Z_custom_checkbox">
                                                <input
                                                    type="checkbox"
                                                    id={`checkbox-${coupon._id}`}
                                                    className="Z_checkbox_input"
                                                    checked={selectedCoupons.includes(coupon._id)}
                                                    onChange={() => handleCheckboxChange(coupon._id)}
                                                />
                                                <label htmlFor={`checkbox-${coupon._id}`} className="Z_checkbox_label"></label>
                                            </div>
                                        </td>
                                        <td><span className="Z_coupon_code">{coupon.title || 'N/A'}</span></td>
                                        <td>{coupon.discountPercentage ? `${coupon.discountPercentage}%` : (coupon.discountValue ? `$${coupon.discountValue}` : 'N/A')}</td>
                                        <td>{formatDate(coupon.startDate)}</td>
                                        <td>{formatDate(coupon.endDate)}</td>
                                        <td>
                                            <span className={`Z_coupon_status d-flex align-items-center ${coupon.status?.toLowerCase() || 'inactive'}`}>
                                                {coupon.status?.toLowerCase() === 'active' ? (
                                                    <BsCheckAll className="me-1" size={14} />
                                                ) : (
                                                    <AiOutlineClose className="me-1" size={14} />
                                                )}
                                                {coupon.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="Z_action_buttons">
                                                <button
                                                    className="Z_action_btn Z_edit_btn"
                                                    onClick={() => navigate(`/coupons/edit/${coupon._id}`)}
                                                >
                                                    <TbEdit size={22} />
                                                </button>
                                                <button
                                                    className="Z_action_btn Z_delete_btn"
                                                    onClick={() => handleDeleteClick(coupon)}
                                                >
                                                    <RiDeleteBin6Line size={22} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
                <div className="Z_pagination d-flex justify-content-end align-items-center mt-4">
                    <button
                        className="Z_page_btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        <FaAngleLeft />
                    </button>
                    {getPageNumbers().map((number, index) => (
                        <button
                            key={index}
                            className={`Z_page_btn ${currentPage === number ? 'active' : ''} ${typeof number !== 'number' ? 'disabled' : ''}`}
                            onClick={() => typeof number === 'number' ? setCurrentPage(number) : null}
                            disabled={typeof number !== 'number'}
                        >
                            {number}
                        </button>
                    ))}
                    <button
                        className="Z_page_btn"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        <FaAngleRight />
                    </button>
                </div>
            </div>

            <Modal
                show={showDeleteModal}
                onHide={handleDeleteCancel}
                centered
                className='d_delete_model'
            >
                <Modal.Header closeButton className={isDarkMode ? 'dark-modal-header' : ''}>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body className={isDarkMode ? 'dark-modal-body' : ''}>
                    {deleteMultiple ? (
                        <>
                            Are you sure you want to delete <strong>{selectedCoupons.length}</strong> selected coupons?
                        </>
                    ) : (
                        <>
                            Are you sure you want to delete the coupon "<strong>{couponToDelete?.title || couponToDelete?.code || 'N/A'}</strong>"?
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className={isDarkMode ? 'dark-modal-footer' : ''}>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-center' }}>
                        <button className="Z_btn Z_btn_cancel" onClick={handleDeleteCancel} disabled={isLoading}>Cancel</button>
                        <button className="Z_btn Z_btn_delete" onClick={handleDeleteConfirm} disabled={isLoading}>
                            {isLoading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </section>
    );
}

export default ListCoupons;
