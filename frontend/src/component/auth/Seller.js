import React, { useState } from 'react';
import '../../styles/seller.css';

function Seller() {
    const [formData, setFormData] = useState({
        gstNumber: '' // start empty
    });

    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null); // null, 'success', 'error'

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Convert to uppercase and remove spaces for GST format
        const formattedValue = value.toUpperCase().replace(/\s/g, '');

        setFormData((prevData) => ({
            ...prevData,
            [name]: formattedValue
        }));

        // Reset verification status when user types
        if (verificationStatus) {
            setVerificationStatus(null);
        }
    };

    const validateGSTFormat = (gstNumber) => {
        // Basic GST format validation: 2 digits + 10 alphanumeric + 1 digit + 1 letter + 1 alphanumeric
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
        return gstRegex.test(gstNumber);
    };

    const handleVerify = async () => {
        if (!formData.gstNumber.trim()) {
            alert('Please enter a GST number');
            return;
        }

        if (!validateGSTFormat(formData.gstNumber)) {
            setVerificationStatus('error');
            alert('Please enter a valid GST number format');
            return;
        }

        setIsVerifying(true);

        try {
            console.log('Verifying GST Number:', formData.gstNumber);

            // Simulate API call - replace with your actual verification logic
            await new Promise(resolve => setTimeout(resolve, 2000));

            // For demo purposes, randomly succeed or fail
            const isValid = Math.random() > 0.3; // 70% success rate

            if (isValid) {
                setVerificationStatus('success');
                console.log('GST verification successful');
            } else {
                setVerificationStatus('error');
                console.log('GST verification failed');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setVerificationStatus('error');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleVerify();
        }
    };

    return (

        <div className="d_auth_container" data-theme="dark">
            <div className="seller-header">
                <div className="Z_onboarding-steps">
                    <div className="Z_step Z_completed">
                        <div className="Z_circle">✓</div>
                        <small className="Z_label Z_completed-label">Account Creation</small>
                    </div>
                    <div className="Z_line Z_completed"></div>

                    <div className="Z_step Z_active">
                        <div className="Z_circle"></div>
                        <small className="Z_label">Seller Details</small>
                    </div>
                    <div className="Z_line"></div>

                    <div className="Z_step">
                        <div className="Z_circle"></div>
                        <small className="Z_label">Brand Details</small>
                    </div>
                    <div className="Z_line"></div>

                    <div className="Z_step">
                        <div className="Z_circle"></div>
                        <small className="Z_label">Bank Details</small>
                    </div>
                    <div className="Z_line"></div>

                    <div className="Z_step">
                        <div className="Z_circle"></div>
                        <small className="Z_label">Pickup Address</small>
                    </div>
                    <div className="Z_line"></div>

                    <div className="Z_step">
                        <div className="Z_circle"></div>
                        <small className="Z_label">Verify & Submit</small>
                    </div>
                </div>


                <div className='mt-5'>
                    <h2>Seller Details</h2>
                    <p>Enter the primary GST of your Business</p>
                </div>

                <div className="seller-form">
                    <div className="form-group">
                        <label htmlFor="gstNumber">GST Number</label>
                        <div className="input-wrapper">
                            <input
                                id="gstNumber"
                                type="text"
                                name="gstNumber"
                                placeholder="Enter GST number (e.g., 22AAAAA0000A1Z5)"
                                value={formData.gstNumber}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                maxLength={15}
                                className={verificationStatus === 'error' ? 'error' : verificationStatus === 'success' ? 'success' : ''}
                            />
                            {verificationStatus === 'success' && (
                                <span className="verification-icon success">✓</span>
                            )}
                            {verificationStatus === 'error' && (
                                <span className="verification-icon error">✗</span>
                            )}
                        </div>
                        {verificationStatus === 'error' && (
                            <small className="error-message">Invalid GST number. Please check and try again.</small>
                        )}
                        {verificationStatus === 'success' && (
                            <small className="success-message">GST number verified successfully!</small>
                        )}
                    </div>

                    <button
                        type="button"
                        className="verify-button"
                        onClick={handleVerify}
                        disabled={!formData.gstNumber.trim() || isVerifying}
                    >
                        {isVerifying ? 'Verifying...' : 'Verify'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Seller;