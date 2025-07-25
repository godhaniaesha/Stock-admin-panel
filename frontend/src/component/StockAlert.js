import { useDispatch, useSelector } from "react-redux";
import { useOutletContext, useNavigate } from "react-router-dom";
import { getLowInventory, deleteInventory } from "../redux/slice/inventory.Slice";
import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { TbEdit, TbEye } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IMG_URL } from "../utils/baseUrl";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

function StockAlert() {
  const { isDarkMode } = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { lowInventory, isLoading, error } = useSelector(state => state.inventory);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Add pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = lowInventory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(lowInventory.length / itemsPerPage);

  useEffect(() => {
    dispatch(getLowInventory());
  }, [dispatch]);

  const handleEditClick = (item) => {
    // Navigate to edit page with the item ID
    navigate(`/stock/edit/${item._id}`, {
      state: {
        itemData: item
      }
    });
  };

  const handleDeleteClick = async (itemId) => {
    console.log("itemId", itemId)
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await dispatch(deleteInventory(itemId)).unwrap();
        // Refresh the list after successful deletion
        dispatch(getLowInventory());
      } catch (error) {
        console.error('Failed to delete inventory:', error);
      }
    }
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
    <section className={`Z_product_section mx-0 mx-lg-2 my-md-3 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
      <div className="Z_table_wrapper">
        <div className="Z_table_header">
          <h4>Low Stock Alert</h4>
        </div>

        <div className="Z_table_scroll_container">
          {isLoading ? (
            <p className="text-center p-3">Loading...</p>
          ) : error ? (
            <p className="text-center text-danger p-3">{error}</p>
          ) : (
            <Table className="Z_product_table p-1">
              <thead>
                <tr>
                 
                  <th>Product Name & Size</th>
                  {/* <th>Price</th> */}
                  <th>Stock Status</th>
                  <th>Category</th>
                  <th>Alert Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item._id || index}>
                   
                    <td>
                      <div className="Z_product_info_cell">
                        <img
                          src={
                            item.product && item.product.images && item.product.images[0]
                              ? `${IMG_URL}${item.product.images}`
                              : '/no-image.png'
                          }
                          alt={item.product?.productName || 'No Name'}
                          className="Z_table_product_img"
                        />
                        <div>
                          <div className="Z_table_product_name">{item.product?.productName || 'No Name'}</div>
                          {/* <div className="Z_table_product_size">Size: {item.product?.size || 'N/A'}</div> */}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="Z_stock_info">
                        <div>{item.quantity} Items Left</div>
                        <div className="Z_stock_sold">Threshold: {item.lowStockLimit}</div>
                        <div className={`Z_stock_status ${item.quantity <= item.lowStockLimit / 2 ? 'critical' : 'warning'}`}>
                          {item.quantity <= item.lowStockLimit / 2 ? 'Critical Stock' : 'Low Stock'}
                        </div>
                      </div>
                    </td>
                    <td>{item.category?.title || 'N/A'}</td>
                    <td>
                      <span
                        className={`Z_order_status ${item.quantity <= item.lowStockLimit / 2 ? 'critical' : 'warning'
                          }`}
                      >
                        {item.quantity <= item.lowStockLimit / 2 ? 'Critical' : 'Warning'}
                      </span>
                    </td>
                    <td>
                      <div className="Z_action_buttons">
                      
                        <button
                          className="Z_action_btn Z_edit_btn"
                          onClick={() => handleEditClick(item)}
                        >
                          <TbEdit size={22} />
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
    </section>
  );
}

export default StockAlert;
