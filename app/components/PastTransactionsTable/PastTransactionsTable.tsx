import cn from 'classnames';
import tableStyles from '../ActiveSubscriptionsTable/ActiveSubscriptionsTable.module.css';
import { useEffect, useState } from 'react';
import { rawListeners } from 'process';
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


const PastTransactionTable = ({
  activeSubscriptions,
  oneTimeTransactions,
  userLevel,
}) => {
  const [transactionsArr, setTransactionsArr] =
    useState<Array<ITableRowContent> | null>(null);

  const [tableHeadings, setTableHeadings ] = useState<Array<string>>([])

  useEffect(() => {
    let arr : ITableRowContent[] = [];
    if (oneTimeTransactions) {
      for (let i =0 ; i< oneTimeTransactions.length ; i++) {
        arr.push({
          serialNo : i +1,
          type: 'One Time',
          amount: oneTimeTransactions[i].amount,
          benefactorName:
            userLevel === 1
              ? oneTimeTransactions[i].creator
              : oneTimeTransactions[i].fan,
        });
      }
    }
    setTransactionsArr(arr);

    if(userLevel ===1){
      setTableHeadings(FanTableHeadings)
    }
    else{
      setTableHeadings(CreatorTableHeadings)
    }
  }, [activeSubscriptions, oneTimeTransactions,userLevel]);

  if (transactionsArr === null || transactionsArr.length === 0) {
    return (
      <div className={tableStyles.wrapper}>
        <h2 className={tableStyles.tableName}>No Past Transactions</h2>
      </div>
    );
  }

  return (
    <div className={tableStyles.wrapper}>
      <Table contentArr={transactionsArr} tableName={'Past Transaction'} tableHeadings={tableHeadings} />
    </div>
  );
};

export default PastTransactionTable;
