/**
 * Transaction monitoring and error tracking
 */

interface TransactionStatus {
  txId: string;
  status: 'pending' | 'success' | 'failed';
  error?: string;
  timestamp: number;
}

class TransactionMonitor {
  private transactions: Map<string, TransactionStatus> = new Map();
  private listeners: Set<(tx: TransactionStatus) => void> = new Set();

  /**
   * Register a new transaction for monitoring
   */
  register(txId: string): void {
    this.transactions.set(txId, {
      txId,
      status: 'pending',
      timestamp: Date.now()
    });
    this.notifyListeners();
  }

  /**
   * Update transaction status
   */
  update(txId: string, status: 'success' | 'failed', error?: string): void {
    const tx = this.transactions.get(txId);
    if (tx) {
      tx.status = status;
      tx.error = error;
      this.transactions.set(txId, tx);
      this.notifyListeners();
    }
  }

  /**
   * Get transaction status
   */
  getStatus(txId: string): TransactionStatus | undefined {
    return this.transactions.get(txId);
  }

  /**
   * Subscribe to transaction updates
   */
  subscribe(callback: (tx: TransactionStatus) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.transactions.forEach((tx) => {
      this.listeners.forEach((listener) => listener(tx));
    });
  }

  /**
   * Get all pending transactions
   */
  getPending(): TransactionStatus[] {
    return Array.from(this.transactions.values())
      .filter((tx) => tx.status === 'pending');
  }

  /**
   * Get failed transactions
   */
  getFailed(): TransactionStatus[] {
    return Array.from(this.transactions.values())
      .filter((tx) => tx.status === 'failed');
  }

  /**
   * Clear completed transactions older than specified time
   */
  clearOld(maxAge: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    this.transactions.forEach((tx, txId) => {
      if (tx.status !== 'pending' && now - tx.timestamp > maxAge) {
        this.transactions.delete(txId);
      }
    });
  }
}

export const transactionMonitor = new TransactionMonitor();
