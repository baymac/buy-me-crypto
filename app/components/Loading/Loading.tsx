import React from 'react'
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import styles from './Loading.module.css'
import { useTheme } from 'next-themes'
function LoaderCustom() {

    const { resolvedTheme, setTheme } = useTheme();

    return (
        <div className={styles.loaderOverlay}>
            <div className={styles.loaderContainer}>
                <div className={styles.loaderWrapper}>
                    {resolvedTheme && <Loader
                        type="Bars"
                        color={resolvedTheme === 'dark' ? 'rgb(255,255,255)' : 'hsl(230, 70%, 60%)'}
                        height={100}
                        width={100}
                    //3 sec
                    />
                    }
                </div>
                <div className={styles.loaderText}>Loading</div>
            </div>
        </div>
    )
}

export default LoaderCustom
