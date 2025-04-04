/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password for minimum requirements
 * @param {string} password - The password to validate
 * @param {number} minLength - Minimum required length (default: 6)
 * @returns {boolean} - Whether the password meets minimum requirements
 */
export const isValidPassword = (password, minLength = 6) => {
  return password && password.length >= minLength;
};

/**
 * Checks if passwords match
 * @param {string} password - The password
 * @param {string} confirmPassword - The confirmation password
 * @returns {boolean} - Whether the passwords match
 */
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validates a form field is not empty
 * @param {string} value - The field value to check
 * @returns {boolean} - Whether the field has a value
 */
export const isNotEmpty = (value) => {
  return value && value.trim().length > 0;
};

/**
 * Validates a form object for required fields
 * @param {Object} formData - The form data object
 * @param {Array<string>} requiredFields - Array of required field names
 * @returns {boolean} - Whether all required fields have values
 */
export const validateRequiredFields = (formData, requiredFields) => {
  for (const field of requiredFields) {
    if (!isNotEmpty(formData[field])) {
      return false;
    }
  }
  return true;
};
