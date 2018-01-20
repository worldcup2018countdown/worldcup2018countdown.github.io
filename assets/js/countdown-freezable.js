class freezableCountdownTo {
    constructor(deadlineTime){
        this.deadlineTime = deadlineTime;
        this.timerParts = [
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
        ];
        this.frozen = false;
        this.init = this.countdown();
    }

    freeze(){
        this.frozen = true;
        // remove all transforms so that the letters all look uniform
        document.querySelectorAll(".time-figure").forEach(el => {
            el.className = "time-figure";
        })
    }

    unfreeze(){
        this.frozen = false;
    }

    getTimeLeft(seconds){
        function flo(x){return Math.floor(x);}
        const days = flo(seconds/(24*60*60));
        const hours = flo((seconds%(24*60*60))/(60*60));
        const mins = flo((seconds%(60*60))/(60));
        const secs = flo(seconds%60);

        const timeArr = [];
        timeArr.push(String(days));
        const hms = {hours, mins, secs};
        Object.values(hms).forEach(n => {
            const s = this.twoFigString(n);
            s.split("").forEach(l => timeArr.push(l));
        })
        return timeArr;
    }

    twoFigString(num){
        let str = String(num);
        return num < 10 ? '0'+str : str;
    }

    changeTimeElts (timeLeftArr){
        timeLeftArr.forEach( (item, index) => {
            this.timerParts[index].d.textContent = item;
        })
    }

    calcSecsToDeadline(){
        const nowTime = new Date().getTime();
        return Math.floor((this.deadlineTime - nowTime)/1000);
    }

    countdown(){

        const initialTimeLeft = this.getTimeLeft(this.calcSecsToDeadline());
        this.changeTimeElts(initialTimeLeft);
        
        const interval = setInterval(function() {
            const secsToDeadline = this.calcSecsToDeadline();
            if(secsToDeadline <= 0) {
                document.querySelector(".counter-area").classList.add("show-end");
                return;
            }

            if(this.frozen) return;

            // secsToDeadline--;
            // const secsOffset = secsToDeadline+1;
            const secsOffset = secsToDeadline;

            const timeLeft = this.getTimeLeft(secsToDeadline);
            this.changeTimeElts(timeLeft);

            this.timerParts.forEach(pt => {
                let trigger = secsOffset%pt.p == 0;
                if(pt.n == "hours-tens"){
                    trigger = ((secsOffset/3600) %24)%10 == 0;
                }
                if(trigger) {pt.d.classList.toggle(pt.c);}
            });

        }.bind(this), 1000);
    }
}