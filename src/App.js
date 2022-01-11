import React from 'react';
import Details from './detail';
import Main from './main';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/:id" element={<Details />} />
      </Routes>
    </Router>
  );
}

export default App;
