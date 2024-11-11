import React, { useState, useEffect } from 'react';
import Typed from 'typed.js';
import { Link, useParams } from 'react-router-dom';
import { FaSearch, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import './Home.css';

const apiKey = 'AIzaSyDAF9QxIl-gngUpnGNxOsWCml7c1xG3Sbg'; 

const UserHome = () => {
  const { username } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [books, setBooks] = useState([]);
  const [typed, setTyped] = useState(null);
  const [sidebarActive, setSidebarActive] = useState(false);

  useEffect(() => {
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

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const saveBook = async (book) => {
    const response = await fetch(`http://10.1.34.13:5000/api/saveBook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, book })
    });
    if (response.ok) {
      book.saved = true;
      setBooks([...books]);
    }
  };

  const unsaveBook = async (book) => {
    const response = await fetch(`http://10.1.34.13:5000/api/unsaveBook`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, book })
    });
    if (response.ok) {
      book.saved = false;
      setBooks([...books]);
    }
  };

  const likeBook = async (book) => {
    const response = await fetch(`http://10.1.34.13:5000/api/likeBook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, book })
    });
    if (response.ok) {
      book.liked = true;
      setBooks([...books]);
    }
  };

  const unlikeBook = async (book) => {
    const response = await fetch(`http://10.1.34.13:5000/api/unlikeBook`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, book })
    });
    if (response.ok) {
      book.liked = false;
      setBooks([...books]);
    }
  };

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
      <header>
      <h3 style={{ fontSize: '60px', fontFamily: '"Dancing Script", cursive' }}>Book Worm</h3>
      </header>

      <div className={`side-navbar d-flex justify-content-between flex-wrap flex-column ${sidebarActive ? 'active-nav' : ''}`} id="sidebar">
        <ul className="nav flex-column text-white w-100">
          <br></br><br></br>
          <li className="nav-link">
            <Link to={`/home/${username}/Recommend`} className="text-white">
              <span className="mx-2">Recommend</span>
            </Link>
          </li>
          <li className="nav-link">
            <Link to={`/home/${username}/searchrecommendations`} className="text-white">
              <span className="mx-2">SearchRecommendation</span>
            </Link>
          </li>
          <li className="nav-link">
            <Link to="/openbooklibrary" className="text-white">
              <span className="mx-2">OpenLibrary</span>
            </Link>
          </li>
          <li className="nav-link">
            <Link to="/audio" className="text-white">
              <span className="mx-2">AudioBooks</span>
            </Link>
          </li>
          <li className="nav-link">
            <Link to={`/home/${username}/saved`} className="text-white">
              <span className="mx-2">Saved</span>
            </Link>
          </li>
          <li className="nav-link">
            <Link to={`/home/${username}/liked`} className="text-white">
              <span className="mx-2">Liked</span>
            </Link>
          </li>
          <li className="nav-link">
            <Link to="/" className="text-white">
              <span className="mx-2">Logout</span>
            </Link>
          </li>
        </ul>
      </div>

      <button id="menu-btn" className="menu-btn" onClick={toggleSidebar}>☰</button>

      <div className="cont">
        <span className="entry en-text-center block my-8"></span>
      </div>

      <div id="search" className="search-section flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by author, title, or genre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} id="search-btn">
          <FaSearch className="mr-2" /> Search
        </button>
      </div>

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

      <div className="book-results">
        {books.length > 0 ? (
          books.map((book, index) => {
            const bookInfo = book.volumeInfo;
            const title = bookInfo.title || 'No title available';
            const authors = bookInfo.authors ? bookInfo.authors.join(', ') : 'No authors available';
            const thumbnail = bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150';
            const description = bookInfo.description || 'No description available';

            return (
              <div key={index} className="book-card bg-gradient-to-r from-blue-200 to-purple-300 p-6 rounded-lg shadow-lg relative">
                <div className="container1" style={{display:'flex'}}>
                  <div
                    onClick={() => (book.saved ? unsaveBook(book) : saveBook(book))}
                    className="text-2xl"
                  >
                    {book.saved ? <FaBookmark /> : <FaRegBookmark />}
                  </div>
                  <div
                    onClick={() => (book.liked ? unlikeBook(book) : likeBook(book))}
                    className="text-2xl"
                  >
                    {book.liked ? <FaHeart /> : <FaRegHeart />}
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <img src={thumbnail} alt={title} className="w-48 h-48 object-cover rounded-md mb-4 transition-transform transform hover:scale-110" />
                  <div className="flex flex-col justify-between ml-4">
                    <h2 className="text-xl font-bold mb-2 text-purple-800">{title}</h2>
                    <p className="text-gray-700 mb-2"><strong>Author(s):</strong> {authors}</p>
                    <p className="text-gray-600">{description.substring(0, 100)}...</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>Search what is in your mind.</p>
        )}
      </div>
      
      <footer className="footer">
        <p>&copy; 2024 Book Recommendation System</p>
        <p className="mt-2">Contact us at: 
          <a href="mailto:support@bookworm.com" className="underline">support@bookworm.com</a>
        </p>
      </footer>
      </div>
  );
};

export default UserHome;
