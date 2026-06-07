import { FaSearch, FaTimes } from "../utils/icons";
import "./SearchBar.css";

function SearchBar({ value, onChange, placeholder = "Search...", onFilter, filterOptions = [], filterValue }) {
  return (
    <div className="search-bar">
      <div className="search-bar__input-wrap">
        <span className="search-bar__icon" aria-hidden="true"><FaSearch size={15} /></span>
        <input
          type="text"
          className="search-bar__input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={placeholder}
        />
        {value && (
          <button
            className="search-bar__clear"
            onClick={() => onChange("")}
            aria-label="Clear search"
            title="Clear search"
          >
            <FaTimes size={12} />
          </button>
        )}
      </div>
      {filterOptions.length > 0 && (
        <select
          className="search-bar__filter"
          value={filterValue}
          onChange={(e) => onFilter(e.target.value)}
          aria-label="Filter by specialization"
        >
          <option value="">All Specializations</option>
          {filterOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}
    </div>
  );
}

export default SearchBar;
