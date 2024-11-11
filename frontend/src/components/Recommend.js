import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Recommend.css';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Recommend() {
  const [recommendations, setRecommendations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('http://10.1.34.13:5000/recommendations');
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
        <button
          className="top-right-button"
          onClick={() => navigate('/')}
          style={{ flex: 1 }}
        >
          Go back
        </button>
      </div>

      <div className="row">
        {recommendations.map((rec) => (
          <div className="col-md-4 mb-4" key={rec.id}>
            <div className="card card-body d-flex flex-column" style={{ height: '100%' }}>
              <h5 className="card-title">{rec.bookname}</h5>
              <h6 className="card-subtitle mb-2 text-muted">Author: {rec.author}</h6>
              <p className="card-text">Comment: {rec.comment}</p>
              <p className="card-text">
                <strong>Rating: </strong>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={20}
                    color={i + 1 <= rec.stars ? '#ffc107' : '#e4e5e9'}
                  />
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommend;
