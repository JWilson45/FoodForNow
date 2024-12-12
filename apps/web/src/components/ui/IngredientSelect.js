import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import config from '@/config';

export const IngredientSelect = ({ onSelect }) => {
  const [ingredientOptions, setIngredientOptions] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch(`${config.apiBaseUrl}/ingredients`, {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error(`Error fetching ingredients: ${res.statusText}`);
        }
        const data = await res.json();
        const options = data.ingredients.map((ing) => ({
          label: ing.name,
          value: ing._id,
        }));
        setIngredientOptions(options);
      } catch (err) {
        console.error('Error fetching ingredients:', err);
      }
    };

    fetchIngredients();
  }, []);

  return (
    <Select
      onValueChange={(value) => onSelect({ value })}
      placeholder="Select Ingredient"
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Ingredient" />
      </SelectTrigger>
      <SelectContent>
        {ingredientOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

IngredientSelect.propTypes = {
  onSelect: PropTypes.func.isRequired,
};
