import React from 'react';
import { Table } from 'react-bootstrap';
import { TbEdit, TbEye } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import '../styles/Z_styles.css';
import { useOutletContext } from 'react-router-dom';

const StockOverview = () => {
  const { isDarkMode } = useOutletContext();

  const products = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      name: "Classic White Sneakers",
      price: "$95.00",
      stock: 324,
      remainingStock: 146,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      name: "Leather Crossbody Bag",
      price: "$149.99",
      stock: 156,
      remainingStock: 89,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a",
      name: "Denim Jacket",
      price: "$89.99",
      stock: 428,
      remainingStock: 116,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
      name: "Summer Floral Dress",
      price: "$65.00",
      stock: 245,
      remainingStock: 56,
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f",
      name: "Smart Watch Pro",
      price: "$299.99",
      stock: 89,
      remainingStock: 23,
    }
  ];

  return (
    <section className={`Z_product_section w-100 ${isDarkMode ? 'd_dark' : 'd_light'} mx-0 mx-lg-5 my-3`}>
      <div className="Z_table_wrapper">
        <div className="Z_table_header">
          <h4>Stock Overview</h4>
          <div className="Z_table_actions">
            <button className="Z_add_product_btn">Add Stock</button>
            <select className="Z_time_filter">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>
        </div>
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
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="Z_product_info_cell">
                      <img src={product.image} alt={product.name} className="Z_table_product_img" />
                    </div>
                  </td>
                  <td>
                    <div className="Z_table_product_name">{product.name}</div>
                  </td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="Z_stock_info">
                      <div>{product.remainingStock} Items Left</div>
                    </div>
                  </td>
                  <td>
                    <div className="Z_action_buttons">
                      <button className="Z_action_btn Z_view_btn">
                        <TbEye size={22}/>
                      </button>
                      <button className="Z_action_btn Z_edit_btn">
                        <TbEdit size={22}/>
                      </button>
                      <button className="Z_action_btn Z_delete_btn">
                        <RiDeleteBin6Line size={22}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default StockOverview;