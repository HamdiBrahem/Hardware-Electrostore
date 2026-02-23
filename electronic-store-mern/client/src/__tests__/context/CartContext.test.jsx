import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../../context/CartContext';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe('CartContext', () => {
  const product1 = { _id: 'p1', name: 'Laptop', price: 999.99, image: '/test.jpg' };
  const product2 = { _id: 'p2', name: 'Phone', price: 499.99, image: '/test2.jpg' };

  // ─── Initial state ──────────────────────────────────────────
  it('should start with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.isOpen).toBe(false);
  });

  it('snapshot: initial cart state', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const { items, totalItems, totalPrice, isOpen } = result.current;
    expect({ items, totalItems, totalPrice, isOpen }).toMatchSnapshot();
  });

  // ─── ADD_TO_CART ─────────────────────────────────────────────
  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(product1);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Laptop');
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(999.99);
  });

  it('snapshot: cart after adding one item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.addToCart(product1); });
    const { items, totalItems, totalPrice } = result.current;
    expect({ items, totalItems, totalPrice }).toMatchSnapshot();
  });

  it('should increment quantity for duplicate item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(product1);
    });
    act(() => {
      result.current.addToCart(product1);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBeCloseTo(1999.98);
  });

  it('should add multiple different items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(product1);
    });
    act(() => {
      result.current.addToCart(product2);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBeCloseTo(1499.98);
  });

  it('snapshot: cart with multiple items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.addToCart(product1); });
    act(() => { result.current.addToCart(product2); });
    const { items, totalItems, totalPrice } = result.current;
    expect({ items, totalItems, totalPrice }).toMatchSnapshot();
  });

  // ─── REMOVE_FROM_CART ───────────────────────────────────────
  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(product1);
    });
    act(() => {
      result.current.addToCart(product2);
    });
    act(() => {
      result.current.removeFromCart('p1');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Phone');
  });

  // ─── UPDATE_QUANTITY ─────────────────────────────────────────
  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(product1);
    });
    act(() => {
      result.current.updateQuantity('p1', 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.totalItems).toBe(5);
  });

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(product1);
    });
    act(() => {
      result.current.updateQuantity('p1', 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  // ─── CLEAR_CART ──────────────────────────────────────────────
  it('should clear all items from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(product1);
    });
    act(() => {
      result.current.addToCart(product2);
    });
    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  // ─── TOGGLE_CART / CLOSE_CART ────────────────────────────────
  it('should toggle cart open/close', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.toggleCart();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggleCart();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should close cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.toggleCart();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeCart();
    });
    expect(result.current.isOpen).toBe(false);
  });

  // ─── Edge cases ──────────────────────────────────────────────
  it('should throw error when useCart is used outside CartProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useCart());
    }).toThrow('useCart must be used within CartProvider');

    consoleSpy.mockRestore();
  });

  it('should handle items with id instead of _id', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const productWithId = { id: 'p3', name: 'Tablet', price: 299.99, image: '/test.jpg' };

    act(() => {
      result.current.addToCart(productWithId);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(1);

    act(() => {
      result.current.addToCart(productWithId);
    });
    expect(result.current.items[0].quantity).toBe(2);
  });
});
