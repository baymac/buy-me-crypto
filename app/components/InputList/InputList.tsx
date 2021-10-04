import React from 'react';
import styles from '../InputList/InputList.module.css';
import FormInputField from '../DashboardForms/DashboardForms';

const InputList = ({ formInfo, register, errors }) => {
  return (
    <>
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
                />
                <p className={styles.inputBox__wrapper__error}>
                  {errors[input.registerName]?.type === 'required' &&
                    `${input.label} is required !`}
                </p>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default InputList;
