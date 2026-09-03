/**
 * Validation utilities for forms and inputs
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates email address
 * @param email - Email to validate
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validates phone number (accepts multiple formats)
 * @param phone - Phone number to validate
 * @returns True if phone is valid
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
}

/**
 * Validates password strength
 * Minimum 8 characters, at least 1 uppercase, 1 number, 1 special character
 * @param password - Password to validate
 * @returns Object with validity and message
 */
export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Senha deve ter no mínimo 8 caracteres' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Senha deve conter pelo menos 1 letra maiúscula' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Senha deve conter pelo menos 1 número' };
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return { valid: false, message: 'Senha deve conter pelo menos 1 caractere especial (!@#$%^&*)' };
  }
  return { valid: true, message: 'Senha forte' };
}

/**
 * Validates name (non-empty, min 3 characters)
 * @param name - Name to validate
 * @returns True if name is valid
 */
export function isValidName(name: string): boolean {
  return name.trim().length >= 3;
}

/**
 * Validates price (positive number)
 * @param price - Price to validate
 * @returns True if price is valid
 */
export function isValidPrice(price: number | string): boolean {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(num) && num > 0;
}

/**
 * Validates duration in minutes (positive number, multiple of 15)
 * @param duration - Duration in minutes
 * @returns True if duration is valid
 */
export function isValidDuration(duration: number): boolean {
  return duration > 0 && duration % 15 === 0;
}

/**
 * Validates time format (HH:MM)
 * @param time - Time string to validate
 * @returns True if time is valid
 */
export function isValidTimeFormat(time: string): boolean {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(time);
}

/**
 * Validates date is in the future
 * @param dateStr - Date string in ISO format
 * @returns True if date is in the future
 */
export function isFutureDateTime(dateStr: string): boolean {
  return new Date(dateStr) > new Date();
}

/**
 * Sanitizes string input (removes dangerous characters)
 * @param input - Input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Validates form field is not empty
 * @param value - Value to check
 * @returns True if value is not empty
 */
export function isNotEmpty(value: string | number | null | undefined): boolean {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}
