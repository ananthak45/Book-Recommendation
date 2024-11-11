import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {FaHeart} from 'react-icons/fa'
import './Search.css';

const LikedBooks = () => {
  const { username } = useParams(); // Get the username from the URL
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to handle unliking a book
  const unlikeBook = async (book) => {
    const response = await fetch(`http://10.1.34.13:5000/api/unlikeBook`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, book })
    });
    if (response.ok) {
      // Refresh the list of books after unliking
      fetchLikedBooks(); // Call the updated function name
    }
  };

  // Fetch liked books from MongoDB based on the username
  const fetchLikedBooks = async () => {
    try {
      const response = await axios.get(`http://10.1.34.13:5000/api/getLikedBooks/${username}`);
      setBooks(response.data.books || []); // Handle potential empty or missing 'books' array
    } catch (error) {
      setError('Error fetching liked books');
      console.error('Error fetching liked books:', error);
    } finally {
      setLoading(false); // Stop loading after fetch
    }
  };

  useEffect(() => {
    fetchLikedBooks(); // Fetch books when the component mounts
  }, [username]); // Re-fetch books if the username changes

  if (loading) return <p>Loading books...</p>; // Show loading text
  if (error) return <p>{error}</p>; // Show error message if there's an issue

  // Handle back button click
  const handleBackClick = () => {
    navigate(`/home/${username}`); // Navigate to the user's home page
  };

  return (
    <div>
      <div className="book-results grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {books.length > 0 ? (
          books.map((book, index) => {
            const bookInfo = book.volumeInfo || {}; // Safely access volumeInfo
            const title = bookInfo.title || 'No title available';
            const authors = bookInfo.authors ? bookInfo.authors.join(', ') : 'No authors available';
            const thumbnail = bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150';
            const description = bookInfo.description || 'No description available';

            return (
              <div key={index} className="book-card bg-gradient-to-r from-blue-200 to-purple-300 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                 <div className="container1 text-2xl pink" onClick={() => unlikeBook(book)} >
                  <FaHeart />
                  </div>
                <img src={thumbnail} alt={title} className="w-full h-48 object-cover rounded-md mb-4 transition-transform transform hover:scale-110" />
                <h2 className="text-xl font-bold mb-2 text-purple-800">{title}</h2>
                <p className="text-gray-700 mb-2"><strong>Author(s):</strong> {authors}</p>
                <p className="text-gray-600">{description.substring(0, 100)}...</p>
               
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 italic">No Liked Books in your account.</p>
        )}
      </div>
      <button onClick={handleBackClick} className="top-right-button">
        Back
      </button>
    </div>
  );
};

export default LikedBooks;
