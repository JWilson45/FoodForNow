import Button from '@/components/Button';
import PropTypes from 'prop-types';

export default function Pagination({
  currentIndex,
  totalItems,
  itemsPerPage,
  onPrevious,
  onNext,
}) {
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex + itemsPerPage < totalItems;

  return (
    <div className="flex justify-center items-center mt-6 space-x-4">
      <Button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-disabled={!canGoPrevious}
        className={`px-4 py-2 bg-button-blue hover:bg-button-blue-hover text-white rounded-lg transition-transform transform hover:scale-105 active:scale-100 shadow-custom hover:shadow-custom-hover ${
          !canGoPrevious ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Previous
      </Button>
      <Button
        onClick={onNext}
        disabled={!canGoNext}
        aria-disabled={!canGoNext}
        className={`px-4 py-2 bg-button-blue hover:bg-button-blue-hover text-white rounded-lg transition-transform transform hover:scale-105 active:scale-100 shadow-custom hover:shadow-custom-hover ${
          !canGoNext ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Next
      </Button>
    </div>
  );
}

Pagination.propTypes = {
  currentIndex: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};
