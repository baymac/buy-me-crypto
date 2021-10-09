import { useEffect, useState } from 'react';
import cn from 'classnames';
import tableStyles from './TableGenerator.module.css';

export interface ITableColumn {
  heading: string;
  minWidth: number;
  maxWidth: number;
  registerName: string;
}

export interface ITableRowContent {
  benefactorName: string;
  type?: string;
  amount: number;
  serialNo: number;
  start: string;
}

export interface ITableGeneratorProps {
  tableName: string;
  tableHeadings: ITableColumn[];
  contentArr: ITableRowContent[];
}

const TableGenerator = ({
  tableName,
  tableHeadings,
  contentArr,
}: ITableGeneratorProps) => {
  return (
    <div className={tableStyles.wrapper}>
      <h2 className={tableStyles.tableName}>{tableName}</h2>
      {/* <div className={tableStyles.tableContainer}> */}
      <table className={tableStyles.table}>
        <thead className={tableStyles.tableHeader}>
          <tr className={tableStyles.tableRow}>
            {tableHeadings.map((col) => {
              return (
                <th
                  key={col.heading}
                  style={{ minWidth: col.minWidth, maxWidth: col.maxWidth }}
                  className={cn(tableStyles.tableHeading, tableStyles.tableEle)}
                >
                  {col.heading}
                </th>
              );
            })}
          </tr>
        </thead>
        {contentArr && (
          <tbody className={tableStyles.tableBody}>
            {contentArr.map((sub, index) => {
              return (
                <tr key={index} className={tableStyles.tableRow}>
                  {tableHeadings.map((col) => {
                    return (
                      <td
                        style={{
                          minWidth: col.minWidth,
                          maxWidth: col.maxWidth,
                        }}
                        className={tableStyles.tableEle}
                      >
                        {sub[col.registerName]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
      {/* </div> */}
    </div>
  );
};

export default TableGenerator;
