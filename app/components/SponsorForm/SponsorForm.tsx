import React,{useState} from 'react'
import Form from '../FormGenerator/FormGenerator'
import formStyles from '../FormGenerator/FormGenerator.module.css'
import styles from './SponsorForm.module.css'
import cn from 'classnames'
import { useForm } from 'react-hook-form';

const SponsorForm = ({creatorName}) => {

    const {
        register,
        handleSubmit,
        unregister,
        setValue,
        formState: { errors },
    } = useForm();

    let [isSubscriptionPayment, setIsSubscriptionPayment ] = useState<boolean>(true)

    const handleTypeChange = (e)=>{
      console.log('calling the function')
      console.log(e.target.value)
      if(e.target.value === 'Subscription'){
        setIsSubscriptionPayment(true)
      }
      else{
        setIsSubscriptionPayment(false)
      }
    }

    const handleOnSubmit = (data) =>{
        console.log(data)
    }

    return (
        <div className={styles.wrapper}>
            <Form 
                handleOnSubmit={handleOnSubmit}
                handleSubmit={handleSubmit}
                register={register}
                errors={errors}
                submitBtnText={'Sponsor'}
                setValue={setValue}
            >
                <>
                    <h2 className={styles.heading}>{`Sponsor ${creatorName}`}</h2>
                    <div onChange={handleTypeChange} className={styles.wrapper__radioBox }>
                        <span><input type='radio' value="Subscription" name="donationType" defaultChecked /> Subscription</span>
                        <span><input type='radio' value="One Ti" name="donationType" /> One Time</span>
                    </div>
                    <div>
                        {isSubscriptionPayment && (
                            <div className={formStyles.inputBox}>
                                    
                                <div className={cn(formStyles.inputBox__wrapper,styles.inputBox__wrapper)}>
                                    <input
                                    type='number'
                                    required
                                    className={cn(formStyles.inputBox__wrapper__input,styles.numberInput)}
                                    />
                                </div>
                                <label className={formStyles.inputBox__label}>{`Lamport/s`}</label>
                            </div>
                        )}

                        {!isSubscriptionPayment && (
                        <div className={formStyles.inputBox}>
                            <div className={cn(formStyles.inputBox__wrapper,styles.inputBox__wrapper)}>
                            <input
                                type='number'
                                required
                                className={cn(formStyles.inputBox__wrapper__input,styles.numberInput)}
                            />
                            </div>
                            <label className={formStyles.inputBox__label}>{`Lamport`}</label>
                        </div>
                        )}
                    </div>

                    <div className={formStyles.textBox}>
                        <label className={formStyles.textBox__label}>Notes</label>
                        <div className={formStyles.textBox__wrapper}>
                        <textarea
                            className={formStyles.textBox__wrapper__input}
                        />
                        </div>
                    </div>
                </>
            </Form>
        </div>
    )
}

export default SponsorForm
