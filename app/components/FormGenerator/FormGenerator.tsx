import cn from 'classnames';
import React, { ReactElement } from 'react';
import { IFormInputField } from '../DashboardForms/DashboardForms';
import styles from './FormGenerator.module.css';

interface IFormGeneratorProps {
  formInfo: IFormInputField[];
  handleOnSubmit: any;
  children: ReactElement;
  handleSubmit: any;
  errors: any;
  register: any;
  submitBtnText: string;
  initialData : any;
}

const FromGenerator = ({
  formInfo,
  handleOnSubmit,
  handleSubmit,
  errors,
  register,
  submitBtnText,
  children,
  initialData
}: IFormGeneratorProps) => {
  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        
        {formInfo &&
          formInfo.map((input, index) => {

            if (!input.isInput) {
              return (
                <div key={index} className={styles.textBox}>
                  <label className={styles.textBox__label}>{input.label}</label>
                  <div className={styles.textBox__wrapper}>
                    <p className={styles.textBox__wrapper__error}>
                      {errors[input.registerName]?.type === 'required' &&
                        `${input.label} is required !`}
                    </p>
                    <textarea
                      className={styles.textBox__wrapper__input}
                      {...register(input.registerName, {
                        required: input.isRequired,
                      })}
                      value={initialData.hasOwnProperty('pageInfo') ? initialData.pageInfo[input.registerName] : " "}
                    />
                  </div>
                </div>
              );
            }

            return (
              <div key={index} className={styles.inputBox}>
                <label className={styles.inputBox__label}>{input.label}</label>
                <div className={styles.inputBox__wrapper}>
                  <input
                    type={input.type}
                    className={styles.inputBox__wrapper__input}
                    {...register(input.registerName, {
                      required: input.isRequired,
                    })}
                    value={initialData.hasOwnProperty('pageInfo') ? initialData.pageInfo[input.registerName] : " "}
                  />
                  <p className={styles.inputBox__wrapper__error}>
                    {errors[input.registerName]?.type === 'required' &&
                      `${input.label} is required !`}
                  </p>
                </div>
              </div>
            );
          })}
        {children}
        <button className={cn(styles.btn, styles.saveBtn)}>
          <span>{submitBtnText}</span>
        </button>
      </form>
    </div>
  );
};

export default FromGenerator;
