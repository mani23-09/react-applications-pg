import React from 'react';
import './App.css';
import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import CurrencyControl from './CurencyControl';
import FruitStore from './E_commarce';
import E_b from './E-b';
import ResultEb from './ResultEb';
import CRUD_EB from './CRUDeb';
import { Convert } from './Convert';
import { Currency } from './Currency';
import {  Welcome1, Welcome2, Welcome3 } from './Welcome';

function App() {
  return(
    
    <Router>
      <Routes>
        <Route path='/currencycontrol' Component={CurrencyControl}/>
        <Route path='/ecommarce' Component={FruitStore}/>
        <Route path='/eb' Component={E_b}/>
        <Route path='/reseb' Component={ResultEb}/>
        <Route path='/crudeb' Component={CRUD_EB}/>
        <Route path='/convert' Component={Convert}/>
        <Route path='/Currency' Component={Currency}/>
      </Routes>
    </Router>
  );
}

export default App;
