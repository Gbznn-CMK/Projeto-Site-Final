import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats phone numbers to Brazilian format: (XX) 9XXXX-XXXX or (XX) XXXX-XXXX
 */
@Pipe({
  name: 'phone',
  standalone: true
})
export class PhonePipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) return '';
    
    let phone = String(value).replace(/\D/g, '');
    
    if (phone.length === 10) {
      // Format: (XX) XXXX-XXXX
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
    } else if (phone.length === 11) {
      // Format: (XX) 9XXXX-XXXX
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
    }
    
    return String(value);
  }
}

/**
 * Formats numbers to Brazilian currency (BRL)
 * Example: 100.50 -> R$ 100,50
 */
@Pipe({
  name: 'currency',
  standalone: true
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number | string, showSymbol = true): string {
    if (value === null || value === undefined) return '';
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '';
    
    const formatted = num.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return showSymbol ? `R$ ${formatted}` : formatted;
  }
}

/**
 * Formats dates and times to Brazilian format
 * Supports: date only (DD/MM/YYYY), datetime (DD/MM/YYYY HH:MM), or time only (HH:MM)
 */
@Pipe({
  name: 'dateTime',
  standalone: true
})
export class DateTimePipe implements PipeTransform {
  transform(value: string | Date, format: 'date' | 'datetime' | 'time' = 'date'): string {
    if (!value) return '';
    
    const date = typeof value === 'string' ? new Date(value) : value;
    
    if (isNaN(date.getTime())) return '';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    switch (format) {
      case 'date':
        return `${day}/${month}/${year}`;
      case 'time':
        return `${hours}:${minutes}`;
      case 'datetime':
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      default:
        return `${day}/${month}/${year}`;
    }
  }
}

/**
 * Formats duration in minutes to readable format
 * Example: 90 -> "1h 30m", 45 -> "45m"
 */
@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {
  transform(value: number | string): string {
    if (!value) return '';
    
    const minutes = typeof value === 'string' ? parseInt(value) : value;
    if (isNaN(minutes) || minutes <= 0) return '';
    
    if (minutes < 60) {
      return `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
}
