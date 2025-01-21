import React from "react"
import Die from "./Die"
import Timer from "./Timer"
import Confetti from "react-confetti"
import {nanoid} from "nanoid"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [numberOfRolls, setNumberOfRolls] = React.useState(0)
    const [rollsHighScore, setRollsHighScore] = React.useState(()=>{
        const savedHighScore = JSON.parse(localStorage.getItem("rollsHighScore"))
        return savedHighScore || 1000
    })
    
    
    React.useEffect(() => {
        let checkWinningArray=[]
        dice.map(die =>{
            if(die.isHeld === true){
                checkWinningArray.push(die.value)
            }
            if(checkWinningArray.length ===10){
                const sameNumbers = checkWinningArray.every(value => value === checkWinningArray[0])
                if(sameNumbers){
                    return setTenzies(true)
                }
            }
        })
    }
    ,[dice])

    
    React.useEffect(()=>{
            if(tenzies && numberOfRolls<rollsHighScore)
                {
                    setRollsHighScore(numberOfRolls)
                }

        localStorage.setItem("rollsHighScore", JSON.stringify(rollsHighScore))
    },[numberOfRolls,tenzies])
    
   
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    
    function rollDice() {
        if(!tenzies){
            setNumberOfRolls(prevRoll => prevRoll+=1)
            setDice(oldDice => oldDice.map(die => {
            return die.isHeld ? 
                die :
                generateNewDie()
        }))
        }
        else{
            setTenzies(false)
            setNumberOfRolls(0)
            setDice(allNewDice())
            
        }
        
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    
    
    
    return (
        <main>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className="scores">
                <p className="number-of-rolls">Number of Rolls: {numberOfRolls}</p>
                <p className="number-of-rolls-highscore"><b>Number of Rolls highscore: </b>{rollsHighScore<1000? rollsHighScore : ''}</p>
                <Timer tenzies={tenzies} numberOfRolls={numberOfRolls}/>
            </div>
            <button 
            className="roll-dice" 
            onClick={rollDice}>{tenzies? "New Game" : "Roll"}</button>
            {tenzies && <Confetti />}
            
                
            
        </main>
    )
}

