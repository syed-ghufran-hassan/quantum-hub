import { describe, it, expect } from '@jest/globals';
import { parseContractError } from '../errorHandler';

describe('Error Handler', () => {
  describe('parseContractError', () => {
    it('should parse not authorized error (u100)', () => {
      const error = new Error('u100');
      const result = parseContractError(error);
      
      expect(result.code).toBe(100);
      expect(result.title).toBe('Not Authorized');
      expect(result.message).toContain("don't have permission");
    });

    it('should parse insufficient funds error (u102)', () => {
      const error = new Error('u102');
      const result = parseContractError(error);
      
      expect(result.code).toBe(102);
      expect(result.title).toBe('Insufficient Funds');
      expect(result.message).toContain("don't have enough STX");
    });

    it('should parse not found error (u103)', () => {
      const error = new Error('u103');
      const result = parseContractError(error);
      
      expect(result.code).toBe(103);
      expect(result.title).toBe('Not Found');
    });

    it('should parse already exists error (u104)', () => {
      const error = new Error('u104');
      const result = parseContractError(error);
      
      expect(result.code).toBe(104);
      expect(result.title).toBe('Already Exists');
    });

    it('should parse contract paused error (u105)', () => {
      const error = new Error('u105');
      const result = parseContractError(error);
      
      expect(result.code).toBe(105);
      expect(result.title).toBe('Contract Paused');
    });

    it('should return default error for unknown codes', () => {
      const error = new Error('unknown error');
      const result = parseContractError(error);
      
      expect(result.code).toBe(999);
      expect(result.title).toBe('Transaction Failed');
    });

    it('should handle error messages containing keywords', () => {
      const error = new Error('not authorized to perform this action');
      const result = parseContractError(error);
      
      expect(result.code).toBe(100);
      expect(result.title).toBe('Not Authorized');
    });

    it('should handle null errors', () => {
      const result = parseContractError(null);
      
      expect(result.code).toBe(999);
      expect(result.title).toBe('Transaction Failed');
    });
  });
});
