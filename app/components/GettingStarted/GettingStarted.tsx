import styles from './GettingStarted.module.css';
import { useState, useRef, createElement } from 'react';
import { UilArrowRight } from '@iconscout/react-unicons';
import cn from 'classnames';

const GettingStarted = () => {
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const inputRef = useRef(null);

  const handleInputFocus = () => {
    setInputFocus(true);
  };

  const handleInputBlur = () => {
    if (inputRef.current.innerHTML == '') {
      setInputFocus(false);
    }
  };

  const handleStartMyPageSubmit = () => {
    if (inputRef.current.innerHTML == '') {
      console.log('cannot submit without name');
    } else {
      //check with database if that name is taken
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
