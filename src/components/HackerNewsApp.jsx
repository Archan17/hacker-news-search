// src/components/HackerNewsApp.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';


function HackerNewsApp() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      setError(null);

      axios.get(`http://hn.algolia.com/api/v1/search?query=${query}`)
        .then((response) => {
          setResults(response.data.hits);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    }
  }, [query]);

  const handlePostClick = (postId) => {
    setIsLoading(true);
    setError(null);

    axios.get(`http://hn.algolia.com/api/v1/items/${postId}`)
      .then((response) => {
        setSelectedPost(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  };

  return (
    <div className={`container mt-5${darkMode ? ' dark-mode' : ''}`}>
      <div className="d-flex justify-content-end mb-3">
        <button
          className={`btn ${darkMode ? 'btn-light' : 'btn-dark'}`}
          onClick={toggleDarkMode}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <h1 className={`mb-4 ${darkMode ? 'text-light' : 'text-primary'}`}>Hacker News Search</h1>
      <div className={`input-group mb-4${darkMode ? ' bg-dark' : ''}`}>
        <input
          type="text"
          className={`form-control${darkMode ? ' bg-dark text-light' : ''}`}
          placeholder="Search Hacker News"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="input-group-append">
          <button
            className={`btn ${darkMode ? 'btn-light' : 'btn-dark'}`}
            type="button"
            onClick={() => setQuery('')}
          >
            Clear
          </button>
        </div>
      </div>
      <ul className={`list-group${darkMode ? ' bg-dark' : ''}`}>
        {results.map((result) => (
          <li
            className={`list-group-item${darkMode ? ' bg-dark text-light' : ''}`}
            key={result.objectID}
          >
            <a
              href="#!"
              onClick={() => handlePostClick(result.objectID)}
              className={`text-success${darkMode ? ' text-light' : ''}`}
              style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              {result.title}
            </a>
          </li>
        ))}
      </ul>
      {isLoading && <p className={`mt-3 ${darkMode ? 'text-light' : 'text-primary'}`}>Loading...</p>}
      {error && <p className={`mt-3 ${darkMode ? 'text-danger' : 'text-danger'}`}>Error: {error.message}</p>}
      {selectedPost && (
        <div className={`mt-4${darkMode ? ' bg-dark' : ''}`}>
          <h2 className={`text-primary${darkMode ? ' text-light' : ''}`}>{selectedPost.title}</h2>
          <p className={`text-muted${darkMode ? ' text-light' : 'text-muted'}`}>Points: {selectedPost.points}</p>
          <h3 className={`text-primary${darkMode ? ' text-light' : ''}`}>Comments</h3>
          <ul>
            {selectedPost.children.map((comment) => (
              <li key={comment.id} className={`mb-3${darkMode ? ' text-light' : ''}`}>{comment.text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default HackerNewsApp;
