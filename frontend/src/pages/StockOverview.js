import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Spinner } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import '../styles/Z_styles.css';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventories, deleteInventory } from '../redux/slice/inventory.Slice';
import { FaCaretDown } from 'react-icons/fa';

const StockOverview = () => {
  const { isDarkMode } = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { inventory, isLoading, error } = useSelector((state) => state.inventory);
  console.log(inventory, "inventory");

  useEffect(() => {
    dispatch(fetchInventories());
  }, [dispatch]);

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

  return (
    <section className={`Z_product_section  ${isDarkMode ? 'd_dark' : 'd_light'} mx-0 mx-lg-5 my-md-3`}>
      <div className="Z_table_wrapper">
        <div className="Z_table_header">
          <h4>Stock Overview</h4>
          <div className="Z_table_actions">
            <button className="Z_add_product_btn" onClick={() => navigate('/stock/add')}>Add Stock</button>
            <div className="Z_select_wrapper d-flex">
              <select className="Z_time_filter">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
              </select>
              <div className="Z_select_caret"><FaCaretDown size={20} color='white' /></div>
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
                {inventory.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="Z_product_info_cell">
                        <img
                          src={`http://localhost:2221/${product.productData?.images[0]}`}
                          alt={product.productData?.productName || 'N/A'}
                          className="Z_table_product_img"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="Z_table_product_name">
                        {product.productData?.productName || 'N/A'}
                      </div>
                    </td>
                    <td>{product.productData?.price || '-'}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <div className="Z_stock_info">
                        <div>{product.lowStockLimit} Items Left</div>
                      </div>
                    </td>
                    <td>
                      <div className="Z_action_buttons">
                        <button 
                          className="Z_action_btn Z_edit_btn"
                          onClick={() => navigate(`/stock/edit/${product._id}`)}
                        >
                          <TbEdit size={22} />
                        </button>
                        <button 
                          className="Z_action_btn Z_delete_btn"
                          onClick={() => handleDeleteClick(product)}
                        >
                          <RiDeleteBin6Line size={22} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
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
      </Modal>
    </section>
  );
};

export default StockOverview;
