import type { PhoneNumber } from '../types';

const LEBANESE_PREFIXES = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '70', '71', '76', '78', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89'];
const SINGLE_DIGIT_PREFIXES = ['1', '2', '3', '4', '5', '6', '8', '9']; // Removed '7' as it needs special handling

export function formatLebaneseMobile(input: string, startId: number, inputId: number): PhoneNumber[] {
  // Split the input into potential numbers using non-numeric characters as separators
  const potentialNumbers = splitNumbersByNonNumeric(input);
  
  // Process each potential number
  return potentialNumbers.map((num, index) => {
    const cleaned = num.replace(/[^\d+]/g, '');
    return processNumber(cleaned, startId + index, inputId, input, num);
  });
}

function splitNumbersByNonNumeric(input: string): string[] {
  const numbers: string[] = [];
  let currentNumber = '';
  let lastWasSeparator = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (/\d|\+/.test(char)) {
      currentNumber += char;
      lastWasSeparator = false;
    } else {
      // Check if this non-numeric character could be a separator
      const beforeNumber = extractLocalNumber(currentNumber);
      const afterNumber = extractLocalNumber(input.slice(i + 1));
      
      if (isValidLength(beforeNumber) && isValidLength(afterNumber)) {
        if (currentNumber) {
          numbers.push(currentNumber);
        }
        currentNumber = '';
        lastWasSeparator = true;
      } else if (!lastWasSeparator) {
        currentNumber += char;
      }
    }
  }

  // Don't forget the last number
  if (currentNumber) {
    numbers.push(currentNumber);
  }

  return numbers.length > 0 ? numbers : [input];
}

function isValidLength(number: string): boolean {
  return number.length >= 7 && number.length <= 8;
}

function extractLocalNumber(str: string): string {
  const cleaned = str.replace(/[^\d+]/g, '');
  
  // Remove international prefix if present
  if (cleaned.startsWith('00961')) {
    return cleaned.slice(5);
  }
  if (cleaned.startsWith('+961')) {
    return cleaned.slice(4);
  }
  if (cleaned.startsWith('961')) {
    return cleaned.slice(3);
  }
  // Handle numbers with potential random digit in international prefix (00X961)
  if (cleaned.length >= 6 && cleaned.startsWith('00') && cleaned.substring(3, 6) === '961') {
    return cleaned.slice(6);
  }
  
  return cleaned;
}

function processNumber(cleaned: string, id: number, inputId: number, rawInput: string, originalNumber: string): PhoneNumber {
  // Handle numbers starting with 96 or 961
  if (cleaned.startsWith('96') || cleaned.startsWith('961')) {
    const remainingDigits = cleaned.startsWith('961') ? cleaned.slice(3) : cleaned.slice(2);
    return formatLocalNumber(remainingDigits, id, inputId, rawInput, originalNumber);
  }

  // Handle numbers with potential random digit in international prefix (00X961)
  if (cleaned.length >= 6 && cleaned.startsWith('00') && cleaned.substring(3, 6) === '961') {
    const remainingDigits = cleaned.slice(6); // Remove '00X961'
    return formatLocalNumber(remainingDigits, id, inputId, rawInput, originalNumber);
  }
  
  // Handle regular 00961 prefix
  if (cleaned.startsWith('00961')) {
    const remainingDigits = cleaned.slice(5); // Remove '00961'
    return formatLocalNumber(remainingDigits, id, inputId, rawInput, originalNumber);
  }
  
  // Handle international format with +
  if (cleaned.startsWith('+')) {
    if (cleaned.startsWith('+961')) {
      const number = cleaned.slice(4);
      return formatLocalNumber(number, id, inputId, rawInput, originalNumber);
    }
    return {
      id,
      inputId,
      rawInput,
      input: originalNumber,
      output: {
        ext: '',
        prefix: '',
        number: cleaned
      },
      isValid: false,
      note: 'Non-Lebanese international number'
    };
  }

  // Handle local format
  return formatLocalNumber(cleaned, id, inputId, rawInput, originalNumber);
}

function formatLocalNumber(number: string, id: number, inputId: number, rawInput: string, originalNumber: string): PhoneNumber {
  // Special handling for numbers starting with 7x or 8x
  if ((number.startsWith('7') && ['0', '1', '6', '8', '9'].includes(number[1])) || 
      (number.startsWith('8') && ['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(number[1]))) {
    // Check if there are exactly 6 digits after the prefix
    if (number.length === 8) {
      return validateAndFormatNumber(number, id, inputId, rawInput, originalNumber);
    }
    // If not, treat the first digit as part of the local number and add '0' prefix
    return validateAndFormatNumber('0' + number, id, inputId, rawInput, originalNumber);
  }
  
  // First check if the number already starts with a valid two-digit prefix
  const firstTwoDigits = number.slice(0, 2);
  if (LEBANESE_PREFIXES.includes(firstTwoDigits)) {
    return validateAndFormatNumber(number, id, inputId, rawInput, originalNumber);
  }
  
  // Special handling for prefix '7' or '8'
  if (number.startsWith('7') || number.startsWith('8')) {
    // If it's just '7' or '8' followed by 6 digits, treat it as '07' or '08'
    if (number.length === 7) {
      return validateAndFormatNumber('0' + number, id, inputId, rawInput, originalNumber);
    }
    return {
      id,
      inputId,
      rawInput,
      input: originalNumber,
      output: {
        ext: '',
        prefix: '',
        number: number
      },
      isValid: false,
      note: 'Invalid number format'
    };
  }
  
  // Then check if it starts with a single digit that needs a leading zero
  const firstDigit = number.slice(0, 1);
  if (SINGLE_DIGIT_PREFIXES.includes(firstDigit)) {
    const numberWithLeadingZero = '0' + number;
    return validateAndFormatNumber(numberWithLeadingZero, id, inputId, rawInput, originalNumber);
  }

  return {
    id,
    inputId,
    rawInput,
    input: originalNumber,
    output: {
      ext: '',
      prefix: '',
      number: number
    },
    isValid: false,
    note: 'Invalid Lebanese prefix'
  };
}

function validateAndFormatNumber(number: string, id: number, inputId: number, rawInput: string, originalNumber: string): PhoneNumber {
  // All numbers should be 8 digits (2 for prefix + 6 for number)
  if (number.length !== 8) {
    return {
      id,
      inputId,
      rawInput,
      input: originalNumber,
      output: {
        ext: '',
        prefix: '',
        number: number
      },
      isValid: false,
      note: 'Invalid length'
    };
  }

  const prefix = number.slice(0, 2);
  const localNumber = number.slice(2);

  // Verify the prefix is valid
  if (!LEBANESE_PREFIXES.includes(prefix)) {
    return {
      id,
      inputId,
      rawInput,
      input: originalNumber,
      output: {
        ext: '',
        prefix: '',
        number: number
      },
      isValid: false,
      note: 'Invalid prefix'
    };
  }
  
  return {
    id,
    inputId,
    rawInput,
    input: originalNumber,
    output: {
      ext: '00961',
      prefix: prefix,
      number: localNumber
    },
    isValid: true
  };
}