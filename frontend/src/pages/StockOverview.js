import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import '../styles/Z_styles.css';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventories } from '../redux/slice/inventory.Slice';

const StockOverview = () => {
  const { isDarkMode } = useOutletContext();
  const dispatch = useDispatch();
    const navigate = useNavigate(); // ✅ Initialize navigate


  const { inventory, isLoading, error } = useSelector((state) => state.inventory);
  console.log(inventory, "inventory");


  useEffect(() => {
    dispatch(fetchInventories());
  }, [dispatch]);

  return (
    <section className={`Z_product_section  ${isDarkMode ? 'd_dark' : 'd_light'} mx-0 mx-lg-5 my-md-3`}>
      <div className="Z_table_wrapper">
        <div className="Z_table_header">
          <h4>Stock Overview</h4>
          <div className="Z_table_actions">
            <button className="Z_add_product_btn" onClick={() => navigate('/stock/add')}>Add Stock</button>
            <select className="Z_time_filter">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>
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
                          // src={product.productData?.images[0] || 'https://via.placeholder.com/60'}
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
                     
                        <button className="Z_action_btn Z_edit_btn"
                         onClick={() => navigate(`/stock/edit/${product._id}`)} // ✅ Navigate on click
                         >
                          <TbEdit size={22} />
                        </button>
                        <button className="Z_action_btn Z_delete_btn">
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
    </section>
  );
};

export default StockOverview;
