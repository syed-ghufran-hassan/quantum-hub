# Error Handling System Documentation

## Overview

This document describes the comprehensive error handling system implemented across OrbitForge.

## Components

### 1. Error Code Mapping Contract

Location: `stackhub-contracts/error-messages.clar`

Maps Clarity error codes to user-friendly messages:

| Code | Title | Message |
|------|-------|---------|
| u100 | Not Authorized | You don't have permission |
| u102 | Insufficient Funds | Not enough STX |
| u103 | Not Found | Item not found |
| u104 | Already Exists | Item already exists |
| u105 | Contract Paused | Feature unavailable |
| u106 | Transfer Failed | Asset transfer failed |
| u107 | Listing Expired | Listing expired |
| u108 | Insufficient Balance | Not enough tokens |
| u109 | Invalid Price | Price is invalid |

### 2. Error Display Components

Location: `frontend/src/components/ContractErrorDisplay.tsx`

React components for displaying errors:
- `ContractErrorDisplay`: Full error card with icon, title, message, and actions
- `TransactionError`: Compact error display for transactions

### 3. Error Handler Utility

Location: `frontend/src/lib/errorHandler.ts`

Utilities for error parsing and logging:
- `parseContractError()`: Parses error codes to friendly messages
- `logError()`: Sends errors to analytics
- `trackTransaction()`: Tracks transaction status

### 4. Transaction Monitor

Location: `frontend/src/lib/transactionMonitor.ts`

Monitors transaction status:
- Register new transactions
- Update status (pending/success/failed)
- Subscribe to updates
- Track failed transactions

## Usage

### Displaying Contract Errors

```typescript
import { ContractErrorDisplay } from '@/components/ContractErrorDisplay';
import { parseContractError } from '@/lib/errorHandler';

function MyComponent() {
  const [error, setError] = useState(null);

  const handleTransaction = async () => {
    try {
      await contractCall();
    } catch (err) {
      const parsedError = parseContractError(err);
      setError(parsedError);
    }
  };

  return (
    <div>
      <ContractErrorDisplay 
        error={error}
        onRetry={handleTransaction}
        onDismiss={() => setError(null)}
      />
    </div>
  );
}
```

### Monitoring Transactions

```typescript
import { transactionMonitor } from '@/lib/transactionMonitor';

// Register transaction
const txId = await submitTransaction();
transactionMonitor.register(txId);

// Subscribe to updates
transactionMonitor.subscribe((tx) => {
  console.log(`Transaction ${tx.txId}: ${tx.status}`);
});

// Update status
const result = await waitForTransaction(txId);
if (result.success) {
  transactionMonitor.update(txId, 'success');
} else {
  transactionMonitor.update(txId, 'failed', result.error);
}
```

### Error Logging

```typescript
import { logError } from '@/lib/errorHandler';

try {
  await riskyOperation();
} catch (error) {
  await logError(error, 'riskyOperation');
  // Display error to user
}
```

## Benefits

1. **User-Friendly**: Clear, actionable error messages
2. **Consistent**: Standardized error handling across app
3. **Debuggable**: Transaction monitoring and error logging
4. **Accessible**: Proper ARIA labels and screen reader support
5. **Analytics**: Track error patterns for improvements
