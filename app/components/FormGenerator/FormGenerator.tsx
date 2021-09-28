import React,{createElement, useState} from 'react'
import {IFormInputField } from '../DashboardForms/DashboardForms'
import styles from './FormGenerator.module.css'
import { useForm } from "react-hook-form"
import {UilPlus, UilMinus} from '@iconscout/react-unicons';
import cn from 'classnames'

interface IFormGeneratorProps {
    formInfo : IFormInputField[],
    handleOnSubmit : any
}

const FromGenerator = ( {formInfo , handleOnSubmit} : IFormGeneratorProps  ) => {

    const { register, handleSubmit,unregister, watch, formState: { errors } } = useForm();
    const [addSocialUrl, setAddSocialUrl] = useState<boolean>(false);
    const [socialUrlList, setSocialUrlList] = useState<string[]>(["Youtube","Twitch","Instagram","Twitter","Personal Blog"]);
    const [socialAddedList, setSocialAddedList ] = useState<string[]>([])


    const handleSocialUrlClick =(e)=>{
        e.preventDefault();
        setAddSocialUrl(true)
    }

    const handleSocialDropdownChange = (e)=>{
        setSocialAddedList([...socialAddedList,e.target.value])
        setSocialUrlList(socialUrlList.filter(url => url !== e.target.value))
        setAddSocialUrl(false);
    }

    const handleMinusDropdown = (e) => {
        e.preventDefault()
        setAddSocialUrl(false)
    }

    const handleMinusSocialInput = (e , social : string) => {
        e.preventDefault();
        unregister(social);
        setSocialAddedList(socialAddedList.filter(url => url !== social))
        setSocialUrlList([...socialUrlList,social])
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

                {(socialAddedList.length >= 1) && (
                    <div>
                        {socialAddedList.map((social)=>{
                            return(
                                <div id={social} key={social} className={styles.inputBox}>
                                    <label className={styles.inputBox__label}>{`${social} URL`}</label>
                                    <div className={cn(styles.inputMinusBox__wrapper)}>
                                        <input type={'text'} className={styles.inputBox__wrapper__input} {...register(social, {required : false})} />
                                        <button onClick={(e)=>handleMinusSocialInput(e,social)} className={cn(styles.btn,styles.inputMinusBtn)}>
                                            {createElement(
                                                UilMinus,
                                                {
                                                    width:28,
                                                    height:28
                                                },
                                                null
                                            )}
                                        </button>
                                    </div>

                                </div> 
                            )
                        })}
                    </div>
                )}

                {addSocialUrl && (
                    <div className={styles.inputBox}>
                        {addSocialUrl && (
                            <div className={styles.socialDropdown__wrapper}>
                                <select className={styles.socialDropdown} onChange={handleSocialDropdownChange}>
                                    <option> Select </option>
                                    {socialUrlList.map((url)=>{
                                        return(
                                            <option>{url}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        )}
                        <div className={styles.inputMinusBox__wrapper}>
                            <input disabled type={'text'} className={styles.inputBox__wrapper__input}  />
                            <button onClick={handleMinusDropdown} className={cn(styles.btn,styles.inputMinusBtn)}>
                                        {createElement(
                                            UilMinus,
                                            {
                                                width:28,
                                                height:28
                                            },
                                            null
                                        )}
                            </button>
                        </div>
                    </div> 
                )}

                
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
