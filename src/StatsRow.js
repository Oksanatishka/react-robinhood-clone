import React from "react";
import StockChart from './stock.svg'
// import StockChart2 from './stock2.svg'
import StockChart2 from './negStock.svg'
import {db} from './firebase'

function StatsRow(props) {
    //   console.log(props, "what is in props here?");
    // (currentPrice - openPrice)/openPrice
    const percentage = ((props.price - props.openPrice)/props.openPrice) * 100;

    // const getModal = () => { }

    const buyStock = () => {
        // console.log('buy', props.name)
        db.collection('myStocks')
            .where('ticker', '==', props.name)
            .get()
            .then((querySnapshot) => {
                if(!querySnapshot.empty){
                    // update the record
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        db.collection('myStocks')
                            .doc(doc.id)
                            .update({
                                shares: doc.data().shares+=1
                            })
                        console.log(doc.id, " => ", doc.data());
                    });
                } else {
                    // add a new record
                    // console.log('Not available')
                    db.collection('myStocks')
                        .add({
                            ticker: props.name,
                            shares:1
                        })
                }
            })
    }

    return (
        <div className="row" onClick={buyStock}>
            <div className="row__intro">
                {/* <h1>APPL</h1>
                <p>200 shares</p> */}
                <h1>{props?.name}</h1>
                <p>{props.volume && (props.volume + " shares")}</p>
            </div>
            <div className="row__chart">
                <img src={percentage<0 ? StockChart2 : StockChart} height={16} alt=''/>
            </div>
            <div className="row__numbers">
                <p className="row__price">{props.price}</p>
                {/* <p>{percentage}</p> */}
                <p className={percentage<0 ? 'row__percentage_red' : 'row__percentage'}> {Number(percentage).toFixed(2)}%</p>
            </div>
        </div>
    );
}

export default StatsRow;