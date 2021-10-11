import cn from 'classnames';
import tableStyles from './ActiveSubscriptionsTable.module.css';
import { useEffect, useState } from 'react';
import Table, { ITableRowContent } from '../TableGenerator/TableGenerator';
import { ITableColumn } from '../TableGenerator/TableGenerator';
const FanTableColumns: ITableColumn[] = [
  {
    heading: 'Sl.No',
    minWidth: 65,
    maxWidth: 70,
    registerName: 'serialNo',
    width: '10%',
  },
  {
    heading: 'Creator',
    minWidth: 172,
    maxWidth: 230,
    registerName: 'benefactorName',
    width: '25%',
  },
  {
    heading: 'Type',
    minWidth: 172,
    maxWidth: 210,
    registerName: 'type',
    width: '25%',
  },
  {
    heading: 'Created At',
    minWidth: 172,
    maxWidth: 230,
    registerName: 'start',
    width: '25%',
  },
  {
    heading: 'Amount',
    minWidth: 172,
    maxWidth: 210,
    registerName: 'amount',
    width: '25%',
  },
];

const CreatorTableColumns: ITableColumn[] = [
  {
    heading: 'Sl.No',
    minWidth: 65,
    maxWidth: 70,
    registerName: 'serialNo',
    width: '10%',
  },
  {
    heading: 'Creator',
    minWidth: 172,
    maxWidth: 230,
    registerName: 'benefactorName',
    width: '25%',
  },
  {
    heading: 'Type',
    minWidth: 172,
    maxWidth: 210,
    registerName: 'type',
    width: '25%',
  },
  {
    heading: 'Created At',
    minWidth: 172,
    maxWidth: 230,
    registerName: 'start',
    width: '25%',
  },
  {
    heading: 'Amount',
    minWidth: 172,
    maxWidth: 210,
    registerName: 'amount',
    width: '25%',
  },
];

const ActiveSubscriptionTable = ({ activeSubscriptions, userLevel }) => {
  let [subscriptionArr, setSubscriptionArr] =
    useState<Array<ITableRowContent> | null>(null);
  let [tableHeadings, setTableHeadings] = useState<Array<ITableColumn> | null>(
    null
  );
  useEffect(() => {
    let arr: ITableRowContent[] = [];
    if (activeSubscriptions) {
      for (let i = 0; i < activeSubscriptions.length; i++) {
        arr.push({
          serialNo: i + 1,
          createdAt: activeSubscriptions.createdAt,
          amount: activeSubscriptions[i].rate,
          benefactorName:
            userLevel === 1
              ? activeSubscriptions[i].creator
              : activeSubscriptions[i].fan,
          txnId: activeSubscriptions[i].txnId,
        });
      }
    }
    setSubscriptionArr(arr);

    if (userLevel === 1) {
      setTableHeadings(FanTableColumns);
    } else {
      setTableHeadings(CreatorTableColumns);
    }
  }, [activeSubscriptions, userLevel]);

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
          <Table
            tableName={'Active Subscriptions'}
            data={subscriptionArr}
            tableHeadings={tableHeadings}
          />
        </>
      )}
      {!activeSubscriptions && <h2>No Active Subscriptions</h2>}
    </div>
  );
};

export default ActiveSubscriptionTable;
