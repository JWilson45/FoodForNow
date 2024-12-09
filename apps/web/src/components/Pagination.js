import Button from '@/components/Button';

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
        className={`px-4 py-2 bg-button-blue hover:bg-button-blue-hover text-white rounded-lg transition-colors ${
          !canGoPrevious ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Previous
      </Button>
      <Button
        onClick={onNext}
        disabled={!canGoNext}
        className={`px-4 py-2 bg-button-blue hover:bg-button-blue-hover text-white rounded-lg transition-colors ${
          !canGoNext ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Next
      </Button>
    </div>
  );
}
