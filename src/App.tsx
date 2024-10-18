import {useCallback, useEffect, useState} from "react"
import words from "./wordList.json"
import './App.css'
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";


function getWord() {
  return words[Math.floor(Math.random()*words.length)] // set the word to guess a random word from wordList.json
}
function App() {
  const [wordToGuess, setWordtoGuess] = useState(getWord());

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter))


  const isLoser = incorrectLetters.length >= 6
  const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter))


  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isLoser || isWinner) return
    setGuessedLetters(currentLetters => [...currentLetters, letter])
  }, [guessedLetters, isWinner, isLoser])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      if (!key.match(/^[a-z]$/)) {// regex
        return
      } 

      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])


  // if the enter key is pressed, restart
  useEffect(()=> {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (key != "Enter") return

      e.preventDefault()
      setWordtoGuess(getWord())
      setGuessedLetters([])
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [])

  console.log(wordToGuess)
  return (
    <div className="main">
      <div className="resultText">
        {isWinner && "Winner! - Refresh to try again" }
        {isLoser && "Nice Try! - Refresh to try again" }
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length}/>
      <HangmanWord reveal={isLoser}guessedLetters={guessedLetters} wordToGuess = {wordToGuess} />
      <div style={{alignSelf: "stretch"}}>
        <Keyboard  disabled={isWinner || isLoser}
          activeLetters= {guessedLetters.filter(letter => wordToGuess.includes(letter))}
          inactiveLetters= {incorrectLetters}
          addGuessedLetter= {addGuessedLetter}/>
      </div>
    </div>
  )
}

export default App
