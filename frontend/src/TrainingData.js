import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainingData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('/mydata');
      setData(result.data);
    };
    
    fetchData();
  }, []);

  return (
    <div>
      {/* Display the training data here */}
    </div>
  );
};

export default TrainingData;
