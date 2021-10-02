import firebase from '../firebase/clientApp'
 
const db = firebase.firestore();

export default async function updatePageInfo (userId,body){



    try{
        const userInfo = await db
                    .collection('pageInfo')
                    .doc(userId)
                    .get()
                    .then((querySnapshot) => {
                        if(!querySnapshot.exists)
                        {
                            return null;
                        }
                        return {...querySnapshot.data()}
                    })

        if(userInfo){

            for( let  x in body.Links){
                if(body.Links[x] === "" && userInfo.Links.hasOwnProperty(x)){
                    body.Links[x] = userInfo.Links[x]
                }
            }

            const result = await db 
                        .collection('pageInfo')
                        .doc(userId)
                        .update({
                            ...body
                        })
                        .then(() =>{
                            console.log('successful')
                            return {
                                error : false,
                                message: 'user info has been updated'
                            }
                        })
                        .catch((error) => {
                            return {
                                error : true,
                                message : 'user could not be update ' + error.message
                            }
                        })

            return result
        }
        else {
            return {
                error: true,
                message : 'The user is not a creator'
            }
        }
    }
    catch(error){
        return {
            error : true,
            message : 'Some error occured ' + error.message
        }
    }
}