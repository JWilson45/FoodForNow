// /src/components/IngredientSelect.js
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

// Dynamically import SearchableDropdown with no SSR
const SearchableDropdown = dynamic(() => import('./SearchableDropdown'), {
  ssr: false,
});

/**
 * IngredientSelect Component
 *
 * Uses SearchableDropdown to load ingredients from the API.
 */
const IngredientSelect = ({ onSelect, required, name, label }) => {
  const handleSelect = (selectedOption) => {
    onSelect(selectedOption);
  };

  return (
    <SearchableDropdown
      label={label || 'Select Ingredient'}
      apiEndpoint="/ingredients" // Specify the ingredients endpoint
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
