import { useState, useRef, createElement } from 'react';
import { UilArrowRight } from '@iconscout/react-unicons';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { useSnackbar } from '../../context/SnackbarContextProvider';
import fetchJson from '../../lib/fetchJson';
import ButtonLoading from '../ButtonLoading/ButtonLoading';
import styles from './GettingStarted.module.css';

const GettingStarted = () => {
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const inputRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const handleInputFocus = () => {
    setInputFocus(true);
  };
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleInputBlur = () => {
    if (inputRef.current.innerHTML == '') {
      setInputFocus(false);
    }
  };

  const handleStartMyPageSubmit = async () => {
    let pageName = inputRef.current.innerHTML;
    if (pageName == '') {
      enqueueSnackbar({
        message: 'Cannot submit without name',
      });
    } else {
      //check with database if that name is taken
      setBtnLoading(true);
      const body = {
        username: pageName,
      };
      const resData = await fetchJson('/api/user/get', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (resData.data) {
        enqueueSnackbar({
          message: 'Page Name is taken',
        });
        setBtnLoading(false);
      } else {
        localStorage.setItem('pageName', pageName);
        router.push('/login');
      }
    }
  };

  return (
    <div className={styles.getStarted}>
      <div className={styles.getStarted__inpWrapper}>
        <div className={styles.getStarted__inpWrapper__url}>
          buymecryp.to/c/
        </div>
        <div
          ref={inputRef}
          className={cn(styles.getStarted__inpWrapper__inp, {
            [styles.inputFocused]: inputFocus,
          })}
          contentEditable="true"
          onFocus={() => handleInputFocus()}
          onBlur={() => handleInputBlur()}
        ></div>
      </div>

      <div className={styles.getStarted__btnWrapper}>
        <button onClick={() => handleStartMyPageSubmit()}>
          {btnLoading ? (
            <ButtonLoading />
          ) : (
            <>
              <span>Start my page</span>
              {createElement(
                UilArrowRight,
                {
                  id: 'right-arrow-icon',
                  width: 28,
                  height: 28,
                },
                null
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GettingStarted;
