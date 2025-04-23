import axios from "axios";
import { useEffect, useState } from "react";

export function Convert(){
    var value=0;
    const [Amount,setAmount]=useState(1);
    const [fromCurrency,setFromCurrency]=useState('USD');
    const [toCurrency,setToCurrency]=useState('EUR');
    const [Currencies,setCurrencies]=useState([]);
    const [ExchangeRate,setExchangeRate]=useState(null);
    const [ConvertAmount,setConvertAmount]=useState(null);
    useEffect(()=>{
        axios.get("https://api.exchangerate-api.com/v4/latest/USD")
        .then(res=>{
            setCurrencies(Object.keys(res.data.rates));
            setConvertAmount((Amount * res.data.rates[toCurrency]).toFixed(2))
            setExchangeRate(res.data.rates[toCurrency])
        }).catch(
            error=>{
                console.error(error);
            }
        )
    },[toCurrency]);
    useEffect(()=>{
        if(ExchangeRate!=null){
            setConvertAmount((Amount * ExchangeRate).toFixed(2))
        }
    },[Amount,ExchangeRate]
    )
    return(
        <div>
           <input type="number" value={Amount} onChange={(e)=>setAmount(e.target.value)} />
            <select value={fromCurrency} onChange={(e)=>setFromCurrency(e.target.value)}>
                {
                    Currencies.map((currency)=>(
                        <option  key={currency} value={currency}>{currency}</option>
                    ))
                }
            </select> 
            
           <select value={toCurrency} onChange={(e)=>setToCurrency(e.target.value)}>
                {
                    Currencies.map((currency)=>(
                        <option key={currency} value={currency}>{currency}</option>
                    ))
                }
            </select> 
           
            {ConvertAmount != null && (
          <p>
            {Amount} {fromCurrency} is equal to {ConvertAmount} {toCurrency}
          </p>
        )}
        </div>
    )
}