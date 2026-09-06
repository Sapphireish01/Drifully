import React from 'react';
import Image from 'next/image';
import styles from './FilterBar.module.css';

import FilterIcon from '@/components/icons/FilterIcon';

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  hideFilter?: boolean;
  hideSort?: boolean;
  filterDropdown?: React.ReactNode;
  sortDropdown?: React.ReactNode;
  onFilterClick?: () => void;
}

export default function FilterBar({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  hideFilter = false,
  hideSort = false,
  filterDropdown,
  sortDropdown,
  onFilterClick,
}: FilterBarProps) {
  const [internalSearch, setInternalSearch] = React.useState("");
  const [activeDropdown, setActiveDropdown] = React.useState<'filter' | 'sort' | null>(null);
  
  const filterRef = React.useRef<HTMLDivElement>(null);
  const sortRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeDropdown === 'filter' && filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
      if (activeDropdown === 'sort' && sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);
  
  const currentSearch = searchValue !== undefined ? searchValue : internalSearch;
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalSearch(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder={searchPlaceholder}
          className={styles.searchInput}
          value={currentSearch}
          onChange={handleSearchChange}
        />
        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#868C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      {!hideFilter && filterDropdown && (
        <div className={styles.popoverWrapper} ref={filterRef}>
          <button 
            className={styles.toolBtn} 
            onClick={() => {
              if (onFilterClick) {
                onFilterClick();
              } else {
                setActiveDropdown(prev => prev === 'filter' ? null : 'filter');
              }
            }}
          >
            <FilterIcon size={18} color="#868C98" />
            Filter
          </button>
          {activeDropdown === 'filter' && filterDropdown && (
            <div className={styles.dropdownContainer}>
              {React.isValidElement(filterDropdown) ? React.cloneElement(filterDropdown as React.ReactElement<any>, { onClose: () => setActiveDropdown(null) }) : filterDropdown}
            </div>
          )}
        </div>
      )}
      {!hideSort && sortDropdown && (
        <div className={styles.popoverWrapper} ref={sortRef}>
          <button 
            className={styles.toolBtn} 
            onClick={() => setActiveDropdown(prev => prev === 'sort' ? null : 'sort')}
          >
            <Image
              src="/images/admin/sidebar-icons/sort.svg"
              alt="Sort"
              width={16}
              height={16}
            />
            Sort By
          </button>
          {activeDropdown === 'sort' && sortDropdown && (
            <div className={styles.dropdownContainer}>
              {React.isValidElement(sortDropdown) ? React.cloneElement(sortDropdown as React.ReactElement<any>, { onClose: () => setActiveDropdown(null) }) : sortDropdown}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
