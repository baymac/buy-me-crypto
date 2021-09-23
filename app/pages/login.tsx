import React from 'react';
import UserLogin from '../components/UserLogin/UserLogin';
import {providers,signIn,getSession,csrfToken} from "next-auth/client"
import cn from 'classnames';
import styles from '../styles/pageStyles/login.module.css'
export default function Login({providers}) {

  // const providerProp = Object.values(providers).map((provider)=>{
  //     return (
  //       <div className= {cn(styles.input_box)} key={provider.name}>
  //         <button onClick={() => signIn(provider.id)}>
  //             Sign in with {provider.name}
  //         </button>
  //       </div>
  //     );
  // })

  return <UserLogin providers={providers}/>;
}



// const login = ({providers}) => {
//     return (
//         <div>
//             {Object.values(providers).map((provider) => {
//                 return (
//                 <div key={provider.name}>
//                     <button onClick={() => signIn(provider.id)}>
//                     Sign in with {provider.name}
//                     </button>
//                 </div>
//                 );
//             })}
//         </div>
//     )
// }

// export default login

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });
  
    if (session) {
      return {
        redirect: { destination: "/home" },
      };
    }
  
    return {
      props: {
        providers: await providers(),
        csrfToken: await csrfToken(context),
      },
    };
  }