import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Spinner } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import '../styles/Z_styles.css';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventories, deleteInventory } from '../redux/slice/inventory.Slice';
import { FaCaretDown, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { IMG_URL } from '../utils/baseUrl';

const StockOverview = () => {
  const { isDarkMode } = useOutletContext();
  const [timeFilter, setTimeFilter] = useState('thisMonth');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // console.log('StockOverview component rendered', productToDelete.product.productName);
  // console.log('StockOverview component rendered', productToDelete);                              
  const { inventory, isLoading, error } = useSelector((state) => state.inventory);
  console.log(inventory, "inventory");

  useEffect(() => {
    dispatch(fetchInventories());
  }, [dispatch]);

  const filterInventoriesByTime = (Inventories) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return (Inventories || []).filter(inventory => {
      if (!inventory || !inventory.createdAt) return false;
      const inventoryDate = new Date(inventory.createdAt);
      const inventoryMonth = inventoryDate.getMonth();
      const inventoryYear = inventoryDate.getFullYear();

      switch (timeFilter) {
        case 'thisMonth':
          return inventoryMonth === currentMonth && inventoryYear === currentYear;
        case 'lastMonth':
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return inventoryMonth === lastMonth && inventoryYear === lastMonthYear;
        case 'last3Months':
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return inventoryDate >= threeMonthsAgo;
        default:
          return true;
      }
    });
  };
  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };
  const filteredCategories = filterInventoriesByTime(inventory);

  // Add pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await dispatch(deleteInventory(productToDelete._id)).unwrap();
        setShowDeleteModal(false);
        setProductToDelete(null);
      } catch (error) {
        console.error('Failed to delete inventory:', error);
      }
    }
  };

  // const handleDeleteConfirm = async () => {
  //         if (productToDelete) {
  //             try {
  //                 await dispatch(deleteProduct(productToDelete._id)).unwrap();
  //                 setShowDeleteModal(false);
  //                 setProductToDelete(null);
  //             } catch (error) {
  //                 console.error('Failed to delete product:', error);
  //             }
  //         }
  //     };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
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

  return (
    <section className={`Z_product_section  ${isDarkMode ? 'd_dark' : 'd_light'} mx-0 mx-lg-2 my-md-3`}>
      <div className="Z_table_wrapper">
        <div className="Z_table_header">
          <h4>Stock Overview</h4>
          <div className="Z_table_actions">
            <button className="Z_add_product_btn" onClick={() => navigate('/stock/add')}>
              Add Stock
            </button>
            <div className="Z_select_wrapper d-flex">
              <select className="Z_time_filter"
                value={timeFilter}
                onChange={handleTimeFilterChange}>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="last3Months">Last 3 Months</option>
              </select>
              <div className="Z_select_caret">
                <FaCaretDown size={20} color="white" />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center p-4">Loading...</p>
        ) : error ? (
          <p className="text-center text-danger p-4">{error}</p>
        ) : (
          <div className="Z_table_scroll_container">
            <Table className="Z_product_table p-1">
              <thead>
                <tr>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Total Stock</th>
                  <th>Remaining Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => {
                  const product = item?.product;

                  return (
                    <tr key={item._id}>
                      <td>
                        <div className="Z_product_info_cell">
                          <img
                            src={
                              product?.images?.[0]
                                ? `${IMG_URL}${product.images[0]}`
                                : 'https://via.placeholder.com/60'
                            }
                            alt={product?.productName || 'N/A'}
                            className="Z_table_product_img"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="Z_table_product_name">
                          {product?.productName || 'N/A'}
                        </div>
                      </td>
                      <td>{product?.price || '-'}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <div className="Z_stock_info">
                          <div>{item.lowStockLimit} Items Left</div>
                        </div>
                      </td>
                      <td>
                        <div className="Z_action_buttons">
                          <button
                            className="Z_action_btn Z_edit_btn"
                            onClick={() => navigate(`/stock/edit/${item._id}`)}
                          >
                            <TbEdit size={22} />
                          </button>
                          <button
                            className="Z_action_btn Z_delete_btn"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <RiDeleteBin6Line size={22} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
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
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {/* <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete product "{productToDelete?.productData?.productName}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
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
          </Button>
        </Modal.Footer>
      </Modal> */}

      <Modal
        show={showDeleteModal}
        onHide={handleDeleteCancel}
        centered
        className={`z_delete_modal ${isDarkMode ? 'd_dark' : 'd_light'}`}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the product "{productToDelete?.product?.productName}"?
        </Modal.Body>
        <Modal.Footer>
          <button className="Z_btn Z_btn_cancel" onClick={handleDeleteCancel}>Cancel</button>
          <button className="Z_btn Z_btn_delete" onClick={handleDeleteConfirm}>Delete</button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default StockOverview;
