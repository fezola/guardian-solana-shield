/**
 * Jest setup file for testing environment
 */

import '@testing-library/jest-dom';

// Mock WebAuthn API for testing
Object.defineProperty(window, 'PublicKeyCredential', {
  writable: true,
  value: {
    isUserVerifyingPlatformAuthenticatorAvailable: jest.fn().mockResolvedValue(true),
  },
});

Object.defineProperty(window.navigator, 'credentials', {
  writable: true,
  value: {
    create: jest.fn().mockResolvedValue({
      id: 'test-credential-id',
      response: {
        getPublicKey: jest.fn().mockReturnValue(new ArrayBuffer(32)),
      },
    }),
    get: jest.fn().mockResolvedValue({
      id: 'test-credential-id',
      response: {
        clientDataJSON: new TextEncoder().encode(JSON.stringify({
          challenge: 'test-challenge',
          origin: 'http://localhost',
          type: 'webauthn.get',
        })),
        authenticatorData: new ArrayBuffer(32),
        signature: new ArrayBuffer(32),
      },
    }),
  },
});

// Mock crypto.getRandomValues
Object.defineProperty(window, 'crypto', {
  writable: true,
  value: {
    getRandomValues: jest.fn().mockImplementation((array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    }),
  },
});

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
