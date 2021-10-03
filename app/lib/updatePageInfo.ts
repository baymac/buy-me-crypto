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

            console.log('updation done')

            const updatedPageInfo = await db
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
            
            console.log('update pageInfo')
            console.log(updatedPageInfo)

            let profileCompleted : boolean = true;
        
            for(let x in updatedPageInfo){
                console.log(x)

                if(!updatedPageInfo[x] || updatedPageInfo[x].length === 0){
                    profileCompleted = false
                }
            }


            if(profileCompleted){
                console.log('second loop running')
                for(let x in updatedPageInfo.Links){
                    if(!updatedPageInfo || updatedPageInfo.Links[x].length === 0){
                        console.log(x)
                        profileCompleted = false
                    }
                }
            }


            if(profileCompleted){
                await db.collection('userMetaData')
                .doc(userId)
                .update({
                    profileCompleted: true,
                })
                .then(()=>{
                    console.log('profile status changed')
                })
                .catch((error)=>{
                    console.log('eror' + error.message)
                })
            }

            return {
                error: false,
                message: 'Page Info updated successfully'
            }
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