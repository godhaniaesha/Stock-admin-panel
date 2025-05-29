import React, { useState } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { Form, InputGroup, Accordion } from 'react-bootstrap';
import { IoIosArrowDown } from 'react-icons/io';

function FAQs() {
    const faqData = {
        general: {
            title: "General",
            questions: [
                {
                    question: "Can I use Dummy FAQs for my website or project?",
                    answer: "Yes, you can use these dummy FAQs as placeholders during development."
                },
                {
                    question: "Are Dummy FAQs suitable for customer support purposes?",
                    answer: "While they can serve as templates, it's recommended to use actual customer queries for support."
                },
                {
                    question: "Do Dummy FAQs require attribution?",
                    answer: "No, these are generic placeholders and don't require attribution."
                }
            ]
        },
        refunds: {
            title: "Refunds",
            questions: [
                {
                    question: "How do I request a refund?",
                    answer: "To request a refund, go to your order history and click the 'Request Refund' button."
                },
                {
                    question: "What is the refund policy?",
                    answer: "Our refund policy allows returns within 30 days of purchase with original packaging."
                },
                {
                    question: "How long does it take to process a refund?",
                    answer: "Refunds are typically processed within 3-5 business days."
                }
            ]
        },
        payments: {
            title: "Payments",
            questions: [
                {
                    question: "Can I test my website/app with Dummy Payments?",
                    answer: "Yes, Dummy Payments are commonly used by developers and businesses to test the functionality of e-commerce platforms, mobile apps, and payment gateways. They help identify and resolve issues without risking real transactions."
                },
                {
                    question: "Are Dummy Payments secure?",
                    answer: "Yes, dummy payments are conducted in a secure testing environment."
                },
                {
                    question: "How can I differentiate between a Dummy Payment and a real one?",
                    answer: "Dummy payments are clearly marked in the testing environment and don't process actual funds."
                }
            ]
        },
        support: {
            title: "Support",
            questions: [
                {
                    question: "How do I contact customer support?",
                    answer: "You can reach our customer support through email, live chat, or phone."
                },
                {
                    question: "Is customer support available 24/7?",
                    answer: "Yes, our customer support team is available 24/7 to assist you."
                },
                {
                    question: "How long does it take to receive a response from customer support?",
                    answer: "We typically respond within 24 hours of receiving your query."
                }
            ]
        }
    };

    return (
        <>
            <section className="Z_faq_section">
                <div className="Z_faq_header">
                    <h1>Frequently Asked Questions</h1>
                    <p>We're here to help with any questions you might have about our latest plans, pricing, and supported features.</p>
                    <div className="Z_faq_search">
                        <InputGroup>
                            <Form.Control
                                placeholder="Search..."
                                className="Z_search_input"
                            />
                            <InputGroup.Text className="Z_search_icon">
                                <BiSearchAlt size={20} />
                            </InputGroup.Text>
                        </InputGroup>
                    </div>
                </div>
            </section>

            <div className="Z_faq_content">
                {Object.entries(faqData).map(([key, section], sectionIndex) => (
                    <div key={key} className="Z_faq_section_wrapper">
                        <div className="Z_faq_category_header">
                            <h2 className="Z_faq_category_title">{section.title}</h2>
                            <div className="Z_faq_category_line"></div>
                        </div>
                        <Accordion className="Z_faq_accordion">
                            {section.questions.map((item, index) => (
                                <Accordion.Item key={index} eventKey={`${sectionIndex}-${index}`} className="Z_faq_item">
                                    <Accordion.Header className="Z_faq_header">
                                        <div className="Z_faq_question">
                                            <span className="Z_faq_question_number">Q{index + 1}</span>
                                            {item.question}
                                        </div>
                                        <IoIosArrowDown className="Z_faq_arrow" />
                                    </Accordion.Header>
                                    <Accordion.Body className="Z_faq_body">
                                        {item.answer}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </div>
                ))}
            </div>
        </>
    );
}

export default FAQs;