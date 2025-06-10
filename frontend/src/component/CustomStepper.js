import React, { useState } from 'react';

const CustomStepper = ({ steps, activeStep = 0 }) => {
  return (
    <div className="stepper-container">
      <div className="stepper-wrapper">
        {steps.map((step, index) => (
          <div key={index} className="stepper-item">
            <div className={`stepper-step ${
              index < activeStep ? 'completed' : 
              index === activeStep ? 'active' : 'default'
            }`}>
              <div className="step-number">
                {index < activeStep ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`step-line ${
                  index < activeStep ? 'completed-line' : 'default-line'
                }`}></div>
              )}
            </div>
            <div className={`step-label ${
              index <= activeStep ? 'active-label' : 'default-label'
            }`}>
              {step.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomStepper;