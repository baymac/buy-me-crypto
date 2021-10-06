import firebase from '../firebase/clientApp';


const db = firebase.firestore();

export interface IGetUserRequest {
    username : string
}


//Having problem when declaring return types as Promise<IGetcreatorMetaDataResponse>
export default async function getCreatorInfo( { username} : IGetUserRequest) {
  try {
    const user = await db
      .collection('users')
      .where('username', '==' , username)
      .get()
      .then((docSnaphostArr) =>{
        let data = null
        docSnaphostArr.forEach((doc) =>{
          data = doc.data()
          data.id = doc.id
        })
        return data
      })


    if (user) {
      return {
        error: false,
        data: user,
        message: 'creator metaData found',
      };
    } else {
      return {
        error: true,
        data: null,
        message: 'meta Data not found',
      };
    }
  } catch (error) {
    return {
      error: true,
      data: null,
      message: ' Some error occured while fetching metaData ' + error.message,
    };
  }
}