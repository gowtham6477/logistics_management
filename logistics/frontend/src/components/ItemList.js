import axios from 'axios';
import React, { useEffect, useState } from 'react';

function ItemList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Items</h1>
      <ul>
        {items.map((item) => (
          <li key={item._id}>{item.name}: {item.description} - ${item.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default ItemList;
