import React, { useState } from 'react';
import axios from 'axios';

function UploadData() {
  const [runningData, setRunningData] = useState({ distance: 0, speed: 0, heartRate: 0 });

  const handleChange = (e) => {
    setRunningData({ ...runningData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/upload', runningData);
    // Handle response or errors
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" name="distance" onChange={handleChange} placeholder="Distance" />
      <input type="number" name="speed" onChange={handleChange} placeholder="Speed" />
      <input type="number" name="heartRate" onChange={handleChange} placeholder="Heart Rate" />
      <button type="submit">Upload</button>
    </form>
  );
}

export default UploadData;
