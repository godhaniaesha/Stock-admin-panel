import React from 'react';
import '../styles/Z_styles.css';
import { Table } from 'react-bootstrap';
import { TbEye } from 'react-icons/tb';

function PaymentList(props) {
    const payments = [
        {
            id: 1,
            customerName: "Michael Anderson",
            orderId: "#ORD-7869",
            paymentMethod: "Credit Card",
            amount: "$95.00",
            status: "Completed"
        },
        {
            id: 2,
            customerName: "Sarah Johnson",
            orderId: "#ORD-7870",
            paymentMethod: "PayPal",
            amount: "$149.99",
            status: "Pending"
        },
        {
            id: 3,
            customerName: "David Wilson",
            orderId: "#ORD-7871",
            paymentMethod: "Debit Card",
            amount: "$89.99",
            status: "Failed"
        },
        {
            id: 4,
            customerName: "Emily Brown",
            orderId: "#ORD-7872",
            paymentMethod: "Credit Card",
            amount: "$65.00",
            status: "Completed"
        },
        {
            id: 5,
            customerName: "James Taylor",
            orderId: "#ORD-7873",
            paymentMethod: "Bank Transfer",
            amount: "$299.99",
            status: "Processing"
        }
    ];

    return (
        <>
            <section className='Z_product_section mx-0 mx-lg-5 my-3'>
                <div className="Z_table_wrapper">
                    <div className="Z_table_header">
                        <h4>All Payment List</h4>
                        <div className="Z_table_actions">
                            <select className="Z_time_filter">
                                <option>This Month</option>
                                <option>Last Month</option>
                                <option>Last 3 Months</option>
                            </select>
                        </div>
                    </div>
                    <div className="Z_table_scroll_container">
                        <Table className="Z_product_table">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="Z_custom_checkbox">
                                            <input type="checkbox" id="selectAll" className="Z_checkbox_input" />
                                            <label htmlFor="selectAll" className="Z_checkbox_label"></label>
                                        </div>
                                    </th>
                                    <th>Customer Name</th>
                                    <th>Order ID</th>
                                    <th>Payment Method</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td>
                                            <div className="Z_custom_checkbox">
                                                <input 
                                                    type="checkbox" 
                                                    id={`checkbox-${payment.id}`} 
                                                    className="Z_checkbox_input" 
                                                />
                                                <label 
                                                    htmlFor={`checkbox-${payment.id}`} 
                                                    className="Z_checkbox_label"
                                                ></label>
                                            </div>
                                        </td>
                                        <td>{payment.customerName}</td>
                                        <td>{payment.orderId}</td>
                                        <td>{payment.paymentMethod}</td>
                                        <td>{payment.amount}</td>
                                        <td>
                                            <span className={`Z_payment_status ${payment.status.toLowerCase()}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="Z_action_buttons">
                                                <button className="Z_action_btn Z_view_btn">
                                                    <TbEye size={22}/>
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
        </>
    );
}

export default PaymentList;