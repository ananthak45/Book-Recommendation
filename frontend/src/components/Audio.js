import React, { useState } from 'react';
import './Audio.css';
import { useNavigate} from 'react-router-dom';
function Audio() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  // Function to generate a LibriVox link for an audiobook
  const generateLibriVoxLink = (bookName) => {
    const formattedBookName = bookName.toLowerCase().replace(/\s+/g, '%20');
    return `https://librivox.org/search/?q=${formattedBookName}&search_form=advanced`;
  };

  // Handle the search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setShowResults(false); // Hide previous results when a new search starts

    // Simulate loading for 7 seconds
    setTimeout(() => {
      setLoading(false);
      setShowResults(true); // Show results after loading completes
    }, 5000);
  };
  const handleBackClick = () => {
    navigate(-1); // Go back to the previously visited page
  };
  return (
    <div className="App">
      {/* Page Heading */}
      <button onClick={handleBackClick} className="top-right-button">
        Back
       </button>
      <h1>Find Audiobooks</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for audiobooks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {/* Loading Animation */}
      {loading && (
        <div className="loading">
          <div className="loader">
            <h1>LOADING</h1>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      {/* Display Results After Loading Completes */}
      {!loading && showResults && query && (
        <div className="search-results">
          <h2>Results for "{query}"</h2>
          <button
            onClick={() => window.open(generateLibriVoxLink(query), '_blank')}
            className="libriVox-button"
          >
            View Audiobook on LibriVox
          </button>
        </div>
      )}
    </div>
  );
}

export default Audio;
