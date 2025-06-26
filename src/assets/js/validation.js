// src/assets/js/validation.js

export const validatePhoneNumber = (number) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(number);
};

export const validateTextOnly = (text) => {
  const regex = /^[A-Za-z\s]+$/;
  return regex.test(text);
};

export const validateAadhaar = (aadhaar) => {
  const regex = /^\d{12}$/;
  return regex.test(aadhaar);
};

export const validatePAN = (pan) => {
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return regex.test(pan);
};
