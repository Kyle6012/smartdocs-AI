import chalk from 'chalk';

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(chalk.blue(`[INFO] ${new Date().toISOString()}`), message, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.log(chalk.red(`[ERROR] ${new Date().toISOString()}`), message, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.log(chalk.yellow(`[WARN] ${new Date().toISOString()}`), message, ...args);
  },
  success: (message: string, ...args: any[]) => {
    console.log(chalk.green(`[SUCCESS] ${new Date().toISOString()}`), message, ...args);
  }
};

export const sanitizeMessage = (text: string): string => {
  return text.trim().replace(/\n+/g, ' ').substring(0, 1000);
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const isValidPhoneNumber = (number: string): boolean => {
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(number.replace(/[^\d]/g, ''));
};

export const formatPhoneNumber = (number: string): string => {
  return number.includes('@s.whatsapp.net') ? number : `${number}@s.whatsapp.net`;
}; 