import styles from './GettingStarted.module.css';
import { useState, useRef, createElement } from 'react';
import { UilArrowRight } from '@iconscout/react-unicons';
import cn from 'classnames';
import { useSnackbar } from '../../context/SnackbarContextProvider';
import fetchJson from '../../lib/fetchJson';
import { useRouter } from 'next/router';

const GettingStarted = () => {
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const inputRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const handleInputFocus = () => {
    setInputFocus(true);
  };
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
        options: { duration: 2000 },
      });
    } else {
      //check with database if that name is taken
      const body = {
        username: pageName,
      };
      const resData = await fetchJson('/api/getUser', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (resData.data) {
        enqueueSnackbar({
          message: 'Page Name is taken',
          options: { duration: 2000 },
        });
      } else {
        localStorage.setItem('pageName', pageName);
        router.push('/login');
      }
    }
  };

  return (
    <div className={styles.getStarted}>
      <div className={styles.getStarted__inpWrapper}>
        <div className={styles.getStarted__inpWrapper__url}>buymecryp.to/</div>
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
        </button>
      </div>
    </div>
  );
};

export default GettingStarted;
