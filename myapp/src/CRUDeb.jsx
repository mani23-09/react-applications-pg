import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Snackbar, Alert } from '@mui/material';

const calculatePrice = (units) => {
  if (units <= 100) return 0 * units;  
  if (units > 100 && units <= 200) return 2 * units;  
  if (units > 200 && units <= 500) return 3 * units;  
  return 5 * units;  
};

const CRUD_EB = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
  const [addDialogVisible, setAddDialogVisible] = useState(false); 
  const [updatedData, setUpdatedData] = useState({
    id: '',
    name: '',
    currentunit: '',
    priviousunit: '',
  });
  const [newData, setNewData] = useState({
    id: '',
    name: '',
    currentunit: '',
    priviousunit: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:7654/read');
      setData(response.data.data);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.get(`http://localhost:7654/deleteeb?id=${id}`);
      showSnackbar("Record deleted successfully", "success");
      fetchData();
    } catch (error) {
      console.error("Error deleting the record:", error);
      showSnackbar("Error deleting the record", "error");
    }
  };

  const handleUpdate = (row) => {
    setUpdatedData({
      id: row.id,
      name: row.name,
      currentunit: row.currentunit,
      priviousunit: row.priviousunit,
    });
    setUpdateDialogVisible(true);
  };

  const handleAddData = () => {
    setNewData({
      id: '',
      name: '',
      currentunit: '',
      priviousunit: '',
    });
    setAddDialogVisible(true);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNewDataFieldChange = (e) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
// Update submission with GET request
const handleUpdateSubmit = async () => {
  try {
    const { id, name, currentunit, priviousunit } = updatedData;
    // Construct the URL with correct query parameters for the GET request
    const response = await axios.get(`http://localhost:7654/updateeb?id=${id}&name=${name}&current=${currentunit}&privious=${priviousunit}`);
  
    console.log(response.data);
    if (response.data.message) {
      showSnackbar(response.data.message, "success");
    } else {
      showSnackbar("Record updated successfully", "success");
    }
  
    fetchData();
    setUpdateDialogVisible(false);
  } catch (error) {
    console.error("Error updating the record:", error);
    showSnackbar("Error updating the record", "error");
  }
};

// Add new data submission with GET request
const handleAddDataSubmit = async () => {
  try {
    const { id, name, currentunit, priviousunit } = newData;
    // Construct the URL with correct query parameters for the GET request
    const response = await axios.get(`http://localhost:7654/inserteb?id=${id}&name=${name}&current=${currentunit}&privious=${priviousunit}`);
    
    if (response.data.message) {
      showSnackbar(response.data.message, "success");
    } else {
      showSnackbar("Record added successfully", "success");
    }

    fetchData();
    setAddDialogVisible(false); // Close the add dialog
  } catch (error) {
    console.error("Error adding the record:", error);
    showSnackbar("Error adding the record", "error");
  }
};

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Electric Bill Records</h1>

      {/* Add Data Button */}
      <Button variant="contained" color="primary" onClick={handleAddData}>Add Data</Button>

      {/* Table displaying the data */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Current Unit</th>
            <th>Previous Unit</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.currentunit}</td>
              <td>{row.priviousunit}</td>
              <td>{row.currentunit - row.priviousunit}</td>
              <td>{calculatePrice(row.currentunit - row.priviousunit)}</td>
              <td>
                <Button variant="outlined" color="primary" onClick={() => handleUpdate(row)}>Update</Button>
              </td>
              <td>
                <Button variant="outlined" color="secondary" onClick={() => handleDelete(row.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Dialog using Material-UI Dialog component */}
      <Dialog open={updateDialogVisible} onClose={() => setUpdateDialogVisible(false)}>
        <DialogTitle>Update Record</DialogTitle>
        <DialogContent>
          <TextField
            label="ID"
            name="id"
            value={updatedData.id}
            onChange={handleFieldChange}
            disabled
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name"
            name="name"
            value={updatedData.name}
            onChange={handleFieldChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Current Unit"
            name="currentunit"
            value={updatedData.currentunit}
            onChange={handleFieldChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Previous Unit"
            name="priviousunit"
            value={updatedData.priviousunit}
            onChange={handleFieldChange}
            type="number"
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateSubmit} color="primary">Update</Button>
          <Button onClick={() => setUpdateDialogVisible(false)} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Add Data Dialog using Material-UI Dialog component */}
      <Dialog open={addDialogVisible} onClose={() => setAddDialogVisible(false)}>
        <DialogTitle>Add New Record</DialogTitle>
        <DialogContent>
          <TextField
            label="ID"
            name="id"
            value={newData.id}
            onChange={handleNewDataFieldChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name"
            name="name"
            value={newData.name}
            onChange={handleNewDataFieldChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Current Unit"
            name="currentunit"
            value={newData.currentunit}
            onChange={handleNewDataFieldChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Previous Unit"
            name="priviousunit"
            value={newData.priviousunit}
            onChange={handleNewDataFieldChange}
            type="number"
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDataSubmit} color="primary">Add</Button>
          <Button onClick={() => setAddDialogVisible(false)} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Success/Error Message */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose} 
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CRUD_EB;
