import '@testing-library/jest-dom/vitest';
import React from 'react';
import { vi } from 'vitest';

global.React = React;

// Mocking next router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));