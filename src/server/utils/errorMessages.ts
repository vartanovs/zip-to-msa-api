/**
 * @module errorMessages.ts
 * @description Error Message Utility
 */

const errorMessages = {
  zip: {
    noZip: { 'error': "no 'zip' provided" },
    invalidLength: { 'error': 'zip must be 5-digits' },
    zipIsNaN: { 'error': 'zip must be a number' },
  },
};

export default errorMessages;
