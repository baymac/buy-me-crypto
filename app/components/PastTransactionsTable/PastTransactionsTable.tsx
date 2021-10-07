import cn from 'classnames'
import tableStyles from '../ActiveSubscriptionsTable/ActiveSubscriptionsTable.module.css'
import {useEffect} from 'react'

const tableHeading : string[] = [
    'Sl.No',
    'Creator',
    'Type',
    "Amount"
]

const PastTransactionTable = ()=>{

    return (
        <div className={tableStyles.wrapper}>
            <h2 className={tableStyles.tableName}>Past Transaction</h2>
            <table className={tableStyles.table}>
                <thead>
                    <tr className={tableStyles.tableRow}>
                        {tableHeading.map((heading)=>{
                            return <th className={tableStyles.tableEle}>{heading}</th>
                        })}
                    </tr>
                </thead> 
            </table>
        </div>
    )
}

export default PastTransactionTable