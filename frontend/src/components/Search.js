import React, { useState } from 'react';
import axios from 'axios';
import './Search.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams} from 'react-router-dom';


function Search() {
  const {username}=useParams();
  const [query, setQuery] = useState('');
  const [bookResults, setBookResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [authorDetails, setAuthorDetails] = useState(null);
  const [workEditions, setWorkEditions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchBooks = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
      setBookResults(response.data.docs || []);
    } catch (error) {
      console.error('Error fetching search results:', error);
      alert("An error occurred while searching for books.");
    }
    setLoading(false);
  };

  const fetchBookDetails = async (bookId) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://openlibrary.org/books/${bookId}.json`);
      setSelectedBook(response.data);

      if (response.data.authors && response.data.authors[0]?.key) {
        fetchAuthorDetails(response.data.authors[0].key);
      }
      if (response.data.works && response.data.works[0]?.key) {
        fetchEditions(response.data.works[0].key);
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      alert("An error occurred while fetching the book details.");
    }
    setLoading(false);
  };

  const fetchAuthorDetails = async (authorId) => {
    try {
      const response = await axios.get(`https://openlibrary.org${authorId}.json`);
      setAuthorDetails(response.data);
    } catch (error) {
      console.error('Error fetching author details:', error);
      alert("An error occurred while fetching author details.");
    }
  };

  const fetchEditions = async (workId) => {
    try {
      const response = await axios.get(`https://openlibrary.org/works/${workId}/editions.json`);
      setWorkEditions(response.data.entries || []);
    } catch (error) {
      console.error('Error fetching editions:', error);
      alert("An error occurred while fetching editions.");
    }
  };

  // Generate ReadAnyBook link for a book
  const generateReadAnyBookLink = (bookName, authorName) => {
    const bookTitle = bookName.toLowerCase().replace(/\s+/g, '%20'); // Replace spaces with %20
    const author = authorName.toLowerCase().replace(/\s+/g, '%20'); // Replace spaces with %20
    return `https://www.readanybook.com/search?q=${bookTitle}%20${author}`;
  };

  // Generate Amazon link for a book (use book title and author to search)
  const generateAmazonLink = (bookName, authorName) => {
    const bookTitle = bookName.toLowerCase().replace(/\s+/g, '+'); // Replace spaces with '+'
    const author = authorName.toLowerCase().replace(/\s+/g, '+'); // Replace spaces with '+'
    return `https://www.amazon.com/s?k=${bookTitle}+${author}`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(query);
  };
  
  return (
    <div className="App">
      <button
          className="top-right-button"
          onClick={() => navigate(-1)}
          style={{ flex: 1, marginRight: '10px' }}
        >
       Back
        </button>
      <h1>Read What You Want</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for books, authors, ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {loading && <div className="loading">
        <div className="Box">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>}

      <div className="search-results">
        {bookResults.length > 0 ? (
          bookResults.map((book) => (
            <div key={book.key} className="book-item">
              <h2>{book.title}</h2>
              <p>Author: {book.author_name?.join(', ')}</p>
              <p>First Published: {book.first_publish_year}</p>

              {/* Both Amazon and ReadAnyBook buttons */}
              <button
                onClick={() => window.open(generateAmazonLink(book.title, book.author_name?.[0]), '_blank')}
                className="amazon-button"
              >
                View on Amazon
              </button>

              <button
                onClick={() => window.open(generateReadAnyBookLink(book.title, book.author_name?.[0]), '_blank')}
                className="readanybook-button"
              >
                View on ReadAnyBook
              </button>
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>

      {selectedBook && (
        <div className="book-details">
          <h2>{selectedBook.title}</h2>
          <p>Published by: {selectedBook.publishers?.join(', ') || "N/A"}</p>
          <p>ISBN: {selectedBook.isbn_13?.join(', ') || "N/A"}</p>
          <p>Languages: {selectedBook.languages?.map(lang => lang.key).join(', ') || "N/A"}</p>
          <p>Subjects: {selectedBook.subjects?.join(', ') || "N/A"}</p>
          {selectedBook.description && (
            <p>Description: {selectedBook.description.value || selectedBook.description}</p>
          )}
          {selectedBook.covers && (
            <img
              src={`https://covers.openlibrary.org/b/id/${selectedBook.covers[0]}-L.jpg`}
              alt="Book cover"
              className="book-cover"
            />
          )}
        </div>
      )}

      {authorDetails && (
        <div className="author-details">
          <h3>Author: {authorDetails.name}</h3>
          <p>Born: {authorDetails.birth_date || "N/A"}</p>
          <p>Biography: {authorDetails.bio?.value || authorDetails.bio || "Biography not available."}</p>
        </div>
      )}

      {workEditions.length > 0 && (
        <div className="editions">
          <h3>Available Editions</h3>
          {workEditions.map((edition) => (
            <div key={edition.key} className="editions-item">
              <p>Publisher: {edition.publishers?.join(', ') || "N/A"}</p>
              <p>Published: {edition.publish_date || "N/A"}</p>
              <p>ISBN: {edition.isbn_13?.join(', ') || "N/A"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
