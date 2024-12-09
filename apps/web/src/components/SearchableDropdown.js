'use client';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import config from '@/config'; // Ensure config.apiBaseUrl is correctly set

/**
 * SearchableDropdown Component
 *
 * @param {string} label - Label for the dropdown.
 * @param {string} apiEndpoint - API endpoint to fetch options.
 * @param {function} onChange - Callback when an option is selected.
 * @param {boolean} required - Whether the field is required.
 * @param {string} placeholder - Placeholder text for the dropdown.
 * @param {string} name - Name attribute for the input.
 */
const SearchableDropdown = ({
  label,
  apiEndpoint,
  onChange,
  required = false,
  placeholder = 'Select...',
  name,
}) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${config.apiBaseUrl}${apiEndpoint}`, {
          credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();

        // Determine the key based on the endpoint
        let dataKey = '';
        if (apiEndpoint.includes('recipes')) {
          dataKey = 'recipes';
        } else if (apiEndpoint.includes('ingredients')) {
          dataKey = 'ingredients';
        } else {
          throw new Error('Unsupported API endpoint for SearchableDropdown.');
        }

        setOptions(
          (data[dataKey] || []).map((item) => ({
            value: item.id || item._id, // Handle both 'id' and '_id'
            label: item.name,
          }))
        );
      } catch (error) {
        console.error(error);
        setFetchError('Failed to load options. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [apiEndpoint]);

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
      {fetchError ? (
        <p className="text-red-500">{fetchError}</p>
      ) : (
        <Select
          id={name}
          name={name}
          options={options}
          isLoading={isLoading}
          onChange={handleChange}
          placeholder={placeholder}
          isClearable
          classNamePrefix="react-select"
          className="text-black"
          noOptionsMessage={() => 'No options found'}
        />
      )}
    </div>
  );
};

SearchableDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  apiEndpoint: PropTypes.string.isRequired, // Now required
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default SearchableDropdown;
