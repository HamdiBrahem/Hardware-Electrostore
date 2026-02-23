import { render, screen } from '@testing-library/react';
import StarRating from '../../components/StarRating';

// Mock react-icons with simple span elements
jest.mock('react-icons/fa', () => ({
  FaStar: () => <span data-testid="full-star" />,
  FaStarHalfAlt: () => <span data-testid="half-star" />,
  FaRegStar: () => <span data-testid="empty-star" />,
}));

describe('StarRating', () => {
  it('should render 5 stars total', () => {
    const { container } = render(<StarRating rating={3} />);
    const stars = container.querySelectorAll('[data-testid]');
    expect(stars).toHaveLength(5);
  });

  it('should render 5 full stars for rating 5', () => {
    render(<StarRating rating={5} />);
    expect(screen.getAllByTestId('full-star')).toHaveLength(5);
    expect(screen.queryAllByTestId('half-star')).toHaveLength(0);
    expect(screen.queryAllByTestId('empty-star')).toHaveLength(0);
  });

  it('snapshot: rating 5', () => {
    const { container } = render(<StarRating rating={5} />);
    expect(container.innerHTML).toMatchSnapshot();
  });

  it('snapshot: rating 0', () => {
    const { container } = render(<StarRating rating={0} />);
    expect(container.innerHTML).toMatchSnapshot();
  });

  it('snapshot: rating 3.5', () => {
    const { container } = render(<StarRating rating={3.5} />);
    expect(container.innerHTML).toMatchSnapshot();
  });

  it('should render 5 empty stars for rating 0', () => {
    render(<StarRating rating={0} />);
    expect(screen.queryAllByTestId('full-star')).toHaveLength(0);
    expect(screen.queryAllByTestId('half-star')).toHaveLength(0);
    expect(screen.getAllByTestId('empty-star')).toHaveLength(5);
  });

  it('should render correct stars for rating 3.5', () => {
    render(<StarRating rating={3.5} />);
    expect(screen.getAllByTestId('full-star')).toHaveLength(3);
    expect(screen.getAllByTestId('half-star')).toHaveLength(1);
    expect(screen.getAllByTestId('empty-star')).toHaveLength(1);
  });

  it('should render correct stars for rating 4', () => {
    render(<StarRating rating={4} />);
    expect(screen.getAllByTestId('full-star')).toHaveLength(4);
    expect(screen.queryAllByTestId('half-star')).toHaveLength(0);
    expect(screen.getAllByTestId('empty-star')).toHaveLength(1);
  });

  it('should render correct stars for rating 2.5', () => {
    render(<StarRating rating={2.5} />);
    expect(screen.getAllByTestId('full-star')).toHaveLength(2);
    expect(screen.getAllByTestId('half-star')).toHaveLength(1);
    expect(screen.getAllByTestId('empty-star')).toHaveLength(2);
  });

  it('should render correct stars for rating 1', () => {
    render(<StarRating rating={1} />);
    expect(screen.getAllByTestId('full-star')).toHaveLength(1);
    expect(screen.queryAllByTestId('half-star')).toHaveLength(0);
    expect(screen.getAllByTestId('empty-star')).toHaveLength(4);
  });
});
