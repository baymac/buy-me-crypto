import cn from 'classnames';
import tableStyles from './ActiveSubscriptionsTable.module.css';
import { useEffect, useState } from 'react';
import Table, { ITableRowContent } from '../TableGenerator/TableGenerator'
const FanTableHeadings = [
  'Sl.No',
  'Creator',
  'Type',
  'Amount',
]

const CreatorTableHeadings = [
  'Sl.No',
  'Creator',
  'Type',
  'Amount',
]


const ActiveSubscriptionTable = ({ activeSubscriptions, userLevel }) => {
  let [subscriptionArr, setSubscriptionArr] = useState<Array<ITableRowContent> | null> (null)
  let [tableHeadings,setTableHeadings] = useState<Array<string> | null> (null)
  useEffect(() => {
    let arr : ITableRowContent[] = [];
    if (activeSubscriptions) {
      for (let i =0 ; i< activeSubscriptions.length ; i++) {
        arr.push({
          serialNo : i +1,
          start: activeSubscriptions.start,
          amount: activeSubscriptions[i].rate,
          benefactorName:
            userLevel === 1
              ? activeSubscriptions[i].creator
              : activeSubscriptions[i].fan,
        });
      }
    }
    setSubscriptionArr(arr);

    if(userLevel ===1){
      setTableHeadings(FanTableHeadings)
    }
    else{
      setTableHeadings(CreatorTableHeadings)
    }
  }, [activeSubscriptions,userLevel]);

  if (subscriptionArr === null || subscriptionArr.length === 0) {
    return (
      <div className={tableStyles.wrapper}>
        <h2 className={tableStyles.tableName}>No Active Subscriptions</h2>
      </div>
    );
  }

  return (
    <div className={tableStyles.wrapper}>
      {activeSubscriptions && (
        <>
          <Table tableName={'Active Subscriptions'} contentArr={subscriptionArr} tableHeadings={tableHeadings} />
        </>
      )}
      {!activeSubscriptions && <h2>No Active Subscriptions</h2>}
    </div>
  );
};

export default ActiveSubscriptionTable;
