import React, { useState, useEffect } from 'react';
import '../styles/conditions.css';

function TeamsNDConditions() {
    const [activeSection, setActiveSection] = useState(1);
    const [emailChecked, setEmailChecked] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const contentSection = document.querySelector('.Z_terms_content');
            if (!contentSection) return;

            const sections = contentSection.querySelectorAll('.Z_terms_content_section');
            const scrollPosition = contentSection.scrollTop;

            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const contentRect = contentSection.getBoundingClientRect();
                const relativeTop = rect.top - contentRect.top;

                if (relativeTop <= 100 && relativeTop + rect.height > 100) {
                    setActiveSection(index + 1);
                }
            });
        };

        const contentSection = document.querySelector('.Z_terms_content');
        if (contentSection) {
            contentSection.addEventListener('scroll', handleScroll);
            return () => contentSection.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const scrollToSection = (sectionNumber) => {
        const section = document.querySelector(`#section-${sectionNumber}`);
        const contentSection = document.querySelector('.Z_terms_content');
        if (section && contentSection) {
            contentSection.scrollTo({
                top: section.offsetTop - 20,
                behavior: 'smooth'
            });
        }
        setIsSidebarOpen(false); // Close sidebar after selection on mobile
    };

    return (
        <div className="Z_terms_section">
            <div className="Z_terms_header">
                <button 
                    className="Z_terms_menu_toggle"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <h1>Terms of Service</h1>
                <p className="Z_terms_date">Updated April 2020</p>
            </div>

            <div className="Z_terms_container">
                <div className={`Z_terms_sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    {/* Sidebar content remains the same */}
                    <div className={`Z_terms_nav_item ${activeSection === 1 ? 'active' : ''}`}
                         onClick={() => scrollToSection(1)}>
                        <span className="Z_terms_nav_number">1</span>
                        <span>Accepting the terms</span>
                    </div>
                    <div className={`Z_terms_nav_item ${activeSection === 2 ? 'active' : ''}`}
                         onClick={() => scrollToSection(2)}>
                        <span className="Z_terms_nav_number">2</span>
                        <span>Changes to terms</span>
                    </div>
                    <div className={`Z_terms_nav_item ${activeSection === 3 ? 'active' : ''}`}
                         onClick={() => scrollToSection(3)}>
                        <span className="Z_terms_nav_number">3</span>
                        <span>Using our product</span>
                    </div>
                    <div className={`Z_terms_nav_item ${activeSection === 4 ? 'active' : ''}`}
                         onClick={() => scrollToSection(4)}>
                        <span className="Z_terms_nav_number">4</span>
                        <span>General restrictions</span>
                    </div>
                    <div className={`Z_terms_nav_item ${activeSection === 5 ? 'active' : ''}`}
                         onClick={() => scrollToSection(5)}>
                        <span className="Z_terms_nav_number">5</span>
                        <span>Content policy</span>
                    </div>
                    <div className={`Z_terms_nav_item ${activeSection === 6 ? 'active' : ''}`}
                         onClick={() => scrollToSection(6)}>
                        <span className="Z_terms_nav_number">6</span>
                        <span>Your rights</span>
                    </div>
                    <div className={`Z_terms_nav_item ${activeSection === 7 ? 'active' : ''}`}
                         onClick={() => scrollToSection(7)}>
                        <span className="Z_terms_nav_number">7</span>
                        <span>Copyright policy</span>
                    </div>
                    <div className={`Z_terms_nav_item ${activeSection === 8 ? 'active' : ''}`}
                         onClick={() => scrollToSection(8)}>
                        <span className="Z_terms_nav_number">8</span>
                        <span>Relationship guidelines</span>
                    </div>
                    <div className={`Z_terms_nav_item ${activeSection === 9 ? 'active' : ''}`}
                         onClick={() => scrollToSection(9)}>
                        <span className="Z_terms_nav_number">9</span>
                        <span>Liability Policy</span>
                    </div>
                    <div className={`Z_terms_nav_item ${activeSection === 10 ? 'active' : ''}`}
                         onClick={() => scrollToSection(10)}>
                        <span className="Z_terms_nav_number">10</span>
                        <span>General legal terms</span>
                    </div>
                </div>

                <div className="Z_terms_content">
                    {/* Content sections remain the same */}
                    <div id="section-1" className="Z_terms_content_section">
                        <h2>Accepting the terms</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer volutpat dui libero, ut tempor justo dignissim. Vestibulum vel tellus nunc. Curabitur vel sapien nunc. Nullam non ornare lorem, nec convallis velit. Morbi sagittis nisi quis eros sollicitudin, sit amet scelerisque erat vulputate.</p>
                    </div>
                    <div id="section-2" className="Z_terms_content_section">
                        <h2>Changes to terms</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                    </div>
                    <div id="section-3" className="Z_terms_content_section">
                        <h2>Using our product</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                    </div>
                    <div id="section-4" className="Z_terms_content_section">
                        <h2>General restrictions</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                    </div>
                    <div id="section-5" className="Z_terms_content_section">
                        <h2>Content policy</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                    </div>
                    <div id="section-6" className="Z_terms_content_section">
                        <h2>Your rights</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                    </div>
                    <div id="section-7" className="Z_terms_content_section">
                        <h2>Copyright policy</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                    </div>
                    <div id="section-8" className="Z_terms_content_section">
                        <h2>Relationship guidelines</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                    </div>
                    <div id="section-9" className="Z_terms_content_section">
                        <h2>Liability Policy</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                    </div>
                    <div id="section-10" className="Z_terms_content_section">
                        <h2>General legal terms</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                    </div>
                </div>
            </div>

            <div className="Z_terms_footer">
                {/* <label className="Z_terms_checkbox">
                    <input 
                        type="checkbox" 
                        checked={emailChecked}
                        onChange={(e) => setEmailChecked(e.target.checked)}
                    />
                    <span>Send copy to my email</span>
                </label> */}
                <button className="Z_terms_agree_btn">I AGREE</button>
            </div>

            {isSidebarOpen && (
                <div 
                    className="Z_terms_overlay"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}

export default TeamsNDConditions;