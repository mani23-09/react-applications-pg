import axios from "axios";
import { use, useEffect, useState } from "react"

export function Currency(){
    const [Amount,setAmount]=useState(0);
    const [FromCurrency,setFromCurrency]=useState('USD');
    const [ToCurrency,setToCurrency]=useState('EUR');
    const [Currencies,setCurrencies]=useState([]);
    const [ConvertAmount,setConvertAmount]=useState(null);
    const [ExchangeRate,setExchangeRate]=useState(null);
    useEffect(()=>{
        axios.get('https://api.exchangerate-api.com/v4/latest/USD')
        .then(
            res=>{
                setCurrencies(Object.keys(res.data.rates));
                setExchangeRate((res.data.rates[ToCurrency]));
                setConvertAmount((Amount * res.data.rates[ToCurrency]).toFixed(2))
            }
        ).catch(
            err=>{
                console.log(err);
            }
        )
    },[ToCurrency])
    useEffect(()=>{
        if(ExchangeRate!==null){
            setConvertAmount((Amount*ExchangeRate).toFixed(2));
        }
    },[Amount,ExchangeRate])
    return(
        <div>
            <h1>CurrencyConvertor</h1>
            <input type="number" value={Amount} onChange={(e)=>setAmount(e.target.value)}/>
            <select value={FromCurrency} onChange={(e)=>setFromCurrency(e.target.value)}>
               {
                    Currencies.map(
                        (Currency)=>(
                            <option value={Currency} key={Currency}>{Currency}</option>
                        )
                    )
               }
            </select>
            <select value={ToCurrency} onChange={(e)=>setToCurrency(e.target.value)}>
                {
                    Currencies.map(
                        (Currency)=>(
                            <option value={Currency} key={Currency}>{Currency}</option>
                        )
                    )
                }
            </select>
            {Amount}{FromCurrency} is {ConvertAmount}{ToCurrency}
        </div>
    )
}