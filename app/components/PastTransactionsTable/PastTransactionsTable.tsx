import cn from 'classnames'
import tableStyles from '../ActiveSubscriptionsTable/ActiveSubscriptionsTable.module.css'
import {useEffect,useState} from 'react'
import { rawListeners } from 'process'

export interface ITransactions {
    benefactor : string ;
    type : string ;
    amount : number;
}

const PastTransactionTable = ({
    activeSubscriptions,
    oneTimeTransactions,
    userLevel
})=>{

    const [transactionsArr, setTransactionsArr ] = useState<Array<ITransactions> | null>(null)

    useEffect(()=>{
        let arr = []
        if(oneTimeTransactions){
            for(let i  in oneTimeTransactions){
                arr.push({
                    type : 'One Time',
                    amount : oneTimeTransactions[i].amount,
                    benefactor : userLevel === 1 ? oneTimeTransactions[i].creator : oneTimeTransactions[i].fan
                })
            }
        }
        setTransactionsArr(arr)
    },[activeSubscriptions,oneTimeTransactions])

    if(transactionsArr === null || transactionsArr.length === 0){
        return (
            <div className={tableStyles.wrapper}>
                <h2 className={tableStyles.tableName}>No Past Transactions</h2>
            </div>
        )
    }
    
    return (
        <div className={tableStyles.wrapper}>
            <h2 className={tableStyles.tableName}>Past Transaction</h2>
            <table className={tableStyles.table}>
                <thead>
                    <tr className={tableStyles.tableRow}>
                        <th className={tableStyles.tableEle}>Sl.No</th>
                        <th className={tableStyles.tableEle}>{userLevel === 1 ? 'Creator' : 'Fan'}</th>
                        <th className={tableStyles.tableEle}>Type</th>
                        <th className={tableStyles.tableEle}>Amount</th>
                    </tr>
                </thead> 
                {transactionsArr && (
                    <tbody>
                        {transactionsArr.map((sub,index)=>{
                            return (
                                <tr>
                                    <td className={tableStyles.tableEle}>{index +1}</td>
                                    <td className={tableStyles.tableEle}>{sub.benefactor}</td>
                                    <td className={tableStyles.tableEle}>{sub.type}</td>
                                    <td className={tableStyles.tableEle}>{sub.amount}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                )}
            </table>
        </div>
    )
}

export default PastTransactionTable