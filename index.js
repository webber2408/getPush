if('serviceWorker' in navigator){
    console.log("Service worker present")
    window.addEventListener('load',async ()=>{
        //register the service worker
        await window.Notification.requestPermission()
        await navigator.serviceWorker.register('service.js')
            .then(()=>{
                console.log("Service worker registered!")
            })
            .catch(err=>{
                console.log("Error in registering service worker => "+err)
            })
    })
}else{
    console.log("Service worker not present")
}

//check for push manager
if(!"PushManager" in window){
    console.log("Push manager not present")
}else{
    console.log("Push manager present")
}




