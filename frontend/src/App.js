import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ distance: '', speed: '', heartRate: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send data to backend
    await axios.post('/upload', data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Input fields for distance, speed, heart rate */}
        <button type="submit">Upload Data</button>
      </form>
    </div>
  );
}

export default App;
