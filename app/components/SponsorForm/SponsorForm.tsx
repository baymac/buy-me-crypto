import cn from 'classnames';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../../context/SnackbarContextProvider';
import {
  ICreateCheckoutParams,
  ICreateCheckoutResponse,
} from '../../lib/checkout/createCheckoutSession';
import fetcher from '../../lib/fetcher';
import Form from '../FormGenerator/FormGenerator';
import formStyles from '../FormGenerator/FormGenerator.module.css';
import styles from './sponsorform.module.css';

const SponsorForm = ({ creatorName, creatorId, fanId, isDisabled }) => {
  const {
    register,
    handleSubmit,
    unregister,
    setValue,
    formState: { errors },
  } = useForm();

  const [isSubscriptionPayment, setIsSubscriptionPayment] =
    useState<boolean>(false);
  const [sponsorLoading, setSponsorLoading] = useState<boolean>(false);

  const handleTypeChange = (e) => {
    if (e.target.value === 'subscription') {
      setIsSubscriptionPayment(true);
    } else {
      setIsSubscriptionPayment(false);
    }
  };

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleOnSubmit = async (data) => {
    setSponsorLoading(true);
    const { amount: amt, note } = data;

    const res = await fetcher<ICreateCheckoutParams, ICreateCheckoutResponse>(
      '/api/checkout/createSession',
      {
        amt,
        note,
        creator: creatorId,
        fan: fanId,
        type: isSubscriptionPayment ? 'subscription' : 'onetime',
      }
    );

    enqueueSnackbar({ message: res.message, options: { duration: 5000 } });

    if (!res.error) {
      router.push(`/checkout/${res.data.sessionId}`);
    }
    setSponsorLoading(false);
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
        isDisabled={isDisabled}
        subLoading={sponsorLoading}
      >
        <h2 className={styles.heading}>{`Sponsor ${creatorName}`}</h2>
        <div className={styles.wrapper__radioBox}>
          <span>
            <input
              type="radio"
              value="onetime"
              id="onetime"
              name="donationType"
              checked={!isSubscriptionPayment}
              onChange={handleTypeChange}
              disabled={isDisabled}
            />
            <label htmlFor="onetime" className={styles.radio_label}>
              One Time
            </label>
          </span>
          <span>
            <input
              type="radio"
              value="subscription"
              id="subscription"
              name="donationType"
              disabled
              checked={isSubscriptionPayment}
              onChange={handleTypeChange}
            />
            <label htmlFor="subscription" className={styles.radio_label}>
              Subscription
            </label>
          </span>
        </div>
        <div className={formStyles.inputBox}>
          <div
            className={cn(
              formStyles.inputBox__wrapper,
              styles.inputBox__wrapper
            )}
          >
            <input
              disabled={isDisabled}
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
          <label className={formStyles.inputBox__label}>
            {isSubscriptionPayment ? 'Lamports/s' : 'Lamports'}
          </label>
        </div>
        <div className={formStyles.textBox}>
          <label className={formStyles.textBox__label}>Note</label>
          <div className={formStyles.textBox__wrapper}>
            <textarea
              className={formStyles.textBox__wrapper__input}
              {...register('note', {
                required: false,
              })}
              disabled={isDisabled}
              placeholder={`Any message for ${creatorName}`}
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default SponsorForm;
