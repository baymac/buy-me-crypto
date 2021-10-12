import Form from '../FormGenerator/FormGenerator';
import { useState, createElement, useEffect } from 'react';
import { IFormInputField } from '../DashboardForms/DashboardForms';
import { useForm } from 'react-hook-form';
import fetchJson from '../../lib/fetchJson';
import inputStyles from '../FormGenerator/FormGenerator.module.css';
import cn from 'classnames';
import { UilMinusCircle, UilPlus } from '@iconscout/react-unicons';
import { useSnackbar } from '../../context/SnackbarContextProvider';

const pageInfoForm: IFormInputField[] = [
  {
    label: 'Page name',
    isRequired: true,
    type: 'text',
    registerName: 'pageName',
    isInput: true,
  },
  {
    label: 'Page Headline',
    isRequired: true,
    type: 'text',
    registerName: 'pageHeadline',
    isInput: true,
  },
  {
    label: 'About the Page',
    isRequired: true,
    type: 'text',
    registerName: 'aboutPage',
    isInput: false,
  },
  {
    label: 'Solana Address',
    isRequired: true,
    type: 'text',
    registerName: 'solanaAddress',
    isInput: true,
  },
];

const intialSocialUrlList: IFormInputField[] = [
  {
    label: 'Youtube',
    isRequired: false,
    type: 'text',
    registerName: 'youtube',
    isInput: true,
  },
  {
    label: 'Twitch',
    isRequired: false,
    type: 'text',
    registerName: 'twitch',
    isInput: true,
  },
  {
    label: 'Twitter',
    isRequired: false,
    type: 'text',
    registerName: 'twitter',
    isInput: true,
  },
  {
    label: 'Instagram',
    isRequired: false,
    type: 'text',
    registerName: 'instagram',
    isInput: true,
  },
  {
    label: 'Personal Blog',
    isRequired: false,
    type: 'text',
    registerName: 'personalBlog',
    isInput: true,
  },
];

export default function CreatorPageInfoForm({ initialData, userId }) {
  const {
    register,
    handleSubmit,
    unregister,
    setValue,
    formState: { errors },
  } = useForm();

  const [addSocialUrl, setAddSocialUrl] = useState<boolean>(false);
  const [socialUrlList, setSocialUrlList] =
    useState<IFormInputField[]>(intialSocialUrlList);
  const [socialAddedList, setSocialAddedList] = useState<IFormInputField[]>([]);
  const [subLoading, setSubLoading] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleOnSubmitCreator = async (data) => {
    console.log(data);
    setSubLoading(true);
    data['userId'] = userId;

    const resData = await fetchJson('/api/pageInfo/update', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    enqueueSnackbar({ message: resData.message });
    setSubLoading(false);
  };

  const handleSocialUrlClick = (e) => {
    e.preventDefault();
    setAddSocialUrl(true);
  };

  const handleSocialDropdownChange = (e) => {
    const selectedSocial: IFormInputField = socialUrlList.find(
      (social) => social.label === e.target.value
    );
    setSocialAddedList([...socialAddedList, selectedSocial]);
    setSocialUrlList(
      socialUrlList.filter((url) => url.label !== e.target.value)
    );
    setAddSocialUrl(false);
  };

  const handleMinusDropdown = (e) => {
    e.preventDefault();
    setAddSocialUrl(false);
  };

  const isEmpty = (str: string): boolean => {
    return !str || str.length === 0;
  };

  const handleMinusSocialInput = (e, social: IFormInputField) => {
    e.preventDefault();
    unregister(social.registerName);
    setSocialAddedList(
      socialAddedList.filter((url) => url.registerName !== social.registerName)
    );
    setSocialUrlList([...socialUrlList, social]);
  };

  useEffect(() => {
    const arr: IFormInputField[] = [];
    for (let x in initialData.data.links) {
      if (
        !isEmpty(initialData.data.links[x]) &&
        socialUrlList.some((social) => social.registerName === x)
      ) {
        const presentSocial: IFormInputField = socialUrlList.find(
          (social) => social.registerName === x
        );
        arr.push(presentSocial);
      }
    }
    setSocialAddedList([...socialAddedList, ...arr]);
    setSocialUrlList(
      socialUrlList.filter(
        (url) => !arr.some((ele) => ele.registerName === url.registerName)
      )
    );
    arr.forEach((url) => {
      setValue(url.registerName, initialData.data.links[url.registerName]);
    });
  }, [initialData]);

  return (
    <>
      <Form
        formInfo={pageInfoForm}
        handleOnSubmit={handleOnSubmitCreator}
        handleSubmit={handleSubmit}
        register={register}
        errors={errors}
        submitBtnText={'Publish Page'}
        initialData={initialData}
        setValue={setValue}
        subLoading={subLoading}
        isDisabled={false}
      >
        <>
          {socialAddedList.length >= 1 && (
            <div>
              {socialAddedList.map((social) => {
                return (
                  <div
                    id={social.label}
                    key={social.label}
                    className={inputStyles.inputBox}
                  >
                    <label
                      className={inputStyles.inputBox__label}
                    >{`${social.label}`}</label>
                    <div className={cn(inputStyles.inputMinusBox__wrapper)}>
                      <input
                        type={'text'}
                        className={inputStyles.inputBox__wrapper__input}
                        {...register(social.registerName, {
                          required: false,
                        })}
                      />
                      <button
                        onClick={(e) => handleMinusSocialInput(e, social)}
                        className={cn(inputStyles.inputMinusBtn)}
                      >
                        {createElement(
                          UilMinusCircle,
                          {
                            width: 24,
                            height: 24,
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
                      return (
                        <option key={url.registerName}>{url.label}</option>
                      );
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
                  className={cn(inputStyles.inputMinusBtn)}
                >
                  {createElement(
                    UilMinusCircle,
                    {
                      width: 24,
                      height: 24,
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
              <span>Add Link</span>
            </button>
          )}
        </>
      </Form>
    </>
  );
}
