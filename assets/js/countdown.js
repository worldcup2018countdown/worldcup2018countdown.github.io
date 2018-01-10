function startCountdownTo(deadlineTime){

    const timerParts = [
        {
            n: "days",
            d: document.getElementById('cntdwn-days-figure'),
            p: 24*60*60,
            c: 'rotate-z'
        },{
            n: "hours-tens",
            d: document.getElementById('cntdwn-hour-tens'),
            p: 600*60, // not really!!
            c: 'rotate-x'
        },{
            n: "hours-ones",
            d: document.getElementById('cntdwn-hour-ones'),
            p: 60*60,
            c: 'rotate-x'
        },{
            n: "mins-tens",
            d: document.getElementById('cntdwn-min-tens'),
            p: 600,
            c: 'rotate-x'
        },{
            n: "mins-ones",
            d: document.getElementById('cntdwn-min-ones'),
            p: 60,
            c: 'rotate-x'
        },{
            n: "secs-tens",
            d: document.getElementById('cntdwn-sec-tens'),
            p: 10,
            c: 'rotate-z'
        },{
            n: "secs-ones",
            d: document.getElementById('cntdwn-sec-ones'),
            p: 1,
            c: 'magnify-n-rotate'
        }
    ]

    const nowTime = new Date().getTime();
    let secsToDeadline = Math.floor((deadlineTime - nowTime)/1000);

    function getTimeLeft(seconds){
        function flo(x){return Math.floor(x);}
        const days = flo(seconds/(24*60*60));
        const hours = flo((seconds%(24*60*60))/(60*60));
        const mins = flo((seconds%(60*60))/(60));
        const secs = flo(seconds%60);

        const timeArr = [];
        timeArr.push(String(days));
        const hms = {hours, mins, secs};
        Object.values(hms).forEach(n => {
            const s = twoFigString(n);
            s.split("").forEach(l => timeArr.push(l));
        })
        return timeArr;
    }

    function twoFigString(num){
        let str = String(num);
        return num < 10 ? '0'+str : str;
    }

    function changeTimeElts (timeLeftArr){
        timeLeftArr.forEach( (item, index) => {
            timerParts[index].d.textContent = item;
        })
    }

    const initialTimeLeft = getTimeLeft(secsToDeadline);
    changeTimeElts(initialTimeLeft);

    setInterval(function() {
        if(secsToDeadline <= 0) {
            document.querySelector(".counter-area").classList.add("show-end");
            return;
        }

        secsToDeadline--;
        const secsOffset = secsToDeadline+1;
        // secsToDeadline = Math.floor((newYearTime - new Date().getTime())/1000);

        const timeLeft = getTimeLeft(secsToDeadline);
        changeTimeElts(timeLeft);

        timerParts.forEach(pt => {
            let trigger = secsOffset%pt.p == 0;
            if(pt.n == "hours-tens"){
                trigger = ((secsOffset/3600) %24)%10 == 0;
            }
            if(trigger) {pt.d.classList.toggle(pt.c);}
        });

    }, 1000);
}