import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
  }).format(price);
}

export function formatPhoneNumber(phone: string): string {
  // Format Gabon phone number (+241)
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('241')) {
    return `+241 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[éèê]/g, 'e')
    .replace(/[àâ]/g, 'a')
    .replace(/[ùû]/g, 'u')
    .replace(/[ôö]/g, 'o')
    .replace(/[îï]/g, 'i')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
} 