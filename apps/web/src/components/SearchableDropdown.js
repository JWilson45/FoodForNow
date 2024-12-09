'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import axios from 'axios';
import debounce from 'lodash/debounce';

/**
 * SearchableDropdown Component
 *
 * @param {string} label - Label for the dropdown.
 * @param {string} apiEndpoint - API endpoint to fetch options.
 * @param {function} onChange - Callback when an option is selected.
 * @param {boolean} required - Whether the field is required.
 * @param {string} placeholder - Placeholder text for the dropdown.
 * @param {string} name - Name attribute for the input.
 * @param {Array} defaultOptions - Default options to display (optional).
 */
const SearchableDropdown = ({
  label,
  apiEndpoint,
  onChange,
  required = false,
  placeholder = 'Select...',
  name,
  defaultOptions = [],
}) => {
  const [options, setOptions] = useState(defaultOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const fetchOptions = async (input) => {
    setIsLoading(true);
    try {
      const response = await axios.get(apiEndpoint, {
        params: { search: input },
        withCredentials: true, // Include cookies in the request
      });
      const data = response.data;
      if (apiEndpoint.includes('ingredients')) {
        setOptions(
          data.ingredients.map((ing) => ({
            value: ing.id, // Assuming 'id' is used instead of '_id'
            label: ing.name,
          }))
        );
      } else if (apiEndpoint.includes('recipes')) {
        setOptions(
          data.recipes.map((rec) => ({
            value: rec.id, // Assuming 'id' is used instead of '_id'
            label: rec.name,
          }))
        );
      }
    } catch (error) {
      console.error(`Error fetching options from ${apiEndpoint}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce the fetchOptions function to optimize API calls
  const debouncedFetch = useCallback(debounce(fetchOptions, 500), [
    apiEndpoint,
  ]);

  useEffect(() => {
    // Initial fetch without any search query
    fetchOptions('');
    // Cleanup debounce on unmount
    return () => {
      debouncedFetch.cancel();
    };
  }, [apiEndpoint, debouncedFetch]);

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    debouncedFetch(newValue);
    return newValue;
  };

  const handleChange = (selectedOption) => {
    if (onChange) {
      onChange(selectedOption);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Select
        id={name}
        name={name}
        options={options}
        isLoading={isLoading}
        onChange={handleChange}
        onInputChange={handleInputChange}
        placeholder={placeholder}
        isClearable
        classNamePrefix="react-select"
        className="text-black"
        noOptionsMessage={() => 'No options found'}
      />
    </div>
  );
};

SearchableDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  apiEndpoint: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  defaultOptions: PropTypes.array,
};

export default SearchableDropdown;
