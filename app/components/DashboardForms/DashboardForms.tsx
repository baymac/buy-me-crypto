import { UilMinus, UilPlus } from '@iconscout/react-unicons';
import cn from 'classnames';
import React, { createElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../DashboardForms/DashboardForms.module.css';
import Form from '../FormGenerator/FormGenerator';
import inputStyles from '../FormGenerator/FormGenerator.module.css';

export interface IFormInputField {
  label: string;
  isRequired: boolean;
  type: string;
  isInput: boolean;
  registerName: string;
}

const pageInfoForm: IFormInputField[] = [
  {
    label: 'Page name',
    isRequired: true,
    type: 'text',
    registerName: 'pageName',
    isInput: true,
  },
  {
    label: 'What are you creating',
    isRequired: true,
    type: 'text',
    registerName: 'creating',
    isInput: true,
  },
  {
    label: 'Page Headline',
    isRequired: true,
    type: 'text',
    registerName: 'headline',
    isInput: true,
  },
  {
    label: 'About the Page',
    isRequired: true,
    type: 'text',
    registerName: 'about',
    isInput: false,
  },
];

const DashboardForms = () => {
  const {
    register,
    handleSubmit,
    unregister,
    formState: { errors },
  } = useForm();

  const handleOnSubmit = async (data) => {
    console.log(data);
  };

  const [addSocialUrl, setAddSocialUrl] = useState<boolean>(false);
  const [socialUrlList, setSocialUrlList] = useState<string[]>([
    'Youtube',
    'Twitch',
    'Instagram',
    'Twitter',
    'Personal Blog',
  ]);
  const [socialAddedList, setSocialAddedList] = useState<string[]>([]);

  const handleSocialUrlClick = (e) => {
    e.preventDefault();
    setAddSocialUrl(true);
  };

  const handleSocialDropdownChange = (e) => {
    setSocialAddedList([...socialAddedList, e.target.value]);
    setSocialUrlList(socialUrlList.filter((url) => url !== e.target.value));
    setAddSocialUrl(false);
  };

  const handleMinusDropdown = (e) => {
    e.preventDefault();
    setAddSocialUrl(false);
  };

  const handleMinusSocialInput = (e, social: string) => {
    e.preventDefault();
    unregister(social);
    setSocialAddedList(socialAddedList.filter((url) => url !== social));
    setSocialUrlList([...socialUrlList, social]);
  };

  return (
    <div className={styles.Container}>
      <Form
        formInfo={pageInfoForm}
        handleOnSubmit={handleOnSubmit}
        handleSubmit={handleSubmit}
        register={register}
        errors={errors}
        submitBtnText={'Save Options'}
      >
        {socialAddedList.length >= 1 && (
          <div>
            {socialAddedList.map((social) => {
              return (
                <div id={social} key={social} className={inputStyles.inputBox}>
                  <label
                    className={inputStyles.inputBox__label}
                  >{`${social} URL`}</label>
                  <div className={cn(inputStyles.inputMinusBox__wrapper)}>
                    <input
                      type={'text'}
                      className={inputStyles.inputBox__wrapper__input}
                      {...register(social, { required: false })}
                    />
                    <button
                      onClick={(e) => handleMinusSocialInput(e, social)}
                      className={cn(inputStyles.btn, inputStyles.inputMinusBtn)}
                    >
                      {createElement(
                        UilMinus,
                        {
                          width: 28,
                          height: 28,
                        },
                        null
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {addSocialUrl && (
          <div className={inputStyles.inputBox}>
            {addSocialUrl && (
              <div className={inputStyles.socialDropdown__wrapper}>
                <select
                  className={inputStyles.socialDropdown}
                  onChange={handleSocialDropdownChange}
                >
                  <option> Select </option>
                  {socialUrlList.map((url) => {
                    return <option>{url}</option>;
                  })}
                </select>
              </div>
            )}
            <div className={inputStyles.inputMinusBox__wrapper}>
              <input
                disabled
                type={'text'}
                className={inputStyles.inputBox__wrapper__input}
              />
              <button
                onClick={handleMinusDropdown}
                className={cn(inputStyles.btn, inputStyles.inputMinusBtn)}
              >
                {createElement(
                  UilMinus,
                  {
                    width: 28,
                    height: 28,
                  },
                  null
                )}
              </button>
            </div>
          </div>
        )}

        {!addSocialUrl && socialUrlList.length > 0 && (
          <button
            onClick={handleSocialUrlClick}
            className={cn(inputStyles.btn, inputStyles.socialBtn)}
          >
            {createElement(
              UilPlus,
              {
                width: 28,
                height: 28,
              },
              null
            )}
            <span>Add Social URLs</span>
          </button>
        )}
      </Form>
    </div>
  );
};

export default DashboardForms;
