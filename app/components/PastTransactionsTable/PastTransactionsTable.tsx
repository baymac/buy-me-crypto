import cn from 'classnames';
import tableStyles from '../ActiveSubscriptionsTable/ActiveSubscriptionsTable.module.css';
import { useEffect, useState } from 'react';
import { rawListeners } from 'process';
import Table, {
  ITableColumn,
  ITableRowContent,
} from '../TableGenerator/TableGenerator';

const FanTableHeadings = ['Sl.No', 'Creator', 'Type', 'Created At', 'Amount'];

const CreatorTableHeadings = [
  'Sl.No',
  'Creator',
  'Type',
  'Created At',
  'Amount',
];

const FanTableColums: ITableColumn[] = [
  {
    heading: 'Sl.No',
    minWidth: 65,
    maxWidth: 70,
    registerName: 'serialNo',
  },
  {
    heading: 'Creator',
    minWidth: 172,
    maxWidth: 230,
    registerName: 'benefactorName',
  },
  {
    heading: 'Type',
    minWidth: 172,
    maxWidth: 210,
    registerName: 'type',
  },
  {
    heading: 'Created At',
    minWidth: 172,
    maxWidth: 230,
    registerName: 'start',
  },
  {
    heading: 'Amount',
    minWidth: 172,
    maxWidth: 210,
    registerName: 'amount',
  },
];

const PastTransactionTable = ({
  activeSubscriptions,
  oneTimeTransactions,
  userLevel,
}) => {
  const [transactionsArr, setTransactionsArr] =
    useState<Array<ITableRowContent> | null>(null);

  const [tableHeadings, setTableHeadings] = useState<Array<string>>([]);

  useEffect(() => {
    let arr: ITableRowContent[] = [];
    if (oneTimeTransactions) {
      for (let i = 0; i < oneTimeTransactions.length; i++) {
        arr.push({
          serialNo: i + 1,
          type: 'One Time',
          amount: oneTimeTransactions[i].amount,
          start: oneTimeTransactions[i].start,
          benefactorName:
            userLevel === 1
              ? oneTimeTransactions[i].creator
              : oneTimeTransactions[i].fan,
        });
      }
    }
    setTransactionsArr(arr);

    if (userLevel === 1) {
      setTableHeadings(FanTableHeadings);
    } else {
      setTableHeadings(CreatorTableHeadings);
    }
  }, [activeSubscriptions, oneTimeTransactions, userLevel]);

  if (transactionsArr === null || transactionsArr.length === 0) {
    return (
      <div className={tableStyles.wrapper}>
        <h2 className={tableStyles.tableName}>No Past Transactions</h2>
      </div>
    );
  }

  return (
    <Table
      contentArr={transactionsArr}
      tableName={'Past Transaction'}
      tableHeadings={FanTableColums}
    />
  );
};

export default PastTransactionTable;
