import React, { useState, useEffect } from 'react';
import Typed from 'typed.js';
import { Link } from 'react-router-dom';
import { FaSearch, FaHeart } from 'react-icons/fa'; // Import FaHeart icon
import './Home.css';

// Your Google Books API Key
const apiKey = 'AIzaSyDAF9QxIl-gngUpnGNxOsWCml7c1xG3Sbg'; // Replace with your actual API key

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [books, setBooks] = useState([]);
  const [typed, setTyped] = useState(null);
  const [favorites, setFavorites] = useState([]);


  // Function to toggle favorite status
  const toggleFavorite = (book) => {
    const isFavorite = favorites.includes(book);
    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav !== book));
    } else {
      setFavorites([...favorites, book]);
    }
   };

  
  useEffect(() => {
    // Initialize Typed.js
    const options = {
      strings: [
        "Find Your Next Favorite Book!", 
        "Discover Your Next Literary Adventure!", 
        "Uncover the Book You'll Love Next!", 
        "Explore New Worlds Through Next Read!"
      ],
      typeSpeed: 50,
      backSpeed: 25,
      backDelay: 1000,
      loop: true
    };

    
    const typedInstance = new Typed('.entry', options);
    setTyped(typedInstance);

    return () => {
      if (typedInstance) typedInstance.destroy();
    };
  }, []);

  // Sidebar toggle logic
  useEffect(() => {
    const menuBtn = document.querySelector("#menu-btn");
    const sidebar = document.querySelector("#sidebar");
  
    const toggleSidebar = () => {
      sidebar.classList.toggle("active-nav");
    };
  
    menuBtn.addEventListener("click", toggleSidebar);
  
    return () => {
      menuBtn.removeEventListener("click", toggleSidebar);
    };
  }, []);  

  const searchBooks = async (query, genre) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}+subject:${genre}&key=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error('Error fetching book data:', error);
    }
  };

  const handleSearch = () => {
    if (searchQuery) {
      searchBooks(searchQuery, genre);
    } else {
      alert('Please enter a search term.');
    }
  };

  return (
    <div className="hbody bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <header>
      <h3 style={{ fontSize: '60px', fontFamily: '"Dancing Script", cursive' }}>Book Worm</h3>
      </header>

      {/* Sidebar Navigation */}
      <div className="side-navbar d-flex justify-content-between flex-wrap flex-column" id="sidebar">
        <ul className="nav flex-column text-white w-100">
          <br></br><br></br>
          <br></br>
          <li className="nav-link">
            <Link to="/login" className="text-white">
              <i className="bx bxs-dashboard"></i>
              <span className="mx-2">Login</span>
            </Link>
          </li>
          <li className="nav-link">
            <Link to="/openbooklibrary" className="text-white">
              <i className="bx bxs-dashboard"></i>
              <span className="mx-2">OpenLibrary</span>
            </Link>
          </li>
          <li className="nav-link">
            <Link to="/Recommendations" className="text-white">
              <i className="bx bx-user-check"></i>
              <span className="mx-2"> See Recommendations</span>
            </Link>
          </li>
          
        </ul>
      </div>

      {/* Menu Button for Sidebar */}
      <button id="menu-btn" className="menu-btn">☰</button>

      {/* Entry message section with Typed.js */}
      <div className="cont">
        <br></br><br></br>
        <span className="entry en-text-center block my-8"></span>
        <br></br>
      </div>

      {/* Search Section */}
      <div id="search" className="search-section flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by author, title, or genre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="search"
        />
        <button onClick={handleSearch} id="search-btn">
          <FaSearch className="mr-2" /> Search
        </button>
      </div>

      {/* Filter Section */}
      <div id="genres" className="filter-section flex justify-center mb-6">
        <label className="mr-2 text-lg font-medium" htmlFor="genre">Choose a genre:</label>
        <select
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="genre-select"
        >
          <option value="">--Select Genre--</option>
          <option value="fiction">Fiction</option>
          <option value="non-fiction">Non-fiction</option>
          <option value="fantasy">Fantasy</option>
          <option value="mystery">Mystery</option>
        </select>
      </div>

      {/* Book Results Section */}
      <div className="book-results">
        {books.length > 0 ? (
          books.map((book, index) => {
            const bookInfo = book.volumeInfo;
            const title = bookInfo.title || 'No title available';
            const authors = bookInfo.authors ? bookInfo.authors.join(', ') : 'No authors available';
            const thumbnail = bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150';
            const description = bookInfo.description || 'No description available';

            return (
              <div key={index} className="book-card bg-gradient-to-r from-blue-200 to-purple-300 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <img src={thumbnail} alt={title} className="w-full h-48 object-cover rounded-md mb-4 transition-transform transform hover:scale-110" />
                <h2 className="text-xl font-bold mb-2 text-purple-800">{title}</h2>
                <p className="text-gray-700 mb-2"><strong>Author(s):</strong> {authors}</p>
                <p className="text-gray-600">{description.substring(0, 100)}...</p>
               
               
               
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 italic">Search with whats on your mind.</p>
        )}
      </div>
  

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Book Recommendation System</p>
        <p className="mt-2">Contact us at: 
          <a href="mailto:support@bookworm.com" className="underline">support@bookworm.com</a>
        </p>
      </footer>
    </div>
  );
};

export default Home;