import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Wallet = () => {
    //const [ ledger, setLedger ] = useState([])
    const [ accountId, setAccoutId ] = useState('')
    const [ balance, setBalance ] = useState(0)
    const [ transactions, setTransactions ] = useState([])


    const changeHandler = (e) => { // change to onClick 
        e.preventDefault()
        console.log('e.target.value', e.target.value)
        setAccoutId(e.target.value)
    }

    const updateId = (ledger) => {
        console.log('ledger', ledger)
        let tempTrans = []
        ledger.forEach(item => {
            tempTrans = tempTrans.concat(item.transactions)
        })
        console.log('temptrans', tempTrans)

         tempTrans = tempTrans.filter(item => {
            console.log('filter boolean', item.recipient === accountId || item.sender === accountId)
            return (item.recipient === accountId || item.sender === accountId)
        })
        console.log('tempTrans', tempTrans)
        setTransactions(tempTrans)
        
        let tempBal = 0
        tempBal = tempTrans.reduce((acc , curValue) => {
            if (curValue.recipient === accountId) {
                acc = acc + parseFloat(curValue.amount)
            }
            else if (curValue.sender === accountId) {
                acc = acc - parseFloat(curValue.amount)
            }
            return acc
        }, 0)
        console.log('temp balance', tempBal)
        setBalance(tempBal)

        
    }
    useEffect(() => {
        console.log('id', accountId)

        axios
            .get('/chain')
            .then(res => {
                console.log('GET /chain', res)
                //setTransactions([])
                let ledger = res.data.chain
                //console.log('setledger', setLedger())
                updateId(ledger)
                
            })
            .catch(err => console.log('ERROR', err))
    }, [accountId])

    return (
        <div className='wallet-wrapper'>
            <div>
            <form >
                <label>ID: </label>
                <input 
                type='text'
                onChange={changeHandler}
                >
                </input>
                <button type='submit'>Update</button>
            </form>
            </div>

            <div>
                <h2>Balance: {balance}</h2>
            </div>

            <div>
                {transactions.map(trans => (
                    <div>
                    <p>Transaction Amount: {trans.amount}</p>
                    <p>Recipient: {trans.recipient}</p>
                    <p>Sender: {trans.sender}</p>
                    </div>
                ))}
            </div>
            

        </div>
    )
}

export default Wallet;