import cn from 'classnames'
import tableStyles from './ActiveSubscriptionsTable.module.css'
import {useEffect} from 'react'


const ActiveSubscriptionTable = ({
    activeSubscriptions,
    userLevel
})=>{
    return (
        <div className={tableStyles.wrapper}>
            {activeSubscriptions && ( 
                <>
                    <h2 className={tableStyles.tableName}>Active Subscriptions</h2>
                    <table className={tableStyles.table}>
                        <thead>
                            <tr className={tableStyles.tableRow}>
                                <th className={tableStyles.tableHeading}>Sl.No</th>
                                <th className={tableStyles.tableHeading}>{userLevel === 1 ? 'Creator' : 'Fan'}</th>
                                <th className={tableStyles.tableHeading}>Start</th>
                                <th className={tableStyles.tableHeading}>Rate</th>
                            </tr>
                        </thead> 
                        
                            <tbody>
                                {activeSubscriptions.map((sub,index)=>{
                                    return (
                                        <tr>
                                            <td className={tableStyles.tableEle}>{index +1}</td>
                                            <td className={tableStyles.tableEle}>{userLevel === 1 ? sub.creator : sub.fan}</td>
                                            <td className={tableStyles.tableEle}>{sub.start}</td>
                                            <td className={tableStyles.tableEle}>{sub.rate}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                    </table>
                </>
            )}
            {!activeSubscriptions && (
                <h2>No Active Subscriptions</h2>
            )}
        </div>
    )
}

export default ActiveSubscriptionTable