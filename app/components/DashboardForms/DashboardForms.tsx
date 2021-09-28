import React,{useState,createElement,useRef,createRef} from 'react'
import styles from '../DashboardForms/DashboardForms.module.css'
import Form from '../FormGenerator/FormGenerator'
import InputList from '../InputList/InputList'

export interface IFormInputField {
    label: string;
    isRequired : boolean;
    type: string;
    isInput : boolean;
    registerName : string;
}

const handleOnSubmit = (data) =>{
    console.log(data);
}

const pageInfoForm : IFormInputField[] = [
    {
        label : "Page name",
        isRequired : true,
        type : 'text',
        registerName : 'pageName',
        isInput: true
    },
    {
        label : "What are you creating",
        isRequired : true,
        type : 'text',
        registerName : 'creating',
        isInput: true
    },
    {
        label : "Page Headline",
        isRequired : true,
        type : 'text',
        registerName : 'headline',
        isInput: true
    },        
    {
        label: "About the Page",
        isRequired: true,
        type: 'text',
        registerName : 'about',
        isInput : false
    }
]


const DashboardForms = () => {

    return (
        <div className={styles.Container} >
            <Form formInfo={pageInfoForm} handleOnSubmit={handleOnSubmit} />
        </div>
    )
}

export default DashboardForms