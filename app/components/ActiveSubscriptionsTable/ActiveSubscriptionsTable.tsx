import cn from 'classnames'
import tableStyles from './ActiveSubscriptionsTable.module.css'
import {useEffect} from 'react'

const tableHeading : string[] = [
    'Sl.No',
    'Creator',
    'Start',
    "Rate"
]

const ActiveSubscriptionTable = ({
    activeSubscriptions
})=>{

    return (
        <div className={tableStyles.wrapper}>
            <h2 className={tableStyles.tableName}>Active Subscriptions</h2>
            <table className={tableStyles.table}>
                <thead>
                    <tr className={tableStyles.tableRow}>
                        {tableHeading.map((heading)=>{
                            return <th key={heading} className={tableStyles.tableEle}>{heading}</th>
                        })}
                    </tr>
                </thead> 
                <tbody>
                    {activeSubscriptions.map((sub,index)=>{
                        return (
                            <tr>
                                <td className={tableStyles.tableEle}>{index +1}</td>
                                <td className={tableStyles.tableEle}>{sub.creator}</td>
                                <td className={tableStyles.tableEle}>{sub.start}</td>
                                <td className={tableStyles.tableEle}>{sub.rate}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default ActiveSubscriptionTable