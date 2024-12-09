import React from 'react';
import SearchableDropdown from './SearchableDropdown';
import PropTypes from 'prop-types';

/**
 * IngredientSelect Component
 *
 * @param {function} onSelect - Callback when an ingredient is selected.
 * @param {boolean} required - Whether the field is required.
 * @param {string} name - Name attribute for the input.
 * @param {string} label - Label for the dropdown.
 */
const IngredientSelect = ({ onSelect, required, name, label }) => {
  const handleSelect = (selectedOption) => {
    onSelect(selectedOption);
  };

  return (
    <SearchableDropdown
      label={label || 'Select Ingredient'}
      apiEndpoint="/api/ingredients/"
      onChange={handleSelect}
      required={required}
      placeholder="Search for an ingredient..."
      name={name}
    />
  );
};

IngredientSelect.propTypes = {
  onSelect: PropTypes.func.isRequired,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default IngredientSelect;
