import React, { useEffect, useState } from 'react';
import '../styles/Z_styles.css';
import { Table, Modal, Button, Spinner } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaAngleLeft, FaAngleRight, FaCaretDown } from 'react-icons/fa';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubcategories, deleteSubcategory } from '../redux/slice/subCategory.slice';
import { IMG_URL } from '../utils/baseUrl';

function SubcategoryList() {
    const { isDarkMode } = useOutletContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { subcategories, isLoading, error } = useSelector((state) => state.subcategory);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [subcategoryToDelete, setSubcategoryToDelete] = useState(null);
    const [timeFilter, setTimeFilter] = useState('thisMonth');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(fetchSubcategories());
    }, [dispatch]);

    const handleAddSubcategory = () => {
        navigate('/subcategories/add');
    };

    const handleEdit = (subcategory) => {
        navigate('/subcategories/edit', { state: { subcategoryData: subcategory } });
    };

    const handleDeleteClick = (subcategory) => {
        setSubcategoryToDelete(subcategory);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (subcategoryToDelete) {
            try {
                await dispatch(deleteSubcategory(subcategoryToDelete._id)).unwrap();
                setShowDeleteModal(false);
                setSubcategoryToDelete(null);
            } catch (error) {
                console.error('Failed to delete subcategory:', error);
            }
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setSubcategoryToDelete(null);
    };

    const handleTimeFilterChange = (e) => {
        setTimeFilter(e.target.value);
    };

    const filterSubcategoriesByTime = (subcategories) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return subcategories.filter(subcategory => {
            const subcategoryDate = new Date(subcategory.createdAt);
            const subcategoryMonth = subcategoryDate.getMonth();
            const subcategoryYear = subcategoryDate.getFullYear();

            switch (timeFilter) {
                case 'thisMonth':
                    return subcategoryMonth === currentMonth && subcategoryYear === currentYear;
                case 'lastMonth':
                    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                    return subcategoryMonth === lastMonth && subcategoryYear === lastMonthYear;
                case 'last3Months':
                    const threeMonthsAgo = new Date(now);
                    threeMonthsAgo.setMonth(now.getMonth() - 3);
                    return subcategoryDate >= threeMonthsAgo;
                default:
                    return true;
            }
        });
    };

    const filteredSubcategories = filterSubcategoriesByTime(subcategories);

    const totalPages = Math.ceil(filteredSubcategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSubcategories = filteredSubcategories.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 1;
    if (totalPages <= maxVisiblePages + 1) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (totalPages > 2) {
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (totalPages === 2) {
        pageNumbers.push(2);
      }
    }
    return pageNumbers;
  };

    // Handle checkbox selection
    const handleSubcategorySelection = (subcategoryId) => {
        setSelectedSubcategories(prev =>
            prev.includes(subcategoryId)
                ? prev.filter(id => id !== subcategoryId)
                : [...prev, subcategoryId]
        );
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectedSubcategories.length === currentSubcategories.length) {
            setSelectedSubcategories([]);
        } else {
            setSelectedSubcategories(currentSubcategories.map(sub => sub._id));
        }
    };

    // Handle bulk delete
    const handleBulkDelete = () => {
        setShowBulkDeleteModal(true);
    };

    const confirmBulkDelete = async () => {
        if (selectedSubcategories.length > 0) {
            try {
                await Promise.all(
                    selectedSubcategories.map(id => dispatch(deleteSubcategory(id)).unwrap())
                );
                setSelectedSubcategories([]);
                setShowBulkDeleteModal(false);
            } catch (error) {
                console.error('Bulk delete error:', error);
            }
        }
    };

    if (isLoading) {
        return <div>Loading subcategories...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <section className={`Z_product_section mx-0 mx-lg-2 my-md-3 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
                <div className="Z_table_wrapper">
                    <div className="Z_table_header flex-wrap">
                        <h4>All Subcategory List</h4>
                        <div className="Z_table_actions flex-wrap">
                            <button className="Z_add_product_btn text-nowrap" onClick={handleAddSubcategory}>Add Subcategory</button>
                            <div className='Z_select_wrapper'>
                                <select
                                    className="Z_time_filter"
                                    value={timeFilter}
                                    onChange={handleTimeFilterChange}
                                >
                                    <option value="thisMonth">This Month</option>
                                    <option value="lastMonth">Last Month</option>
                                    <option value="last3Months">Last 3 Months</option>
                                </select>
                                <div className="Z_select_caret"><FaCaretDown size={20} color='white' /></div>
                            </div>
                            {selectedSubcategories.length > 0 && (
                                <button
                                    className="Z_add_product_btn text-nowrap"
                                    onClick={handleBulkDelete}
                                    disabled={isLoading}
                                >
                                    Delete Selected ({selectedSubcategories.length})
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="Z_table_scroll_container">
                        <Table className="Z_product_table p-1">
                            <thead>
                                <tr>
                                    {/* <th>
                                        <div className="Z_custom_checkbox">
                                            <input
                                                type="checkbox"
                                                id="selectAll"
                                                className="Z_checkbox_input"
                                                checked={selectedSubcategories.length === currentSubcategories.length && currentSubcategories.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                            <label htmlFor="selectAll" className="Z_checkbox_label"></label>
                                        </div>
                                    </th> */}
                                    {/* <th>Subcategory ID</th> */}
                                    <th>Category Name</th>
                                    <th>Subcategory Details</th>
                                    <th>Description</th>
                                    {/* <th>Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {currentSubcategories.map((subcategory) => (
                                    <tr key={subcategory._id}>
                                        {/* <td>
                                            <div className="Z_custom_checkbox">
                                                <input
                                                    type="checkbox"
                                                    id={`checkbox-${subcategory._id}`}
                                                    className="Z_checkbox_input"
                                                    checked={selectedSubcategories.includes(subcategory._id)}
                                                    onChange={() => handleSubcategorySelection(subcategory._id)}
                                                />
                                                <label
                                                    htmlFor={`checkbox-${subcategory._id}`}
                                                    className="Z_checkbox_label"
                                                ></label>
                                            </div>
                                        </td> */}
                                        {/* <td>#{subcategory._id}</td> */}
                                        <td>
                                            <div className="Z_category_name_cell">
                                                <div className="Z_table_product_name">{subcategory.category?.title || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="Z_subcategory_details_cell">
                                                <img
                                                    src={`${IMG_URL}${subcategory.image}`}
                                                    alt={subcategory.subcategoryTitle}
                                                    className="Z_table_subcategory_img"
                                                    width={60}
                                                    height={60}
                                                />
                                                <div className="Z_table_subcategory_name">{subcategory.subcategoryTitle}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="Z_category_description_cell">
                                                <div className="Z_table_product_description">{subcategory.description || 'No description'}</div>
                                            </div>
                                        </td>
                                        {/* <td>
                                            <div className="Z_action_buttons">
                                          
                                                <button
                                                    className="Z_action_btn Z_edit_btn"
                                                    onClick={() => handleEdit(subcategory)}
                                                >
                                                    <TbEdit size={22} />
                                                </button>
                                                <button
                                                    className="Z_action_btn Z_delete_btn"
                                                    onClick={() => handleDeleteClick(subcategory)}
                                                >
                                                    <RiDeleteBin6Line size={22} />
                                                </button>
                                            </div>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <div className="Z_pagination d-flex justify-content-end align-items-center mt-4">
                        <button
                            className="Z_page_btn"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <FaAngleLeft />
                        </button>
                        {getPageNumbers().map((pageNum, index) => (
                            <button
                                key={index}
                                className={`Z_page_btn ${currentPage === pageNum ? 'active' : ''} ${typeof pageNum !== 'number' ? 'disabled' : ''}`}
                                onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : null}
                                disabled={typeof pageNum !== 'number'}
                            >
                                {pageNum}
                            </button>
                        ))}
                        <button
                            className="Z_page_btn"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            <FaAngleRight />
                        </button>
                    </div>
                </div>
            </section>

            {/* Single Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}
                centered
                className={`z_delete_modal ${isDarkMode ? 'd_dark' : 'd_light'}`}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete subcategory "{subcategoryToDelete?.subcategoryTitle}"? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <button className="Z_btn Z_btn_cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                    <button className="Z_btn Z_btn_delete" onClick={handleDeleteConfirm}>Delete</button>
                    {/* <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDeleteConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </Button> */}
                </Modal.Footer>
            </Modal>

            {/* Bulk Delete Modal */}
            <Modal show={showBulkDeleteModal} onHide={() => setShowBulkDeleteModal(false)}
                centered
                className={`z_delete_modal ${isDarkMode ? 'd_dark' : 'd_light'}`}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Bulk Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <strong>{selectedSubcategories.length}</strong> selected subcategory(s)? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <button className="Z_btn Z_btn_cancel" onClick={() => setShowBulkDeleteModal(false)}>Cancel</button>
                    <button
                        className="Z_btn Z_btn_delete" a
                        onClick={confirmBulkDelete}
                    >
                        Delete
                    </button>
                    {/* <Button variant="secondary" onClick={() => setShowBulkDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmBulkDelete} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Deleting...
                            </>
                        ) : (
                            'Confirm Delete'
                        )}
                    </Button> */}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SubcategoryList;