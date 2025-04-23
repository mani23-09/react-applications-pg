import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

export default function E_b() {
  const [userID, setUserID] = useState(""); // State to hold user input

  const handleSubmit = () => {
    if (userID) {
      // Store the userID in sessionStorage
      sessionStorage.setItem("userID", userID);
      window.location.href='/reseb'
    } else {
      alert("Please enter a User ID.");
    }
  };

  return (
    <div>
      <h2>Enter User ID</h2>
      <TextField
        label="User ID"
        value={userID}
        onChange={(e) => setUserID(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ marginTop: "10px" }}
      >
        Submit
      </Button>
    </div>
  );
}
