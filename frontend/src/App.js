import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import UserRecommend from'./components/UserRecommend';
import UserHome from './components/UserHome';
import SavedBooks from './components/SavedBooks';
import LikedBooks from './components/LikedBooks';
import Search from './components/Search';
import Audio from './components/Audio';
import SearchRecommendations from './components/SearchRecommendations';
import Recommend from './components/Recommend';

function App() {
  return (
    <Router>
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/audio" element={<Audio />} />
        <Route path="/recommendations" element={<Recommend />} />
        <Route path="/home/:username/Recommend" element={<UserRecommend />} />
        <Route path="/openbooklibrary" element={<Search />} />
        <Route path="/home/:username" element={<UserHome />} />
        <Route path="/home/:username/saved" element={<SavedBooks />} /> {/* Fixed route */}
        <Route path="/home/:username/liked" element={<LikedBooks />} /> {/* Fixed route */}
        <Route path="/home/:username/searchrecommendations" element={<SearchRecommendations />} />
      </Routes>
    </Router>
  );
}

export default App;
