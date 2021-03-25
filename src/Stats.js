import React, { useState, useEffect } from "react";
import "./Stats.css";
// import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import StatsRow from "./StatsRow";
// import { key } from "./api";
import axios from "axios";
import { db } from "./firebase";

// key
const TOKEN = "c18prhf48v6oak5hg00g";
// url copied from sample code here https://finnhub.io/docs/api/quote
// const BASE_URL = "https://finnhub.io/api/v1/quote?symbol=";
const BASE_URL = "https://finnhub.io/api/v1/quote";
// const KEY_URL = `&token=${key}`;
// const KEY_URL = `&token=${TOKEN}`;

// used in useEffect, named to tempStocksData
// const testData = []; 

function Stats() {
    const [stocksData, setStocksData] = useState([]);
    const [myStocks, setMyStocks] = useState([]);

    const getMyStocks = () => {
        db.collection('myStocks').onSnapshot(snapshot => {
            // console.log('snapshot', snapshot)
            console.log('snapshot docs', snapshot.docs)

            let promises = [];
            let tempData = []
            snapshot.docs.map((doc) => {
                console.log('doc.data', doc.data())
                promises.push(getStocksData(doc.data().ticker).then(res => {
                    tempData.push({
                        id: doc.id,
                        data: doc.data(),
                        info: res.data
                    })
                })
            )})
            Promise.all(promises).then(()=>{
                console.log('tempData', tempData)
                setMyStocks(tempData);
            })
        })
     }

    const getStocksData = (stock) => {
        return axios
        .get(`${BASE_URL}?symbol=${stock}&token=${TOKEN}`)
        .catch((error) => {
            console.error("Error", error.message);
        });
    };

    useEffect(() => {
        let tempStocksData = [];
        const stocksList = ["AAPL", "MSFT", "TSLA", "FB", "BABA", "UBER", "DIS", "SBUX"];

        getMyStocks();
        let promises = [];
        stocksList.map((stock) => {
            promises.push(
                getStocksData(stock)
                .then((res) => {
                    // console.log('AXIOS RESPONCE', res)
                    tempStocksData.push({
                        name: stock,
                        ...res.data
                    });
                    // console.log('tempStocksData', tempStocksData)
                })
            )
        });

        Promise.all(promises).then(()=>{
            console.log(tempStocksData);
            setStocksData(tempStocksData);
        })
    }, []);

    return (
        <div className="stats">
            <div className="stats__container">
                <div className="stats__header">
                    <p> Stocks</p>
                    {/* <MoreHorizIcon /> */}
                </div>
                <div className="stats__content">
                    <div className="stats__rows">
                        {/* For our CURRENT stocks */}

                        {/* <StatsRow /> */}
                        {myStocks.map((stock) => (
                            <StatsRow
                                key={stock.data.ticker}
                                name={stock.data.ticker}
                                openPrice={stock.info.o}
                                volume={stock.data.shares}
                                price={stock.info.c}
                            />
                        ))} 
                    </div>
                </div>
                <div className="stats__header stats-lists">
                    <p>Lists</p>
                </div>
                <div className="stats__content">
                    <div className="stats__rows">
                        {/* stocks we can buy */}

                        {stocksData.map((stock) => (
                            <StatsRow
                                key={stock.name}
                                name={stock.name}
                                openPrice={stock.o}
                                price={stock.c}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Stats;