import { UilMinusCircle, UilPlus } from '@iconscout/react-unicons';
import cn from 'classnames';
import React, { createElement, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../DashboardForms/DashboardForms.module.css';
import Form from '../FormGenerator/FormGenerator';
import inputStyles from '../FormGenerator/FormGenerator.module.css';
import fetchJson from '../../lib/fetchJson';
import { useSession } from 'next-auth/client';
import PieLoading from '../PieLoading/PieLoading';
import rootStyles from '../../styles/root.module.css';
import { copyFileSync } from 'fs';

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
];

const intialSocialUrlList : IFormInputField[] = [
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

]

const DashboardForms = () => {
  const {
    register,
    handleSubmit,
    unregister,
    setValue,
    formState: { errors },
  } = useForm();

  const [session, loading] = useSession();
  const [initialData, setInitialData] = useState(null);
  const [addSocialUrl, setAddSocialUrl] = useState<boolean>(false);
  const [socialUrlList, setSocialUrlList] = useState<IFormInputField[]>(intialSocialUrlList);

  const [socialAddedList, setSocialAddedList] = useState<IFormInputField[]>([]);
  const [subLoading, setSubLoading ] = useState<boolean>(false);

  useEffect(() => {
    const body = {
      userId: session.userId,
    };

    fetchJson('/api/getPageInfo', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((pageInfo) => {
        setInitialData(pageInfo);
        const arr : IFormInputField[] = [];
        for (let x in pageInfo.data.links) {
          if (
            !isEmpty(pageInfo.data.links[x]) &&
            socialUrlList.some((social) => social.registerName === x)
          ) {
            const presentSocial : IFormInputField = socialUrlList.find((social) => social.registerName === x)
            arr.push(presentSocial);
          }
        }
        setSocialAddedList([...socialAddedList, ...arr]);
        setSocialUrlList(socialUrlList.filter((url) => !arr.some((ele)=> ele.registerName === url.registerName)));
        return { arr, pageInfo };
      })
      .then(({ arr, pageInfo }) => {
        arr.forEach((url) => {
          setValue(url.registerName, pageInfo.data.links[url.registerName]);
        });
      });
  }, [session]);

  const handleOnSubmit = async (data) => {
    console.log(data)
    setSubLoading(true)
    data['userId'] = session.userId;

    const resData = await fetchJson('/api/updatePageInfo', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if(!resData.error){
      setSubLoading(false)
    }
  };

  const isEmpty = (str: string): boolean => {
    return !str || str.length === 0;
  };

  const handleSocialUrlClick = (e) => {
    e.preventDefault();
    setAddSocialUrl(true);
  };

  const handleSocialDropdownChange = (e) => {
    const selectedSocial : IFormInputField = socialUrlList.find((social) => social.label === e.target.value)
    setSocialAddedList([...socialAddedList, selectedSocial]);
    setSocialUrlList(socialUrlList.filter((url) => url.label !== e.target.value));
    setAddSocialUrl(false);
  };

  const handleMinusDropdown = (e) => {
    e.preventDefault();
    setAddSocialUrl(false);
  };

  const handleMinusSocialInput = (e, social: IFormInputField) => {
    e.preventDefault();
    unregister(social.registerName);
    setSocialAddedList(socialAddedList.filter((url) => url.registerName !== social.registerName));
    setSocialUrlList([...socialUrlList, social]);
  };


  if (loading || !session || !initialData) {
    return (
      <div className={rootStyles.absolute_center}>
        <PieLoading></PieLoading>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <Form
          formInfo={pageInfoForm}
          handleOnSubmit={handleOnSubmit}
          handleSubmit={handleSubmit}
          register={register}
          errors={errors}
          submitBtnText={'Publish Page'}
          initialData={initialData}
          setValue={setValue}
          subLoading={subLoading}
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
                        return <option key={url.registerName}>{url.label}</option>;
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
      </div>
    );
  }
};

export default DashboardForms;
