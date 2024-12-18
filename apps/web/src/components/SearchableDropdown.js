// /src/components/SearchableDropdown.js
'use client';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import config from '@/config'; // Ensure config.apiBaseUrl is correctly set

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Component has mounted
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Prevent fetching on server

    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${config.apiBaseUrl}${apiEndpoint}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
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
            value: item._id || item.id,
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
  }, [apiEndpoint, isMounted]);

  const handleChange = (selectedOption) => {
    if (onChange) {
      onChange(selectedOption);
    }
  };

  // Prevent rendering on server
  if (!isMounted) {
    return null;
  }

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
          instanceId={name} // Use a consistent instanceId
          name={name}
          options={options}
          isLoading={isLoading}
          onChange={handleChange}
          placeholder={placeholder}
          isClearable
          classNamePrefix="react-select"
          className="text-black"
          noOptionsMessage={() => 'No options found'}
          // Removed aria-activedescendant={undefined}
        />
      )}
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
};

export default SearchableDropdown;
