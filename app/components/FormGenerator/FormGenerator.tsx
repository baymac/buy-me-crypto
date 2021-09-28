import React from 'react'
import {FormInputField } from '../DashboardForms/DashboardForms'
import styles from './FormGenerator.module.css'
import { useForm } from "react-hook-form"

const FromGenerator = ( {formInfo , handleOnSubmit}  ) => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
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
                {/* <input type='text' placeholder='hello' {...register('hello')} /> */}
                <input type='submit' />
            </form>
        </div>
    )
}

export default FromGenerator
