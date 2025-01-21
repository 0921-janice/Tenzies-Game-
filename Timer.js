import React from "react"


export default function App(props) {
    const [time, setTime] = React.useState(0)
    const [timeRunning, setTimeRunning] = React.useState(true)
    const [timeHighScore, setTimeHighScore] = React.useState(()=>{
        const savedHighScore = JSON.parse(localStorage.getItem("timeHighScore"))
        return savedHighScore || 600000
    })

    const timer = React.useRef()

    React.useEffect(()=>{
        if(!props.tenzies){
            setTimeRunning(true)
            if(props.numberOfRolls === 0){
                setTime(0) 
                timer.current=setInterval(()=>{
                    setTime(prevTime => prevTime +1)
                },1000)
                
            }        
            
        }

        else if(props.tenzies){
            setTimeRunning(false) 

            clearInterval(timer.current)
            
        }

        return () => clearInterval(timer.current) 
    },[props.tenzies])


    React.useEffect(()=>{
            if(props.tenzies && time<timeHighScore)
                {
                    setTimeHighScore(time)
                }

        localStorage.setItem("timeHighScore", JSON.stringify(timeHighScore))
    },[time,props.tenzies,timeHighScore])

    function calculatingTime (time){
        let hours = Math.floor((time/60 /60 % 24))
        let minutes = Math.floor((time/60 % 60))
        let seconds = (time%60).toFixed(0)

        hours = hours<10 ? '0' + hours : hours
        minutes = minutes<10 ? '0' + minutes : minutes
        seconds = seconds<10 ? '0' + seconds : seconds

        return `${hours} : ${minutes} : ${seconds}`
    }
    
    

    return (<div>
        <p className="timer">Time Elapsed: {calculatingTime(time)}</p>
        <p className="timer-highscore"><b>Time Highscore:</b> {timeHighScore<600000 ? calculatingTime(timeHighScore) : ''}</p>
    </div>)
}