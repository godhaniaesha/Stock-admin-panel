import React, { useState, useRef, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { 
  verifyGST, 
  addBusinessDetails, 
  sendOTP, 
  verifyOTP,
  addStoreDetails,
  addBankDetails,
  addPickupAddress,
  acceptTermsAndConditions 
} from '../../redux/slice/auth.slice';
import CustomStepper from '../CustomStepper';
import '../../styles/seller.css';

function SellergstVerify() {
    const dispatch = useDispatch();
    const { 
      loading, 
      error, 
      success, 
      message,
      gstVerified,
      businessDetailsAdded,
      otpSent,
      otpVerified,
      storeDetailsAdded,
      bankDetailsAdded,
      pickupAddressAdded,
      termsAccepted
    } = useSelector((state) => state.auth);

    // Form states
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
        gstNumber: "",
        panNumber: "",
        businessType: "",
        businessAddress: ""
    });

    // Validation states
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [canResendOtp, setCanResendOtp] = useState(false);

    // View states
    const [showGstVerification, setShowGstVerification] = useState(true);
    const [showOtp, setShowOtp] = useState(false);
    const [showBrandDetails, setShowBrandDetails] = useState(false);
    const [showBankDetails, setShowBankDetails] = useState(false);
    const [showPickupAddress, setShowPickupAddress] = useState(false);
    const [showSubscription, setShowSubscription] = useState(false);

    // Progress state
    const [userProgress, setUserProgress] = useState({
        currentStep: 0,
        showGstVerification: true,
        showOtp: false,
        showBrandDetails: false,
        showBankDetails: false,
        showPickupAddress: false,
        showSubscription: false
    });

    const steps = [
        { label: "Account Creation", title: "Account Creation" },
        { label: "Seller Details", title: "Seller Details" },
        { label: "Brand Details", title: "Brand Details" },
        { label: "Bank Details", title: "Bank Details" },
        { label: "Pickup Address", title: "Pickup Address" },
        { label: "Verify & Submit", title: "Verify & Submit" },
    ];

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

    // Validation functions
    const validateGSTNumber = (gst) => {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstRegex.test(gst);
    };

    const validatePANNumber = (pan) => {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(pan);
    };

    const validateIFSC = (ifsc) => {
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        return ifscRegex.test(ifsc);
    };

    const validatePincode = (pincode) => {
        const pincodeRegex = /^[1-9][0-9]{5}$/;
        return pincodeRegex.test(pincode);
    };

    const validateBankAccount = (account) => {
        return account.length >= 9 && account.length <= 18 && /^\d+$/.test(account);
    };

    // Timer for OTP resend
    useEffect(() => {
        let timer;
        if (otpTimer > 0) {
            timer = setInterval(() => {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResendOtp(true);
        }
        return () => clearInterval(timer);
    }, [otpTimer]);

    // Function to save progress to localStorage
    const saveProgress = (progress) => {
        localStorage.setItem('sellerRegistrationProgress', JSON.stringify(progress));
    };

    // Function to load progress from localStorage
    const loadProgress = () => {
        const savedProgress = localStorage.getItem('sellerRegistrationProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setUserProgress(progress);
            
            // Update view states based on saved progress
            setShowGstVerification(progress.showGstVerification);
            setShowOtp(progress.showOtp);
            setShowBrandDetails(progress.showBrandDetails);
            setShowBankDetails(progress.showBankDetails);
            setShowPickupAddress(progress.showPickupAddress);
            setShowSubscription(progress.showSubscription);
            setCurrentUser(prev => ({ ...prev, filledSteps: progress.currentStep }));
        }
    };

    // Load progress when component mounts
    useEffect(() => {
        loadProgress();
    }, []);

    // Update progress whenever relevant states change
    useEffect(() => {
        const progress = {
            currentStep: currentUser.filledSteps,
            showGstVerification,
            showOtp,
            showBrandDetails,
            showBankDetails,
            showPickupAddress,
            showSubscription
        };
        setUserProgress(progress);
        saveProgress(progress);
    }, [
        currentUser.filledSteps,
        showGstVerification,
        showOtp,
        showBrandDetails,
        showBankDetails,
        showPickupAddress,
        showSubscription
    ]);

    const handleGstVerify = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        if (!gstNumber) {
            setErrors(prev => ({ ...prev, gstNumber: 'GST number is required' }));
            setIsSubmitting(false);
            return;
        }

        if (!validateGSTNumber(gstNumber)) {
            setErrors(prev => ({ ...prev, gstNumber: 'Invalid GST number format' }));
            setIsSubmitting(false);
            return;
        }

        try {
            const userId = localStorage.getItem('user');
            const result = await dispatch(verifyGST({ gstNumber, userId })).unwrap();
            if (result.success) {
                try {
                    const otpResult = await dispatch(sendOTP(userId)).unwrap();
                    if (otpResult.success) {
                        setShowGstVerification(false);
                        setShowOtp(true);
                        setCurrentUser(prev => ({ ...prev, filledSteps: 1 }));
                        setOtpTimer(30);
                        setCanResendOtp(false);
                        alert('OTP has been sent to your registered mobile number');
                    }
                } catch (otpError) {
                    console.error('Failed to send OTP:', otpError);
                    setErrors(prev => ({ ...prev, otp: 'Failed to send OTP. Please try again.' }));
                }
            }
        } catch (error) {
            console.error('GST verification failed:', error);
            setErrors(prev => ({ ...prev, gstNumber: error.message || 'GST verification failed. Please try again.' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const otpString = otp.join('');
        
        if (otpString.length !== 6) {
            setErrors(prev => ({ ...prev, otp: 'Please enter complete 6-digit OTP' }));
            setIsSubmitting(false);
            return;
        }

        try {
            const userId = localStorage.getItem('user');
            const result = await dispatch(verifyOTP({ userId, otp: otpString })).unwrap();
            if (result.success) {
                setShowOtp(false);
                setShowBrandDetails(true);
                setCurrentUser(prev => ({ ...prev, filledSteps: 2 }));
            }
        } catch (error) {
            console.error('OTP verification failed:', error);
            setErrors(prev => ({ ...prev, otp: error.message || 'OTP verification failed. Please try again.' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async (e) => {
        e.preventDefault();
        if (!canResendOtp) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            const userId = localStorage.getItem('user');
            const result = await dispatch(sendOTP(userId)).unwrap();
            if (result.success) {
                setOtp(['', '', '', '', '', '']);
                setOtpTimer(30);
                setCanResendOtp(false);
                if (inputsRef.current[0]) {
                    inputsRef.current[0].focus();
                }
                alert('New OTP has been sent to your registered mobile number');
            }
        } catch (error) {
            console.error('Failed to resend OTP:', error);
            setErrors(prev => ({ ...prev, otp: error.message || 'Failed to resend OTP. Please try again.' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBrandSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        if (!storeName.trim()) {
            setErrors(prev => ({ ...prev, storeName: 'Store name is required' }));
            setIsSubmitting(false);
            return;
        }

        if (!ownerName.trim()) {
            setErrors(prev => ({ ...prev, ownerName: 'Owner name is required' }));
            setIsSubmitting(false);
            return;
        }

        try {
            const userId = localStorage.getItem('user');
            const storeDetails = {
                userId,
                storeName,
                ownerName
            };
            const result = await dispatch(addStoreDetails(storeDetails)).unwrap();
            if (result.success) {
                setShowBrandDetails(false);
                setShowBankDetails(true);
                setCurrentUser(prev => ({ ...prev, filledSteps: 3 }));
            }
        } catch (error) {
            console.error('Failed to add store details:', error);
            setErrors(prev => ({ ...prev, form: error.message || 'Failed to add store details. Please try again.' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBankSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        if (!bankName.trim()) {
            setErrors(prev => ({ ...prev, bankName: 'Bank name is required' }));
            setIsSubmitting(false);
            return;
        }

        if (!validateBankAccount(accountNumber)) {
            setErrors(prev => ({ ...prev, accountNumber: 'Invalid account number' }));
            setIsSubmitting(false);
            return;
        }

        if (accountNumber !== confirmAccountNumber) {
            setErrors(prev => ({ ...prev, confirmAccountNumber: 'Account numbers do not match' }));
            setIsSubmitting(false);
            return;
        }

        if (!validateIFSC(ifscCode)) {
            setErrors(prev => ({ ...prev, ifscCode: 'Invalid IFSC code' }));
            setIsSubmitting(false);
            return;
        }

        try {
            const userId = localStorage.getItem('user');
            const bankDetails = {
                userId,
                bankName,
                accountNumber,
                confirmAccountNumber,
                ifscCode
            };
            const result = await dispatch(addBankDetails(bankDetails)).unwrap();
            if (result.success) {
                setShowBankDetails(false);
                setShowPickupAddress(true);
                setCurrentUser(prev => ({ ...prev, filledSteps: 4 }));
            }
        } catch (error) {
            console.error('Failed to add bank details:', error);
            setErrors(prev => ({ ...prev, form: error.message || 'Failed to add bank details. Please try again.' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePickupSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        if (!roomNumber.trim()) {
            setErrors(prev => ({ ...prev, roomNumber: 'Room/Floor/Building number is required' }));
            setIsSubmitting(false);
            return;
        }

        if (!street.trim()) {
            setErrors(prev => ({ ...prev, street: 'Street/Locality is required' }));
            setIsSubmitting(false);
            return;
        }

        if (!validatePincode(pincode)) {
            setErrors(prev => ({ ...prev, pincode: 'Invalid pincode' }));
            setIsSubmitting(false);
            return;
        }

        if (!city.trim()) {
            setErrors(prev => ({ ...prev, city: 'City is required' }));
            setIsSubmitting(false);
            return;
        }

        if (!state.trim()) {
            setErrors(prev => ({ ...prev, state: 'State is required' }));
            setIsSubmitting(false);
            return;
        }

        try {
            const userId = localStorage.getItem('user');
            const addressDetails = {
                userId,
                buildingNumber: roomNumber,
                street,
                landmark,
                pincode,
                city,
                state
            };
            const result = await dispatch(addPickupAddress(addressDetails)).unwrap();
            if (result.success) {
                setShowPickupAddress(false);
                setShowSubscription(true);
                setCurrentUser(prev => ({ ...prev, filledSteps: 5 }));
            }
        } catch (error) {
            console.error('Failed to add pickup address:', error);
            setErrors(prev => ({ ...prev, form: error.message || 'Failed to add pickup address. Please try again.' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGstDetailsChange = (e, field) => {
        setGstDetails({
            ...gstDetails,
            [field]: e.target.value
        });
    };

    // Add function to clear progress (call this when registration is complete)
    const clearProgress = () => {
        localStorage.removeItem('sellerRegistrationProgress');
    };

    return (
        <>
            <div className='d_auth_container'>
                <section className="Z_container">
                    <style jsx>{`
        .stepper-container {
          width: 100%;
          margin: 20px 0;
          padding: 0 20px;
        }

        .stepper-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          max-width: 800px;
          margin: 0 auto;
        }

        .stepper-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
        }

        .stepper-step {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          margin-bottom: 10px;
          justify-content: center;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .step-number.completed,
        .stepper-step.completed .step-number {
          background-color: #84a98c;
          color: white;
          border: 2px solid #84a98c;
        }

        .step-number.active,
        .stepper-step.active .step-number {
          background-color: #84a98c;
          color: white;
          border: 2px solid #84a98c;
        }

        .step-number.default,
        .stepper-step.default .step-number {
          background-color: #f8f9fa;
          color: #666666;
          border: 2px solid #ddd;
        }

        .step-line {
          position: absolute;
          height: 2px;
          top: 50%;
          left: 50px;
          right: -50%;
          transform: translateY(-50%);
          z-index: 1;
          transition: all 0.3s ease;
        }

        .completed-line {
          background-color: #84a98c;
        }

        .default-line {
          background-color: #ddd;
        }

        .step-label {
          text-align: center;
          font-size: 14px;
          margin-top: 8px;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .active-label {
          color: #84a98c;
          font-weight: 600;
        }

        .default-label {
          color: #666666;
        }

        .seller-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .stepper-container {
            padding: 0 10px;
          }
          
          .step-number {
            width: 32px;
            height: 32px;
            font-size: 12px;
          }
          
          .step-label {
            font-size: 10px;
            margin-top: 6px;
          }
          
          .step-line {
            left: 50px;
          }
        }

        @media (max-width: 576px) {

        .stepper-container {
            width: 100%;
            max-width: 100vw;
            margin: 20px 0;
            padding: 0 20px;
            overflow-x: auto;
            } 
        .step-line {
                left: 40px;
                }

           .stepper-item {
             margin-bottom: 10px;
    margin-right: 5px;
        }
    .step-label {
    font-size: 12px;}
       
        }
      `}</style>
                    <CustomStepper steps={steps} activeStep={currentUser.filledSteps} />
                   {showGstVerification && (
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
                                            className={`Z_input ${errors.gstNumber ? 'is-invalid' : ''}`}
                                        />
                                        {errors.gstNumber && <div className="error-message">{errors.gstNumber}</div>}
                                    </div>
                                    <div className='d-flex justify-content-center'>
                                        <button 
                                            type="submit" 
                                            className="Z_btn Z_verify-btn"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Verifying...' : 'Verify'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                   )}
                   {showOtp && (
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
                                            className={`Z_input otp-input ${errors.otp ? 'is-invalid' : ''}`}
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                        />
                                    ))}
                                </div>
                                {errors.otp && <div className="error-message">{errors.otp}</div>}
                                <div className='d-flex justify-content-center mb-3'>
                                    <button 
                                        className="Z_btn" 
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Verifying...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                            <div className="otp-resend">
                                {canResendOtp ? (
                                    <a href="#" onClick={handleResend}>Resend OTP</a>
                                ) : (
                                    <span>Resend OTP in {otpTimer}s</span>
                                )}
                            </div>
                        </div>
                   )}
                     {showBrandDetails && (
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
                                            className={`Z_input ${errors.storeName ? 'is-invalid' : ''}`}
                                        />
                                        {errors.storeName && <div className="error-message">{errors.storeName}</div>}
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
                                            className={`Z_input ${errors.ownerName ? 'is-invalid' : ''}`}
                                        />
                                        {errors.ownerName && <div className="error-message">{errors.ownerName}</div>}
                                    </div>
                                </div>
                                {errors.form && <div className="error-message">{errors.form}</div>}
                                <div className='d-flex justify-content-center'>
                                    <button 
                                        className="Z_btn" 
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                     )}
                      {showBankDetails && (
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
                                            className={`Z_input ${errors.bankName ? 'is-invalid' : ''}`}
                                        />
                                        {errors.bankName && <div className="error-message">{errors.bankName}</div>}
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
                                            className={`Z_input ${errors.accountNumber ? 'is-invalid' : ''}`}
                                        />
                                        {errors.accountNumber && <div className="error-message">{errors.accountNumber}</div>}
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
                                            className={`Z_input ${errors.confirmAccountNumber ? 'is-invalid' : ''}`}
                                        />
                                        {errors.confirmAccountNumber && <div className="error-message">{errors.confirmAccountNumber}</div>}
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
                                            className={`Z_input ${errors.ifscCode ? 'is-invalid' : ''}`}
                                        />
                                        {errors.ifscCode && <div className="error-message">{errors.ifscCode}</div>}
                                    </div>
                                </div>
                                {errors.form && <div className="error-message">{errors.form}</div>}
                                <div className='d-flex justify-content-center'>
                                    <button 
                                        className="Z_btn" 
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Verifying...' : 'Verify Bank Details'}
                                    </button>
                                </div>
                            </form>
                        </div>
                      )}
                     {showPickupAddress && (
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
                                            className={`Z_input ${errors.roomNumber ? 'is-invalid' : ''}`}
                                        />
                                        {errors.roomNumber && <div className="error-message">{errors.roomNumber}</div>}
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
                                            className={`Z_input ${errors.street ? 'is-invalid' : ''}`}
                                        />
                                        {errors.street && <div className="error-message">{errors.street}</div>}
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
                                                className={`Z_input ${errors.pincode ? 'is-invalid' : ''}`}
                                            />
                                            {errors.pincode && <div className="error-message">{errors.pincode}</div>}
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
                                                className={`Z_input ${errors.city ? 'is-invalid' : ''}`}
                                            />
                                            {errors.city && <div className="error-message">{errors.city}</div>}
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
                                            className={`Z_input ${errors.state ? 'is-invalid' : ''}`}
                                        />
                                        {errors.state && <div className="error-message">{errors.state}</div>}
                                    </div>
                                </div>
                                {errors.form && <div className="error-message">{errors.form}</div>}
                                <div className='d-flex justify-content-center'>
                                    <button 
                                        className="Z_btn" 
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Continue'}
                                    </button>
                                </div>
                            </form>
                        </div>
                     )}
                    {showSubscription && (
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
                    )}
                </section>
            </div>
        </>
    );
}

export default SellergstVerify;