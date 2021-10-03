import { UilMinusCircle, UilPlus } from '@iconscout/react-unicons';
import cn from 'classnames';
import React, { createElement, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../DashboardForms/DashboardForms.module.css';
import Form from '../FormGenerator/FormGenerator';
import inputStyles from '../FormGenerator/FormGenerator.module.css';
import fetchJson from '../../lib/fetchJson';
import { useSession } from 'next-auth/client';
import PieLoading from '../PieLoading/PieLoading'
import rootStyles from '../../styles/root.module.css'
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

const DashboardForms = () => {
  const {
    register,
    handleSubmit,
    unregister,
    setValue,
    formState: { errors },
  } = useForm();

  const [session,loading]  = useSession();
  const [initialData, setInitialData ] = useState(null)
  const [addSocialUrl, setAddSocialUrl] = useState<boolean>(false);
  const [socialUrlList, setSocialUrlList] = useState<string[]>([
    'Youtube',
    'Twitch',
    'Instagram',
    'Twitter',
    'Personal Blog',
  ]);

  const [socialAddedList, setSocialAddedList] = useState<string[]>([]);


  useEffect(() => {

    const body = {
      userId : session.user.id
    }

   fetchJson('/api/getPageInfo',{
      method : "POST",
      body :   JSON.stringify(body),
      headers : {
        'Content-Type': 'application/json'
      }
    })
    .then((data)=>{
      setInitialData(data);
      console.log(data)
      const arr = []
      for( let x in data.pageInfo.Links){
        if( !isEmpty(data.pageInfo.Links[x]) && socialUrlList.includes(capitalizeFirstLetter(x))){
          arr.push(capitalizeFirstLetter(x))          
        }
      }
      setSocialAddedList(arr)
      setSocialUrlList(socialUrlList.filter((url) => !arr.includes(url)) )
      return {arr,data};
    })
    .then(({arr,data})=>{
      arr.forEach(url => {
        console.log(data.pageInfo.Links[url.toLowerCase()])
        setValue(url.toLowerCase(),data.pageInfo.Links[url.toLowerCase()])
      });
    })
                  
  },[session])



  const handleOnSubmit = async (data) => {

    console.log(data)
    data['userId'] = session.user.id;

    const resData = await fetchJson('/api/updatePageInfo',{
      method : "POST",
      body :   JSON.stringify(data),
      headers : {
        'Content-Type': 'application/json'
      }
    })
    
  };

////////////////////////////////////////////////////////////////
  function capitalizeFirstLetter(string) : string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // const addToSocialUrlList = (socialUrl) => {
  //   setSocialAddedList([...socialAddedList, socialUrl]);
  //   setSocialUrlList(socialUrlList.filter((url) => url.toLowerCase() !== socialUrl));
  // }

  const isEmpty = (str : string) : boolean =>{
    return (!str || str.length ===0)
  }
////////////////////////////////////////////////////////////////

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

  if ((loading || !session) || !initialData) {
    return (
      <div className={rootStyles.absolute_center}>
        <PieLoading></PieLoading>
      </div>
    );
  }
  else {
    return (
        <div className={styles.container}>
          <Form
            formInfo={pageInfoForm}
            handleOnSubmit={handleOnSubmit}
            handleSubmit={handleSubmit}
            register={register}
            errors={errors}
            submitBtnText={'Publish Page'}
            initialData = {initialData}
            setValue = {setValue}
          >
            <>
              {socialAddedList.length >= 1 && (
                <div>
                  {socialAddedList.map((social) => {
                    return (
                      <div
                        id={social}
                        key={social}
                        className={inputStyles.inputBox}
                      >
                        <label
                          className={inputStyles.inputBox__label}
                        >{`${social}`}</label>
                        <div className={cn(inputStyles.inputMinusBox__wrapper)}>
                          <input
                            type={'text'}
                            className={inputStyles.inputBox__wrapper__input}
                            {...register(social.toLowerCase(), { required: false })}
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
                          return <option key={url}>{url}</option>;
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
}

export default DashboardForms;
