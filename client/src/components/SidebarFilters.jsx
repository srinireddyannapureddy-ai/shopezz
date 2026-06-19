import React from 'react';

const SidebarFilters = ({ selectedSort, onSortChange, selectedGender, onGenderChange }) => {
  const sortOptions = [
    'Popular',
    'Price Low to High',
    'Price High to Low',
    'Discount'
  ];

  const genderOptions = [
    { label: 'All Genders', value: 'All' },
    { label: 'Men', value: 'Men' },
    { label: 'Women', value: 'Women' },
    { label: 'Unisex', value: 'Unisex' }
  ];

  return (
    <aside className="sidebar">
      {/* Sort By Filter Group */}
      <div className="filter-group">
        <h3>Sort By</h3>
        {sortOptions.map((option) => (
          <label key={option} className="filter-option">
            <input
              type="radio"
              name="sort"
              checked={selectedSort === option}
              onChange={() => onSortChange(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      {/* Gender Filter Group */}
      <div className="filter-group">
        <h3>Gender</h3>
        {genderOptions.map((option) => (
          <label key={option.value} className="filter-option">
            <input
              type="radio"
              name="gender"
              checked={selectedGender === option.value}
              onChange={() => onGenderChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </aside>
  );
};

export default SidebarFilters;
