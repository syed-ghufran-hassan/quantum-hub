import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.stackshub.io/v1';

/**
 * Parse contract error codes and return user-friendly messages
 */
export function parseContractError(error: any): { 
  code: number; 
  title: string; 
  message: string; 
  action: string 
} {
  // Default error
  let result = {
    code: 999,
    title: 'Transaction Failed',
    message: 'An unexpected error occurred',
    action: 'Please try again or contact support'
  };

  if (!error) return result;

  // Check for known error codes in error message
  const errorMessage = error.toString().toLowerCase();
  
  if (errorMessage.includes('u100') || errorMessage.includes('not authorized')) {
    result = {
      code: 100,
      title: 'Not Authorized',
      message: "You don't have permission to perform this action",
      action: 'Check your wallet connection and try again'
    };
  } else if (errorMessage.includes('u102') || errorMessage.includes('insufficient funds')) {
    result = {
      code: 102,
      title: 'Insufficient Funds',
      message: "You don't have enough STX to complete this transaction",
      action: 'Add more STX to your wallet'
    };
  } else if (errorMessage.includes('u103') || errorMessage.includes('not found')) {
    result = {
      code: 103,
      title: 'Not Found',
      message: 'The requested item could not be found',
      action: 'Check the ID and try again'
    };
  } else if (errorMessage.includes('u104') || errorMessage.includes('already exists')) {
    result = {
      code: 104,
      title: 'Already Exists',
      message: 'This item already exists',
      action: 'Try a different name or ID'
    };
  } else if (errorMessage.includes('u105') || errorMessage.includes('paused')) {
    result = {
      code: 105,
      title: 'Contract Paused',
      message: 'This feature is temporarily unavailable',
      action: 'Please try again later'
    };
  } else if (errorMessage.includes('u106') || errorMessage.includes('transfer failed')) {
    result = {
      code: 106,
      title: 'Transfer Failed',
      message: 'The asset transfer could not be completed',
      action: 'Check your balance and try again'
    };
  } else if (errorMessage.includes('u107') || errorMessage.includes('expired')) {
    result = {
      code: 107,
      title: 'Listing Expired',
      message: 'This listing has expired or been removed',
      action: 'Browse active listings instead'
    };
  } else if (errorMessage.includes('u108') || errorMessage.includes('insufficient balance')) {
    result = {
      code: 108,
      title: 'Insufficient Balance',
      message: "You don't have enough tokens for this operation",
      action: 'Deposit more tokens to continue'
    };
  } else if (errorMessage.includes('u109') || errorMessage.includes('invalid price')) {
    result = {
      code: 109,
      title: 'Invalid Price',
      message: 'The price specified is invalid',
      action: 'Enter a valid price greater than 0'
    };
  }

  return result;
}

/**
 * Log error to analytics service
 */
export async function logError(error: any, context: string): Promise<void> {
  try {
    await axios.post(`${API_URL}/analytics/error`, {
      error: error.toString(),
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server'
    });
  } catch {
    // Silent fail for error logging
  }
}

/**
 * Track transaction for monitoring
 */
export async function trackTransaction(
  txId: string, 
  status: 'pending' | 'success' | 'failed',
  error?: string
): Promise<void> {
  try {
    await axios.post(`${API_URL}/analytics/transaction`, {
      txId,
      status,
      error,
      timestamp: new Date().toISOString()
    });
  } catch {
    // Silent fail
  }
}
