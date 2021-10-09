import {useEffect, useState} from 'react'
import cn from 'classnames'
import tableStyles from "./TableGenerator.module.css"

export interface ITableGeneratorProps{
    tableName : string ; 
    tableHeadings : string[];
    contentArr : ITableRowContent[]
}

export interface ITableRowContent{
    benefactorName : string;
    type? : string ; 
    amount : number ;
    serialNo : number;
    start? : string;
}

const TableGenerator = ({
    tableName,
    tableHeadings,
    contentArr
} : ITableGeneratorProps ) =>{
    return (
        <>
            <h2 className={tableStyles.tableName}>{tableName}</h2>
            <table className={tableStyles.table}>
                <thead className={tableStyles.tableHeader}>
                    <tr className={tableStyles.tableRow}>
                        {tableHeadings.map((heading) =>{
                            return <th className={cn(tableStyles.tableHeading,tableStyles.tableEle)} >{heading}</th>
                        })}
                    </tr>
                </thead>
                {contentArr && (
                    <tbody className={tableStyles.tableBody}>
                        {contentArr.map((sub, index) => {
                        return (
                            <tr className={tableStyles.tableRow}>
                                <td className={tableStyles.tableEle}>{index + 1}</td>
                                <td className={tableStyles.tableEle}>{sub.benefactorName}</td>
                                <td className={tableStyles.tableEle}>{sub.type ? sub.type : sub.start}</td>
                                <td className={tableStyles.tableEle}>{sub.amount}</td>
                            </tr>
                        );
                        })}
                    </tbody>
                )}
            </table>
        </>
    )
}

export default TableGenerator