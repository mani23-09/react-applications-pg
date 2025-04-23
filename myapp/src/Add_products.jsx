// src/components/AddProduct.js
import React, { useState } from 'react';

const AddProduct = ({ onAddProduct }) => {
  const [fruitName, setFruitName] = useState('');
  const [description, setDescription] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create the product object
    const newProduct = {
      fruitName,
      description,
      imgUrl,
      price,
      quantity,
    };
    // Call the parent function to handle the new product
    onAddProduct(newProduct);
    // Reset form after submission
    setFruitName('');
    setDescription('');
    setImgUrl('');
    setPrice('');
    setQuantity('');
  };

  return (
    <div>
      <h2>Add Fruit Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Fruit Name:</label>
          <input
            type="text"
            value={fruitName}
            onChange={(e) => setFruitName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="url"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="1"
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
