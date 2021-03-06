import { useEffect, useState } from 'react';
import tableStyles from '../ActiveSubscriptionsTable/ActiveSubscriptionsTable.module.css';
import Table, {
  ITableColumn,
  ITableRowContent,
} from '../TableGenerator/TableGenerator';

const FanTableColumns: ITableColumn[] = [
  {
    heading: 'Sl.No',
    minWidth: 80,
    maxWidth: 90,
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
    registerName: 'createdAt',
    width: '25%',
  },
  {
    heading: 'Amount',
    minWidth: 172,
    maxWidth: 210,
    registerName: 'amount',
    width: '25%',
  },
  {
    heading: 'TxnId',
    minWidth: 300,
    maxWidth: 300,
    registerName: 'txnId',
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
    heading: 'Fan',
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
    registerName: 'createdAt',
    width: '25%',
  },
  {
    heading: 'Amount',
    minWidth: 172,
    maxWidth: 210,
    registerName: 'amount',
    width: '25%',
  },
  {
    heading: 'TxnId',
    minWidth: 900,
    maxWidth: 900,
    registerName: 'txnId',
    width: '25%',
  },
];

const PastTransactionTable = ({
  activeSubscriptions,
  oneTimeTransactions,
  userLevel,
}) => {
  const [transactionsArr, setTransactionsArr] =
    useState<Array<ITableRowContent> | null>(null);

  const [tableHeadings, setTableHeadings] = useState<Array<ITableColumn>>([]);

  useEffect(() => {
    let arr: ITableRowContent[] = [];
    if (oneTimeTransactions) {
      for (let i = 0; i < oneTimeTransactions.length; i++) {
        arr.push({
          serialNo: i + 1,
          type: 'One Time',
          amount: oneTimeTransactions[i].amount,
          createdAt: oneTimeTransactions[i].createdAt,
          benefactorName:
            userLevel === 1
              ? oneTimeTransactions[i].creator
              : oneTimeTransactions[i].fan,
          txnId: oneTimeTransactions[i].txnId,
        });
      }
    }

    setTransactionsArr(arr);

    if (userLevel === 1) {
      setTableHeadings(FanTableColumns);
    } else {
      setTableHeadings(CreatorTableColumns);
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
      data={transactionsArr}
      tableName={'Past Transactions'}
      tableHeadings={tableHeadings}
    />
  );
};

export default PastTransactionTable;
