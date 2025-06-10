import React, { useState, useRef } from 'react';
import { Container } from 'react-bootstrap';
import Stepper from 'react-stepper-horizontal';
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
    const [currentUser, setCurrentUser] = useState({ filledSteps: 0 });
    const [gstDetails, setGstDetails] = useState({
        gstNumber: "09AAACH7409R1ZZ",
        panNumber: "BAJPC4350M",
        businessType: "Wholesale Business, Retail Business",
        businessAddress: "4517 Washington Ave. Manchester, Kentucky 39495"
    });

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
        setShowGstVerification(false);
        setShowOtp(false);
        setShowBrandDetails(false);
        setShowBankDetails(false);
        setShowPickupAddress(false);
        setShowSubscription(false);
        setCurrentUser(prev => ({ ...prev, filledSteps: 1 }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowBrandDetails(true);
        setCurrentUser(prev => ({ ...prev, filledSteps: 2 }));
    };

    const handleResend = (e) => {
        e.preventDefault();
        // Add resend logic here
    };

    const handleBrandSubmit = (e) => {
        e.preventDefault();
        setShowBankDetails(true);
        setCurrentUser(prev => ({ ...prev, filledSteps: 3 }));
    };

    const handleBankSubmit = (e) => {
        e.preventDefault();
        setShowPickupAddress(true);
        setCurrentUser(prev => ({ ...prev, filledSteps: 4 }));
    };

    const handlePickupSubmit = (e) => {
        e.preventDefault();
        setShowSubscription(true);
        setCurrentUser(prev => ({ ...prev, filledSteps: 5 }));
    };

    const handleGstDetailsChange = (e, field) => {
        setGstDetails({
            ...gstDetails,
            [field]: e.target.value
        });
    };

    return (
        <>
            <div className='d_auth_container'>
                <section className="Z_container">
                    {/* <Container>
                        <div className="overflow-auto">
                            <Stepper
                                steps={[
                                    { label: "Account Creation", title: "Account Creation" },
                                    { label: "Seller Details", title: "Seller Details" },
                                    { label: "Brand Details", title: "Brand Details" },
                                    { label: "Bank Details", title: "Bank Details" },
                                    { label: "Pickup Address", title: "Pickup Address" },
                                    { label: "Verify & Submit", title: "Verify & Submit" },
                                ]}
                                className="k-steper"
                                activeStep={currentUser?.filledSteps}
                                connectorStateColors
                                titleFontSize={14}
                                circleFontSize={14}
                                size={40}
                                circleTop={0}
                                titleBottom={10}
                                activeTitleColor="#ffffff"
                                activeColor="#84a98c"
                                completeTitleColor="#ffffff"
                                completeColor="#84a98c"
                                defaultTitleColor="#666666"
                                defaultColor="#666666"
                            />
                        </div>
                    </Container> */}

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
                                            placeholder="Enter GST number"
                                            value={gstNumber}
                                            onChange={(e) => setGstNumber(e.target.value)}
                                            className="Z_input"
                                        />
                                    </div>
                                    <div className='d-flex justify-content-center'>
                                        <button type="submit" className="Z_btn Z_verify-btn">Verify</button>
                                    </div>
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
                                    <input
                                        type="text"
                                        value={gstDetails.gstNumber}
                                        onChange={(e) => handleGstDetailsChange(e, 'gstNumber')}
                                        placeholder="Enter GST number"
                                        className="Z_input"
                                    />
                                </div>
                            </div>
                            <div className="Z_row">
                                <label>PAN Number</label>
                                <div className="Z_input-verified">
                                    <input
                                        type="text"
                                        value={gstDetails.panNumber}
                                        onChange={(e) => handleGstDetailsChange(e, 'panNumber')}
                                        placeholder="Enter PAN number"
                                        className="Z_input"
                                    />
                                </div>
                            </div>
                            <div className="Z_row">
                                <label>Business Type</label>
                                <div className="Z_input-verified">
                                    <input
                                        type="text"
                                        value={gstDetails.businessType}
                                        onChange={(e) => handleGstDetailsChange(e, 'businessType')}
                                        placeholder="Enter business type"
                                        className="Z_input"
                                    />
                                </div>
                            </div>
                            <div className="Z_row">
                                <label>Registered Business Address</label>
                                <div className="Z_input-verified">
                                    <input
                                        type="text"
                                        value={gstDetails.businessAddress}
                                        onChange={(e) => handleGstDetailsChange(e, 'businessAddress')}
                                        placeholder="Enter business address"
                                        className="Z_input"
                                    />
                                </div>
                            </div>
                            <div className='d-flex justify-content-center'>
                                <button className="Z_btn" onClick={() => setShowOtp(true)}>Verify OTP</button>
                            </div>
                        </div>
                    ) : showOtp && !showBrandDetails && !showBankDetails && !showPickupAddress && !showSubscription ? (
                        <div className="otp-card Z_card">
                            <h2>Verify your GST</h2>
                            <p className="otp-subtext">We have sent a 6-digit verification code to</p>
                            <div className="otp-contact">
                                <div className='text-light'>Mobile: XXXXXXX8526</div>
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
                                            className="Z_input otp-input"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                        />
                                    ))}
                                </div>
                                <div className='d-flex justify-content-center mb-3'>
                                    <button className="Z_btn" type="submit">Submit</button>
                                </div>
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
                                <div className="Z_row">
                                    <label htmlFor="storeName">Store Name</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="storeName"
                                            type="text"
                                            placeholder="Enter store name"
                                            value={storeName}
                                            onChange={e => setStoreName(e.target.value)}
                                            className="Z_input"
                                        />
                                    </div>
                                    <div className="brand-helper">E.g. Business Name, Trade Name, Etc.</div>
                                </div>
                                <div className="Z_row">
                                    <label htmlFor="ownerName">Owner Name</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="ownerName"
                                            type="text"
                                            placeholder="Enter owner name"
                                            value={ownerName}
                                            onChange={e => setOwnerName(e.target.value)}
                                            className="Z_input"
                                        />
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <button className="Z_btn" type="submit">Submit</button>
                                </div>
                            </form>
                        </div>
                    ) : showBankDetails && !showPickupAddress && !showSubscription ? (
                        <div className="bank-card Z_card">
                            <h2 className="bank-title">Bank Details</h2>
                            <p className="bank-subtext">Bank account should be in the name of<br />registered business name or trade name as per GSTIN.</p>
                            <form className="bank-form" onSubmit={handleBankSubmit}>
                                <div className="Z_row">
                                    <label htmlFor="bankName">Bank Name</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="bankName"
                                            type="text"
                                            placeholder="Enter bank name"
                                            value={bankName}
                                            onChange={e => setBankName(e.target.value)}
                                            className="Z_input"
                                        />
                                    </div>
                                </div>
                                <div className="Z_row">
                                    <label htmlFor="accountNumber">Account Number</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="accountNumber"
                                            type="text"
                                            placeholder="Enter account number"
                                            value={accountNumber}
                                            onChange={e => setAccountNumber(e.target.value)}
                                            className="Z_input"
                                        />
                                    </div>
                                </div>
                                <div className="Z_row">
                                    <label htmlFor="confirmAccountNumber">Confirm Account Number</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="confirmAccountNumber"
                                            type="text"
                                            placeholder="Confirm account number"
                                            value={confirmAccountNumber}
                                            onChange={e => setConfirmAccountNumber(e.target.value)}
                                            className="Z_input"
                                        />
                                    </div>
                                </div>
                                <div className="Z_row">
                                    <label htmlFor="ifscCode">IFSC Code</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="ifscCode"
                                            type="text"
                                            placeholder="Enter IFSC code"
                                            value={ifscCode}
                                            onChange={e => setIfscCode(e.target.value)}
                                            className="Z_input"
                                        />
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <button className="Z_btn" type="submit">Verify Bank Details</button>
                                </div>
                            </form>
                        </div>
                    ) : showPickupAddress && !showSubscription ? (
                        <div className="pickup-card Z_card">
                            <h2 className="pickup-title">Pickup Address</h2>
                            <p className="pickup-subtext">Products will be picked up from this location for delivery.</p>
                            <form className="pickup-form" onSubmit={handlePickupSubmit}>
                                <div className="Z_row">
                                    <label htmlFor="roomNumber">Room/ Floor/ Building Number</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="roomNumber"
                                            type="text"
                                            placeholder="Enter room/floor/building number"
                                            value={roomNumber}
                                            onChange={e => setRoomNumber(e.target.value)}
                                            className="Z_input"
                                        />
                                    </div>
                                </div>
                                <div className="Z_row">
                                    <label htmlFor="street">Street/ Locality</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="street"
                                            type="text"
                                            placeholder="Enter street/locality"
                                            value={street}
                                            onChange={e => setStreet(e.target.value)}
                                            className="Z_input"
                                        />
                                    </div>
                                </div>
                                <div className="Z_row">
                                    <label htmlFor="landmark">Landmark</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="landmark"
                                            type="text"
                                            placeholder="Enter landmark"
                                            value={landmark}
                                            onChange={e => setLandmark(e.target.value)}
                                            className="Z_input"
                                        />
                                    </div>
                                </div>
                                <div className="Z_row">
                                    <div className="pickup-col">
                                        <label htmlFor="pincode">Pincode</label>
                                        <div className="Z_input-verified">
                                            <input
                                                id="pincode"
                                                type="text"
                                                placeholder="Enter pincode"
                                                value={pincode}
                                                onChange={e => setPincode(e.target.value)}
                                                className="Z_input"
                                            />
                                        </div>
                                    </div>
                                    <div className="pickup-col">
                                        <label htmlFor="city">City</label>
                                        <div className="Z_input-verified">
                                            <input
                                                id="city"
                                                type="text"
                                                placeholder="Enter city"
                                                value={city}
                                                onChange={e => setCity(e.target.value)}
                                                className="Z_input"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="Z_row">
                                    <label htmlFor="state">State</label>
                                    <div className="Z_input-verified">
                                        <input
                                            id="state"
                                            type="text"
                                            placeholder="Enter state"
                                            value={state}
                                            onChange={e => setState(e.target.value)}
                                            className="Z_input"
                                        />
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <button className="Z_btn" type="submit">Continue</button>
                                </div>
                            </form>
                        </div>
                    ) : showSubscription ? (
                        <div className="Z_card_wide">
                            <div className="subscription-card-dark">
                                <h2 className="subscription-title-dark">Choose a plan</h2>
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