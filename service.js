console.log("Hello from service worker!")

self.addEventListener('activate',async ()=>{
    try{
        const applicationServerKey = urlB64ToUint8Array('BOtb1CkJo8dPzn7yLyObZeyU5rMibx6Pyj_WlJ2TPNbDx_Hw6XCM2ttwU89uvFaWp2sbanOmJhOCBe0uLoTeoj8')
        var options={
            applicationServerKey,
            userVisibleOnly:true
        }
        await self.registration.pushManager.subscribe(options)
            .then(async subscription =>{
                const response= await saveSubscription(subscription)
                console.log(response)
            })
    }catch(err){
        console.log('Error:',err)
    }
})  

const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4))% 4)
    const base64 = (base64String + padding).replace(/\-/g,'+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}


//post request to save subscription to the backend application server
const saveSubscription =  async subscription => {
    const SERVER_URL = 'http://localhost:4000/save-subscription'
    const response = await fetch(
        SERVER_URL,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(subscription)
        }
    )
    return response.json()
}

//to listen to push events
self.addEventListener('push',(event)=>{
    if(event.data){
        console.log("Push event!! ", event.data.text())
        event.waitUntil(
            showLocalNotification("You are lucky", event.data.text(),self.registration)
        )        
    }else{
        console.log('No data in push event received!')
    }
})


//notification popup
const showLocalNotification = (title, body, swRegistration) =>{
    const options = {
        body,
        icon:"images/bell.png",
        tag:"request",
        actions:[
            {
                action:"Yes",
                title:"Why not?",
                icon:"images/yes.png"
            },
            {
                action:"No",
                title:"Nah! I have lot more!",
                icon:"images/no.png"
            }
        ]
    }
    return swRegistration.showNotification(title, options)
}


