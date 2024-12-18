// /src/components/RecipeSelect.js
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

const SearchableDropdown = dynamic(
  () => import('./SearchableDropdown'),
  { ssr: false } // Ensure it's only rendered on the client
);

/**
 * RecipeSelect Component
 *
 * @param {function} onSelect - Callback when a recipe is selected.
 * @param {boolean} required - Whether the field is required.
 * @param {string} name - Name attribute for the input.
 * @param {string} label - Label for the dropdown.
 */
const RecipeSelect = ({ onSelect, required, name, label }) => {
  return (
    <SearchableDropdown
      label={label || 'Select Recipe'}
      apiEndpoint="/recipes" // Specify the recipes endpoint
      onChange={onSelect}
      required={required}
      placeholder="Search for a recipe..."
      name={name}
    />
  );
};

RecipeSelect.propTypes = {
  onSelect: PropTypes.func.isRequired,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default RecipeSelect;
