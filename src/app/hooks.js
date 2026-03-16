/**
 * Typed Redux hooks for better developer experience
 */

import { useDispatch, useSelector } from 'react-redux';

// Export typed versions of hooks for consistent usage
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Re-export store types for convenience
export { store } from './store.js';