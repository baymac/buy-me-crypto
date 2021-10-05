import cn from 'classnames';
import React, { ReactElement, useEffect } from 'react';
import ButtonLoading from '../ButtonLoading/ButtonLoading';
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
  initialData: any;
  setValue: any;
  subLoading : boolean;
}

const FormGenerator = ({
  formInfo,
  handleOnSubmit,
  handleSubmit,
  errors,
  register,
  submitBtnText,
  children,
  initialData,
  setValue,
  subLoading
}: IFormGeneratorProps) => {
  useEffect(() => {
    if (initialData.data) {
      setValue('pageName', initialData.data.pageName);
      setValue('pageHeadline', initialData.data.pageHeadline);
      setValue('aboutPage', initialData.data.aboutPage);
    }
  }, [initialData]);

  console.log(initialData.data.pageName)

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        {formInfo?.map((input, index) => {
          if (!input.isInput) {
            return (
              <div key={index} className={styles.textBox}>
                <label className={cn(styles.textBox__label,{
                  [styles.label_required] : input.isRequired,
                })}>{input.label}</label>
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
              <label className={cn(styles.inputBox__label,{
                [styles.label_required] : input.isRequired,
              })}>{input.label}</label>
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
        {children}
        <button className={cn(styles.btn, styles.saveBtn)} disabled={subLoading}>
          {subLoading ? <ButtonLoading /> : <span>{submitBtnText}</span>}
        </button>
      </form>
    </div>
  );
};

export default FormGenerator;
