import React, { useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import './SearchRecommendations.css';
import { useNavigate, useParams} from 'react-router-dom';
function SearchRecommendations() {
  const navigate=useNavigate();
  const {username}=useParams();
  const [searchParams, setSearchParams] = useState({ bookname: '', genre: '', author: '' });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // To show/hide the modal

  // Handle input change for search fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  // Function to handle the search button click
  const fetchRecommendations = async () => {
    if (!searchParams.bookname && !searchParams.author && !searchParams.genre) {
      setShowModal(true); // Show the modal if nothing is searched
      return; // Stop further execution if no search parameters are provided
    }

    setLoading(true); // Start loading spinner

    setTimeout(async () => {
      try {
        const response = await axios.get('http://10.1.34.13:5000/recommendations/search', { params: searchParams });
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }

      setLoading(false); // Hide loading spinner after 5 seconds
    }, 5000); // Wait for 5 seconds before showing the results
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };
  const handleBackClick = () => {
    navigate(-1); // Go back to the previously visited page
  };

  return (
    <div className="search-page">
      <button onClick={handleBackClick} className="top-right-button">
        Back
       </button>
      <h1>Search Book Recommendations</h1>

      {/* Search Form */}
      <div className="search-form">
        <input
          type="text"
          name="bookname"
          placeholder="Search by book name"
          value={searchParams.bookname}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="genre"
          placeholder="Search by genre"
          value={searchParams.genre}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="author"
          placeholder="Search by author"
          value={searchParams.author}
          onChange={handleInputChange}
        />
        <button onClick={fetchRecommendations}>Search</button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="spinner-box">
          <div className="blue-orbit leo"></div>
          <div className="green-orbit leo"></div>
          <div className="red-orbit leo"></div>
          <div className="white-orbit w1 leo"></div>
          <div className="white-orbit w2 leo"></div>
          <div className="white-orbit w3 leo"></div>
        </div>
      )}

      {/* Pop-up Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Nothing is searched. Please enter at least one search parameter.</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {/* Display Recommendations */}
      <div className="recommendation-list">
        {recommendations.length === 0 && !loading && <p></p>}
        {recommendations.map((rec, index) => (
          <div key={index} className="recommendation-card">
            <h3>{rec.bookname}</h3>
            <p><strong>Genre:</strong> {rec.genre}</p>
            <p><strong>Author:</strong> {rec.author}</p>
            <p><strong>Comment:</strong> {rec.comment}</p>
            
            {/* Rating */}
            <p><strong>Rating:</strong>
              <div className="star-rating">
                {[...Array(5)].map((star, i) => (
                  <FaStar key={i} size={20} color={i < rec.stars ? '#ffc107' : '#e4e5e9'} />
                ))}
              </div>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchRecommendations;
