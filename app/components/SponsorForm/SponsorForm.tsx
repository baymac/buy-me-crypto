import React, { useState } from 'react';
import Form from '../FormGenerator/FormGenerator';
import formStyles from '../FormGenerator/FormGenerator.module.css';
import styles from './SponsorForm.module.css';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import fetchJson from '../../lib/fetchJson';

const SponsorForm = ({ creatorName, creatorId, fanId }) => {
  const {
    register,
    handleSubmit,
    unregister,
    setValue,
    formState: { errors },
  } = useForm();

  let [isSubscriptionPayment, setIsSubscriptionPayment] =
    useState<boolean>(true);
  const [subLoading, setSubLoading] = useState<boolean>(false);

  const handleTypeChange = (e) => {
    if (e.target.value === 'Subscription') {
      unregister('amount');
      setIsSubscriptionPayment(true);
    } else {
      unregister('rate');
      setIsSubscriptionPayment(false);
    }
  };

  const handleOnSubmit = (data) => {
    console.log(data);
    setSubLoading(true);
    let reqUrl;
    let body;
    if (isSubscriptionPayment) {
      reqUrl = '/api/addSubscription';
      body = {
        rate: data.rate,
      };
    } else {
      reqUrl = '/api/addOneTime';
      body = {
        amount: data.amount,
      };
    }

    body = {
      ...body,
      note: data.note,
      fan: fanId,
      creator: creatorId,
    };

    fetchJson(reqUrl, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setSubLoading(false);
        setValue('rate', '');
        setValue('amount', '');
        setValue('note', '');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className={styles.wrapper}>
      <Form
        handleOnSubmit={handleOnSubmit}
        handleSubmit={handleSubmit}
        register={register}
        errors={errors}
        submitBtnText={'Sponsor'}
        setValue={setValue}
        subLoading={subLoading}
      >
        <>
          <h2 className={styles.heading}>{`Sponsor ${creatorName}`}</h2>
          <div onChange={handleTypeChange} className={styles.wrapper__radioBox}>
            <span>
              <input
                type="radio"
                value="Subscription"
                name="donationType"
                defaultChecked
              />{' '}
              Subscription
            </span>
            <span>
              <input type="radio" value="One Ti" name="donationType" /> One Time
            </span>
          </div>
          <div>
            {isSubscriptionPayment && (
              <div className={formStyles.inputBox}>
                <div
                  className={cn(
                    formStyles.inputBox__wrapper,
                    styles.inputBox__wrapper
                  )}
                >
                  <input
                    type="number"
                    {...register('rate', {
                      required: true,
                    })}
                    className={cn(
                      formStyles.inputBox__wrapper__input,
                      styles.numberInput
                    )}
                  />
                </div>
                <label
                  className={formStyles.inputBox__label}
                >{`Lamport/s`}</label>
              </div>
            )}

            {!isSubscriptionPayment && (
              <div className={formStyles.inputBox}>
                <div
                  className={cn(
                    formStyles.inputBox__wrapper,
                    styles.inputBox__wrapper
                  )}
                >
                  <input
                    type="number"
                    {...register('amount', {
                      required: true,
                    })}
                    className={cn(
                      formStyles.inputBox__wrapper__input,
                      styles.numberInput
                    )}
                  />
                </div>
                <label
                  className={formStyles.inputBox__label}
                >{`Lamport`}</label>
              </div>
            )}
          </div>

          <div className={formStyles.textBox}>
            <label className={formStyles.textBox__label}>Notes</label>
            <div className={formStyles.textBox__wrapper}>
              <textarea
                className={formStyles.textBox__wrapper__input}
                {...register('note', {
                  required: false,
                })}
              />
            </div>
          </div>
        </>
      </Form>
    </div>
  );
};

export default SponsorForm;
