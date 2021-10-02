import firebase from '../firebase/clientApp'
 
const db = firebase.firestore();


export default async function addUserMetaData(userId,userLevel){
    try{
        const metaData = await db
                    .collection('userMetaData')
                    .doc(userId)
                    .get()
                    .then((querySnapshot) => {
                        if(!querySnapshot.exists)
                        {
                            return null;
                        }
                        return {...querySnapshot.data()}
                    })
        
        if(!metaData) {
            const result = await db 
                    .collection('userMetaData')
                    .doc(userId)
                    .set({
                        userLevel : userLevel,
                        profileCompleted : false
                    })
            
            return { 
                error: false,
                message : "userMetaData Created Successfully"
            }
        }
        else {
            return {
                error : true,
                message : "user Meta Data already exits"
            }
        }

    }
    catch(error){
        return {
            error: true,
            message: " Some error occured while fetching metaData " + error.message
        }
    }
}