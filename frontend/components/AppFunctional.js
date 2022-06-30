import React, { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at


export default function AppFunctional(props) {
  
  const [state, setState] = useState({
    currentMoves: 0,
    currentGrid: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    message: '',
    email: '',
    currentIndex: 4,
    error: '',
    left: 'left',
    right: 'right',
    up: 'up',
    down: 'down',
  })
  
  const URL = `http://localhost:9000/api/result`

  const initialState = {
    ...state,
    message: initialMessage,
    email: initialEmail,
    currentMoves: initialSteps,
    currentIndex: initialIndex,
  }

  const getXY = () => {
    const columns = 3
    const rows = 3
    const squares = state.currentIndex
    const x = squares % rows + 1
    const y = Math.floor(squares / columns + 1)
    return [x, y]
  }

  const getXYMessage = () => {
    const position = getXY()
    return `${position[0]} , ${position[1]}`
    // return /\(position[0].*position[1]\)$/
  }

  const reset = () => {
    setState(initialState)
  }

  const getNextIndex = (direction) => {
    const left = state.left
    const right = state.right
    const up = state.up
    const down = state.down
    const index = state.currentIndex
    const newMove = state.currentMoves
    const position = getXY()
    const xPosition = position[0]
    const yPosition = position[1]

    if (direction === left && xPosition > 1) {
      return setState({
        ...state,
        currentIndex: index - 1,
        currentMoves: newMove + 1,
        message: '',
      })
    } else if (direction === left && xPosition === 1) {
      return setState({
        ...state,
        currentIndex: index,
        message: `You can't go ${direction}`
      })
    } if (direction === right && xPosition < 3) {
      return setState({
        ...state,
        currentIndex: index + 1,
        currentMoves: newMove + 1,
        message: '',
      })
    } else if (direction === right && xPosition === 3) {
      return setState({
        ...state,
        currentIndex: index,
        message: `You can't go ${direction}`,
      })
    } if (direction === up && yPosition > 1) {
      return setState({
        ...state,
        currentIndex: index - 3,
        currentMoves: newMove + 1,
        message: '',
      })
    } else if (direction === up && yPosition === 1) {
      return setState({
        ...state,
        currentIndex: index,
        message: `You can't go ${direction}`
      })
    } if (direction === down && yPosition < 3) {
      return setState({
        ...state,
        currentIndex: index + 3,
        currentMoves: newMove + 1,
        message: '',
      })
    } else if (direction === down && yPosition === 3) {
      return setState({
        ...state,
        currentIndex: index,
        message: `You can't go ${direction}`
      })
    }
  }

  const move = (evt) => {
    const left = state.left
    const right = state.right
    const up = state.up
    const down = state.down
    if (evt === left) {
      return getNextIndex(left)
    } if (evt === right) {
      return getNextIndex(right)
    } if (evt === up) {
      return getNextIndex(up)
    } if (evt === down) {
      return getNextIndex(down)
    }
  }

  const onChange = (evt) => {
    // You will need this to update the value of the input.
    const newEmail = evt.target.value
    setState({ ...state, email: newEmail });
  }

  const onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    const submitCoords = getXY()
    const x = submitCoords[0]
    const y = submitCoords[1]
    const steps = state.currentMoves
    const email = state.email
    axios.post(URL, { x: x, y: y, steps: steps, email: email })
      .then(res => {
        return setState({ ...state, message: res.data.message, email: initialEmail })
      })
      .catch(err => {
        return setState({ ...state, message: err.response.data.message })
      })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
          <h3 id="coordinates">Coordinates ({getXYMessage()})</h3>
          {
            (state.currentMoves === 1) ? <h3 id="steps">You moved {state.currentMoves} time</h3>
              : <h3 id="steps">You moved {state.currentMoves} times</h3>
          }
        </div>
        <div id="grid">
          {
            state.currentGrid.map(idx => (
              <div key={idx} className={`square${idx === state.currentIndex ? ' active' : ''}`}>
                {idx === state.currentIndex ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{state.message}</h3>
        </div>
        <div id="keypad">
          <button onClick={() => move(state.left)} id="left">LEFT</button>
          <button onClick={() => move(state.up)} id="up">UP</button>
          <button onClick={() => move(state.right)} id="right">RIGHT</button>
          <button onClick={() => move(state.down)} id="down">DOWN</button>
          <button id="reset" onClick={reset}>reset</button>
        </div>
        <form>
          <input value={state.email} onChange={onChange} id="email" type="email" placeholder="type email"></input>
          <input onClick={onSubmit} id="submit" type="submit"></input>
        </form>
    </div>
  )
}