import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { getLowInventory } from "../redux/slice/inventory.Slice";
import { Table } from "react-bootstrap";
import { useEffect } from "react";
import { TbEdit, TbEye } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";

function StockAlert() {
  const { isDarkMode } = useOutletContext();
  const dispatch = useDispatch();

  const { lowInventory, isLoading, error } = useSelector(state => state.inventory);

  useEffect(() => {
    dispatch(getLowInventory());
  }, [dispatch]);

  return (
    <section className={`Z_product_section mx-0 mx-lg-5 my-3 ${isDarkMode ? 'd_dark' : 'd_light'}`}>
      <div className="Z_table_wrapper">
        <div className="Z_table_header">
          <h4>Low Stock Alert</h4>
          <div className="Z_table_actions">
            <select className="Z_time_filter">
              <option>All Items</option>
              <option>Critical Stock</option>
              <option>Warning Stock</option>
            </select>
          </div>
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
                  <th>
                    <div className="Z_custom_checkbox">
                      <input type="checkbox" id="selectAll" className="Z_checkbox_input" />
                      <label htmlFor="selectAll" className="Z_checkbox_label"></label>
                    </div>
                  </th>
                  <th>Product Name & Size</th>
                  {/* <th>Price</th> */}
                  <th>Stock Status</th>
                  <th>Category</th>
                  <th>Alert Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lowInventory.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>
                      <div className="Z_custom_checkbox">
                        <input type="checkbox" id={`checkbox-${index}`} className="Z_checkbox_input" />
                        <label htmlFor={`checkbox-${index}`} className="Z_checkbox_label"></label>
                      </div>
                    </td>
                    <td>
                      <div className="Z_product_info_cell">
                        <img
                          src={
                            item.product && item.product.images && item.product.images[0]
                              ? `http://localhost:2221/${item.product.images}`
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
                        <button className="Z_action_btn Z_view_btn">
                          <TbEye size={22} />
                        </button>
                        <button className="Z_action_btn Z_edit_btn">
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
          )}
        </div>
      </div>
    </section>
  );
}



export default StockAlert;
