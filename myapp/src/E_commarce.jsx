import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import './ecom.css';

const FruitStore = () => {
  const [activeTab, setActiveTab] = useState("addFruits");
  const [cart, setCart] = useState([]);
  const [fruits, setFruits] = useState([
    { id: 1, name: "Apple", about: "Red and delicious", imgUrl: "apple.jpg", price: 2, quantity: 10 },
    { id: 2, name: "Banana", about: "Yellow and sweet", imgUrl: "banana.jpg", price: 1, quantity: 20 },
    { id: 3, name: "Orange", about: "Citrusy and tangy", imgUrl: "orange.jpg", price: 1.5, quantity: 15 },
  ]);
  const [newFruit, setNewFruit] = useState({ name: "", about: "", imgUrl: "", price: "", quantity: "" });
  const [openDialog, setOpenDialog] = useState(false); // Control dialog visibility
  const [selectedQuantities, setSelectedQuantities] = useState(fruits.reduce((acc, fruit) => {
    acc[fruit.id] = 1;
    return acc;
  }, {}));
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(1); // Default exchange rate for USD is 1
  
  const currencies = ["USD", "EUR", "GBP", "INR"]; // List of supported currencies

  useEffect(() => {
    const fetchExchangeRate = async () => {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
      const data = await response.json();
      const rate = data.rates[selectedCurrency] || 1; // Default to 1 if the currency is USD
      setExchangeRate(rate);
    };

    fetchExchangeRate();
  }, [selectedCurrency]);

  const handleQuantityChange = (id, value) => {
    setSelectedQuantities((prevState) => ({
      ...prevState,
      [id]: Math.max(1, Math.min(value, fruits.find(fruit => fruit.id === id).quantity)),
    }));
  };

  const handleAddToCart = (fruit) => {
    const selectedQuantity = selectedQuantities[fruit.id];

    if (selectedQuantity <= fruit.quantity) {
      const updatedFruit = { ...fruit, quantity: selectedQuantity };
      setCart([...cart, updatedFruit]);

      const updatedFruits = fruits.map((f) =>
        f.id === fruit.id ? { ...f, quantity: f.quantity - selectedQuantity } : f
      );
      setFruits(updatedFruits);
    } else {
      alert("Not enough stock available!");
    }
  };

  const handlePurchase = () => {
    alert("Redirecting to Google Pay to complete the purchase!");
  };

  const renderAddFruitsTab = () => (
    <div className="tab-content">
      <h2>Select Fruits</h2>
      <div className="fruit-list">
        {fruits.map((fruit) => (
          <div key={fruit.id} className="fruit-item">
            <img src={fruit.imgUrl} alt={fruit.name} width="50" />
            <h3>{fruit.name}</h3>
            <p>{fruit.about}</p>
            <p>Price: {selectedCurrency} ${(fruit.price * exchangeRate).toFixed(2)}</p>
            <p>Quantity: {fruit.quantity}</p>
            <TextField
              label="Quantity"
              type="number"
              value={selectedQuantities[fruit.id]}
              onChange={(e) => handleQuantityChange(fruit.id, e.target.value)}
              inputProps={{ min: 1, max: fruit.quantity }}
            />
            <Button variant="contained" onClick={() => handleAddToCart(fruit)}>Add to Cart</Button>
          </div>
        ))}
      </div>
      <Button variant="contained" onClick={() => setOpenDialog(true)}>Add New Fruit</Button>
    </div>
  );

  const renderCartTab = () => (
    <div className="tab-content">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} - {selectedCurrency} ${(item.price * exchangeRate).toFixed(2)} x {item.quantity}
            </li>
          ))}
        </ul>
      )}
      <Button variant="contained" onClick={() => setActiveTab("purchase")}>Proceed to Purchase</Button>
    </div>
  );

  const renderPurchaseTab = () => (
    <div className="tab-content">
      <h2>Purchase</h2>
      <p>Total: {selectedCurrency} ${(cart.reduce((acc, fruit) => acc + fruit.price * fruit.quantity, 0) * exchangeRate).toFixed(2)}</p>
      <Button variant="contained" onClick={handlePurchase}>Buy with Google Pay</Button>
    </div>
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  return (
    <div className="fruit-store">
      <div className="nav-tabs">
        <Button variant="contained" onClick={() => handleTabChange("addFruits")}>Add Fruits</Button>
        <Button variant="contained" onClick={() => handleTabChange("addCart")}>Show Cart</Button>
        <Button variant="contained" onClick={() => handleTabChange("purchase")}>Purchase</Button>
      </div>
      
      {/* Currency Selector */}
      <FormControl>
        <InputLabel>Currency</InputLabel>
        <Select value={selectedCurrency} onChange={handleCurrencyChange}>
          {currencies.map((currency) => (
            <MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="tab-wrapper">
        {activeTab === "addFruits" && renderAddFruitsTab()}
        {activeTab === "addCart" && renderCartTab()}
        {activeTab === "purchase" && renderPurchaseTab()}
      </div>

      {/* Dialog to Add New Fruit */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Fruit</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            const newFruitData = { ...newFruit, id: fruits.length + 1, price: parseFloat(newFruit.price), quantity: parseInt(newFruit.quantity) };
            setFruits([...fruits, newFruitData]);
            setNewFruit({ name: "", about: "", imgUrl: "", price: "", quantity: "" });
            setOpenDialog(false);
          }}>
            <TextField
              label="Fruit Name"
              fullWidth
              value={newFruit.name}
              onChange={(e) => setNewFruit({ ...newFruit, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              label="About"
              fullWidth
              value={newFruit.about}
              onChange={(e) => setNewFruit({ ...newFruit, about: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              label="Image URL"
              fullWidth
              value={newFruit.imgUrl}
              onChange={(e) => setNewFruit({ ...newFruit, imgUrl: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              label="Price"
              fullWidth
              type="number"
              value={newFruit.price}
              onChange={(e) => setNewFruit({ ...newFruit, price: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              label="Quantity"
              fullWidth
              type="number"
              value={newFruit.quantity}
              onChange={(e) => setNewFruit({ ...newFruit, quantity: e.target.value })}
              margin="normal"
              required
            />
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
              <Button type="submit" color="primary">Add Fruit</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FruitStore;
