import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EmployeeSalary() {
  const [data, setData] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        const response = await axios.get(`http://localhost:7654/res?id=${sessionStorage.getItem('userID')}`);
        setData(response.data);  
      } catch (error) {
        setError('Error fetching data');  // Set error message if the request fails
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);  // Set loading to false after request completes
      }
    };

    fetchData();
  }, []);  // Empty dependency array ensures this effect runs once when the component mounts

  // Salary calculation functions
  const calculateGrossPay = (basicPay, hra, da) => {
    return basicPay + hra + da;  // Gross pay is base salary plus HRA and DA
  };

  const calculateDeductions = (it, lic, pf) => {
    return it + lic + pf;  // Total deductions
  };

  const calculateNetPay = (grossPay, deductions) => {
    return grossPay - deductions;  // Net pay is gross pay minus deductions
  };

  if (loading) {
    return <p>Loading...</p>;  // Display loading text while waiting for the data
  }

  if (error) {
    return <p>{error}</p>;  // Display error message if there was an error
  }

  return (
    <div>
      {data.length > 0 ? (
        data.map((item, index) => {
          const grossPay = calculateGrossPay(item.basicpay, item.hra, item.da);  // Calculate gross pay
          const deductions = calculateDeductions(item.it, item.lic, item.pf);  // Calculate deductions
          const netPay = calculateNetPay(grossPay, deductions);  // Calculate net pay

          return (
            <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
              <h2>Employee Salary Details</h2>
              <p>Employee ID: {item.empid}</p>
              <p>Name: {item.empname}</p>
              <p>Base Salary: ₹{item.basicpay.toFixed(2)}</p>
              <p>HRA: ₹{item.hra.toFixed(2)}</p>
              <p>DA: ₹{item.da.toFixed(2)}</p>
              <p>Income Tax: ₹{item.it.toFixed(2)}</p>
              <p>LIC: ₹{item.lic.toFixed(2)}</p>
              <p>Provident Fund: ₹{item.pf.toFixed(2)}</p>
              <p>Gross Pay: ₹{grossPay.toFixed(2)}</p>
              <p>Deductions: ₹{deductions.toFixed(2)}</p>
              <p>Net Pay: ₹{netPay.toFixed(2)}</p> {/* Display net pay with ₹ symbol */}
            </div>
          );
        })
      ) : (
        <p>No data available</p>  
      )}
    </div>
  );
}