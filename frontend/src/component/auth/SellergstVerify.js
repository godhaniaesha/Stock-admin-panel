import React, { useState, useRef } from 'react';
import '../../styles/seller.css';

function SellergstVerify() {
    const [showGstVerification, setShowGstVerification] = useState(true);
    const [showOtp, setShowOtp] = useState(false);
    const [showBrandDetails, setShowBrandDetails] = useState(false);
    const [showBankDetails, setShowBankDetails] = useState(false);
    const [showPickupAddress, setShowPickupAddress] = useState(false);
    const [showSubscription, setShowSubscription] = useState(false);
    const [gstNumber, setGstNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputsRef = useRef([]);
    const [storeName, setStoreName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [street, setStreet] = useState("");
    const [landmark, setLandmark] = useState("");
    const [pincode, setPincode] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");

    const handleOtpChange = (e, idx) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[idx] = value;
        setOtp(newOtp);
        if (value && idx < 5) {
            inputsRef.current[idx + 1].focus();
        }
    };

    const handleOtpKeyDown = (e, idx) => {
        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
            inputsRef.current[idx - 1].focus();
        }
    };

    const handleGstVerify = (e) => {
        e.preventDefault();
        // Add GST verification logic here
        setShowGstVerification(false);
        setShowOtp(false);
        setShowBrandDetails(false);
        setShowBankDetails(false);
        setShowPickupAddress(false);
        setShowSubscription(false);
        // Show the seller details form after verification
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowBrandDetails(true);
    };

    const handleResend = (e) => {
        e.preventDefault();
        // Add resend logic here
    };

    const handleBrandSubmit = (e) => {
        e.preventDefault();
        setShowBankDetails(true);
    };

    const handleBankSubmit = (e) => {
        e.preventDefault();
        setShowPickupAddress(true);
    };

    const handlePickupSubmit = (e) => {
        e.preventDefault();
        setShowSubscription(true);
    };

    return (
        <>
            <div className='d_auth_container'>
                <section className="Z_container">
                    <div className="Z_steps-bar">
                        <div className="Z_step completed">✓<span>Account Creation</span></div>
                        <div className="Z_line completed"></div>
                        <div className="Z_step active"><div className="Z_circle"></div><span>Seller Details</span></div>
                        <div className="Z_line"></div>
                        <div className="Z_step"><div className="Z_circle"></div><span>Brand Details</span></div>
                        <div className="Z_line"></div>
                        <div className="Z_step"><div className="Z_circle"></div><span>Bank Details</span></div>
                        <div className="Z_line"></div>
                        <div className="Z_step"><div className="Z_circle"></div><span>Pickup Address</span></div>
                        <div className="Z_line"></div>
                        <div className="Z_step"><div className="Z_circle"></div><span>Verify & Submit</span></div>
                    </div>

                    {showGstVerification ? (
                        <div className="Z_card">
                            <h2>Seller Details</h2>
                            <p className="Z_subtext">Enter the primary GST of your Business</p>
                            <form onSubmit={handleGstVerify}>
                                <div className="Z_row">
                                    <label>GST number</label>
                                    <div className="Z_input-verified">
                                        <input
                                            type="text"
                                            placeholder="GST number"
                                            value={gstNumber}
                                            onChange={(e) => setGstNumber(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="Z_btn Z_verify-btn">Verify</button>
                                </div>
                            </form>
                        </div>
                    ) : !showOtp && !showBrandDetails && !showBankDetails && !showPickupAddress && !showSubscription ? (
                        <div className="Z_card">
                            <h2>Seller Details</h2>
                            <p className="Z_subtext">Enter the primary GST of your Business</p>
                            <div className="Z_row">
                                <label>GST Details</label>
                                <div className="Z_input-verified">
                                    <input type="text" value="09AAACH7409R1ZZ" disabled />
                                </div>
                            </div>
                            <div className="Z_row">
                                <label>PAN Number</label>
                                <div className="Z_input-verified">
                                    <input type="text" value="BAJPC4350M" />
                                </div>
                            </div>
                            <div className="Z_row">
                                <label>Business Type</label>
                                <div className="Z_input-verified">
                                    <input type="text" value="Wholesale Business, Retail Business" />
                                </div>
                            </div>
                            <div className="Z_row">
                                <label>Registered Business Address</label>
                                <div className="Z_input-verified">
                                    <input type="text" value="4517 Washington Ave. Manchester, Kentucky 39495" />
                                </div>
                            </div>
                            <button className="Z_btn" onClick={() => setShowOtp(true)}>Verify OTP</button>
                        </div>
                    ) : showOtp && !showBrandDetails && !showBankDetails && !showPickupAddress && !showSubscription ? (
                        <div className="otp-card Z_card">
                            <h2>Verify your GST</h2>
                            <p className="otp-subtext">We have sent a 6-digit verification code to</p>
                            <div className="otp-contact">
                                <div>Mobile: XXXXXXX8526</div>
                                {/* <div>Email: jaXXXXXXX@gmail.com</div> */}
                            </div>
                            <form className="otp-form" onSubmit={handleSubmit}>
                                <div className="otp-inputs">
                                    {otp.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={e => handleOtpChange(e, idx)}
                                            onKeyDown={e => handleOtpKeyDown(e, idx)}
                                            ref={el => (inputsRef.current[idx] = el)}
                                            className="otp-input"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                        />
                                    ))}
                                </div>
                                <button className="otp-submit" type="submit">Submit</button>
                            </form>
                            <div className="otp-resend">
                                Didn't received code? <a href="#" onClick={handleResend}>Resend</a>
                            </div>
                        </div>
                    ) : showBrandDetails && !showBankDetails && !showPickupAddress && !showSubscription ? (
                        <div className="brand-card Z_card">
                            <h2 className="brand-title">Brand Details</h2>
                            <p className="brand-subtext">Your store name will be visible to all buyers of FastKart</p>
                            <form className="brand-form" onSubmit={handleBrandSubmit}>
                                <div className="brand-row">
                                    <label htmlFor="storeName">Store Name</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="storeName"
                                            type="text"
                                            placeholder="Store number"
                                            value={storeName}
                                            onChange={e => setStoreName(e.target.value)}
                                        />
                                    </div>
                                    <div className="brand-helper">E.g. Business Name, Trade Name, Etc.</div>
                                </div>
                                <div className="brand-row">
                                    <label htmlFor="ownerName">Owner Name</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="ownerName"
                                            type="text"
                                            placeholder="Owner name"
                                            value={ownerName}
                                            onChange={e => setOwnerName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button className="brand-submit" type="submit">Submit</button>
                            </form>
                        </div>
                    ) : showBankDetails && !showPickupAddress && !showSubscription ? (
                        <div className="bank-card Z_card">
                            <h2 className="bank-title">Bank Details</h2>
                            <p className="bank-subtext">Bank account should be in the name of<br />registered business name or trade name as per GSTIN.</p>
                            <form className="bank-form" onSubmit={handleBankSubmit}>
                                <div className="bank-row">
                                    <label htmlFor="bankName">Bank Name</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="bankName"
                                            type="text"
                                            placeholder="Bank Name"
                                            value={bankName}
                                            onChange={e => setBankName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="bank-row">
                                    <label htmlFor="accountNumber">Account Number</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="accountNumber"
                                            type="text"
                                            placeholder="Account number"
                                            value={accountNumber}
                                            onChange={e => setAccountNumber(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="bank-row">
                                    <label htmlFor="confirmAccountNumber">Confirm Account Number</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="confirmAccountNumber"
                                            type="text"
                                            placeholder="Account number"
                                            value={confirmAccountNumber}
                                            onChange={e => setConfirmAccountNumber(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="bank-row">
                                    <label htmlFor="ifscCode">IFSC Code</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="ifscCode"
                                            type="text"
                                            placeholder="IFSC Code"
                                            value={ifscCode}
                                            onChange={e => setIfscCode(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button className="bank-submit" type="submit">Verify Bank Details</button>
                            </form>
                        </div>
                    ) : showPickupAddress && !showSubscription ? (
                        <div className="pickup-card Z_card">
                            <h2 className="pickup-title">Pickup Address</h2>
                            <p className="pickup-subtext">Products will be picked up from this location for delivery.</p>
                            <form className="pickup-form" onSubmit={handlePickupSubmit}>
                                <div className="pickup-row">
                                    <label htmlFor="roomNumber">Room/ Floor/ Building Number</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="roomNumber"
                                            type="text"
                                            placeholder="Room/ Floor/ Building Number"
                                            value={roomNumber}
                                            onChange={e => setRoomNumber(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="pickup-row">
                                    <label htmlFor="street">Street/ Locality</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="street"
                                            type="text"
                                            placeholder="Street/ Locality"
                                            value={street}
                                            onChange={e => setStreet(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="pickup-row">
                                    <label htmlFor="landmark">Landmark</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="landmark"
                                            type="text"
                                            placeholder="Landmark"
                                            value={landmark}
                                            onChange={e => setLandmark(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="pickup-row pickup-row-flex">
                                    <div className="pickup-col">
                                        <label htmlFor="pincode">Pincode</label>
                                        <div className="Z_input-verified">
                                            <input
                                                id="pincode"
                                                type="text"
                                                placeholder="Pincode"
                                                value={pincode}
                                                onChange={e => setPincode(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="pickup-col">
                                        <label htmlFor="city">City</label>
                                        <div className="Z_input-verified">
                                            <input
                                                id="city"
                                                type="text"
                                                placeholder="City"
                                                value={city}
                                                onChange={e => setCity(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pickup-row">
                                    <label htmlFor="state">State</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="state"
                                            type="text"
                                            placeholder="State"
                                            value={state}
                                            onChange={e => setState(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button className="pickup-submit" type="submit">Continue</button>
                            </form>
                        </div>
                    ) : showSubscription ? (
                        <div className=" Z_card">
                            <div className="subscription-card-dark">
                                <h2 className="subscription-title-dark">Choose a plan</h2>
                                <div className="subscription-toggle-row">   
                                    <span className="toggle-label">Personal</span>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider"></span>
                                    </label>
                                    <span className="toggle-label">Business</span>
                                </div>
                                <div className="subscription-plans-dark">
                                    <div className="subscription-plan-dark">
                                        <h3>Gold</h3>
                                        <div className="subscription-divider"></div>
                                        <div className="subscription-price-dark">99<span className="currency">$</span></div>
                                        <div className="subscription-duration">Weekly Plan</div>
                                        <div className="subscription-desc">Vertical describes something that rises straight up from a horizontal plane.</div>
                                        <ul>
                                            <li><span className="checkmark">✔</span> Upto 5 Users</li>
                                            <li><span className="checkmark">✔</span> Maximum 100 Photos</li>
                                            <li><span className="checkmark">✔</span> 10 Queries</li>
                                            <li><span className="checkmark">✔</span> 7 Emails</li>
                                        </ul>
                                        <button className="subscription-btn-dark">Choose Plan</button>
                                    </div>
                                    <div className="subscription-plan-dark">
                                        <h3>Diamond</h3>
                                        <div className="subscription-divider"></div>
                                        <div className="subscription-price-dark">199<span className="currency">$</span></div>
                                        <div className="subscription-duration">Monthly Plan</div>
                                        <div className="subscription-desc">Vertical describes something that rises straight up from a horizontal plane.</div>
                                        <ul>
                                            <li><span className="checkmark">✔</span> Upto 5 Users</li>
                                            <li><span className="checkmark">✔</span> Maximum 100 Photos</li>
                                            <li><span className="checkmark">✔</span> 10 Queries</li>
                                            <li><span className="checkmark">✔</span> 7 Emails</li>
                                        </ul>
                                        <button className="subscription-btn-dark">Choose Plan</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </section>
            </div>
        </>
    );
}

export default SellergstVerify;