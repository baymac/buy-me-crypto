import { useEffect, useState } from 'react';
import cn from 'classnames';
import tableStyles from './TableGenerator.module.css';

export interface ITableColumn {
  heading: string;
  minWidth: number;
  maxWidth: number;
  width: string;
  registerName: string;
}

export interface ITableRowContent {
  benefactorName: string;
  type?: string;
  amount: number;
  serialNo: number;
  createdAt: string;
}

export interface ITableGeneratorProps {
  tableName: string;
  tableHeadings: ITableColumn[];
  data: ITableRowContent[];
}

const TableGenerator = ({
  tableName,
  tableHeadings,
  data,
}: ITableGeneratorProps) => {
  return (
    <div className={tableStyles.wrapper}>
      <h2 className={tableStyles.tableName}>{tableName}</h2>
      <table className={tableStyles.table}>
        <thead className={tableStyles.tableHeader}>
          <tr className={tableStyles.tableRow}>
            {tableHeadings.map((col) => {
              return (
                <th
                  key={col.heading}
                  style={{
                    minWidth: col.minWidth,
                    maxWidth: col.maxWidth,
                    width: col.width,
                  }}
                  className={cn(tableStyles.tableHeading, tableStyles.tableEle)}
                >
                  {col.heading}
                </th>
              );
            })}
          </tr>
        </thead>
        {data && (
          <tbody className={tableStyles.tableBody}>
            {data.map((sub, index) => {
              return (
                <tr key={index} className={tableStyles.tableRow}>
                  {tableHeadings.map((col) => {
                    return (
                      <td
                        key={col.registerName}
                        style={{
                          minWidth: col.minWidth,
                          maxWidth: col.maxWidth,
                          width: col.width,
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
    </div>
  );
};

export default TableGenerator;
