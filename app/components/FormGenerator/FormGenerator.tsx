import React,{createElement, useState} from 'react'
import {FormInputField } from '../DashboardForms/DashboardForms'
import styles from './FormGenerator.module.css'
import { useForm } from "react-hook-form"
import {UilPlus} from '@iconscout/react-unicons';
import cn from 'classnames'

const FromGenerator = ( {formInfo , handleOnSubmit}  ) => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [addSocialUrl, setAddSocialUrl] = useState<boolean>(false);
    const [socialUrlList, setSocialUrlList] = useState<string[]>(["Youtube","Twitch","Instagram","Twitter","Personal Blog"]);
    const [socialAddedList, setSocialAddedList ] = useState<string[]>([])

    const handleSocialUrlClick =(e)=>{
        e.preventDefault();
        setAddSocialUrl(true)
    }

    const handleSocialDropdownChange = (e)=>{
        setSocialAddedList([...socialAddedList,e.target.value])
        setSocialUrlList(socialUrlList.filter(url => url != e.target.value))
        setAddSocialUrl(false);
    }

    return (
        <div className={styles.formWrapper}>
            <form onSubmit={handleSubmit(handleOnSubmit)} >
                {formInfo && formInfo.map((input,index) => {
                    
                    if(!input.isInput){
                        return(
                            <div key={index} className={styles.textBox}>
                                <label className={styles.textBox__label}>{input.label}</label>
                                <div className={styles.textBox__wrapper}>
                                    <p className={styles.textBox__wrapper__error}>{errors[input.registerName]?.type === 'required' && `${input.label} is required !` }</p>
                                    <textarea className={styles.textBox__wrapper__input} {...register(input.registerName, {required : input.isRequired})} />
                                </div>
                            </div>  
                        )
                    }

                    return (
                        <div key={index} className={styles.inputBox}>
                            <label className={styles.inputBox__label}>{input.label}</label>
                            <div className={styles.inputBox__wrapper}>
                                <input type={input.type} className={styles.inputBox__wrapper__input} {...register(input.registerName, {required : input.isRequired})} />
                                <p className={styles.inputBox__wrapper__error}>{errors[input.registerName]?.type === 'required' && `${input.label} is required !` }</p>
                            </div>
                        </div>    
                    )
                })}
                {socialAddedList.length >= 1 && (
                    <div>
                        {socialAddedList.map((social)=>{
                            return(
                                <div key={social} className={styles.inputBox}>
                                    <label className={styles.inputBox__label}>{`${social} URL`}</label>
                                    <div className={styles.inputBox__wrapper}>
                                        <input type={'text'} className={styles.inputBox__wrapper__input} {...register(social, {required : false})} />
                                        <p className={styles.inputBox__wrapper__error}>{errors[social] && errors }</p>
                                    </div>
                                </div> 
                            )
                        })}
                    </div>
                )}
                <div>
                    {addSocialUrl && (
                        <select className={styles.socialDropdown} onChange={handleSocialDropdownChange}>
                            <option> Select </option>
                            {socialUrlList.map((url)=>{
                                return(
                                    <option>{url}</option>
                                )
                            })}
                        </select>
                    )}
                </div>
                {!addSocialUrl && socialUrlList.length >0 && (
                    <button onClick={handleSocialUrlClick} className={cn(styles.btn,styles.socialBtn)}>
                        {createElement(
                            UilPlus,
                            {
                                width:28,
                                height:28
                            },
                            null
                        )}
                        <span>Add Social URLs</span>
                    </button>
                )}
                <button className={cn(styles.btn)}>
                        <span>Save Options</span>
                </button>
            </form>
        </div>
    )
}

export default FromGenerator
