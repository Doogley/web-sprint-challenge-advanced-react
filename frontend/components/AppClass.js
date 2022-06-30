import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  currentIndex: initialIndex,
  currentMoves: initialSteps,


}
export default class AppClass extends React.Component {
  state = {
    currentMoves: 0,
    currentGrid: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    message: '',
    email: '',
    currentIndex: 4,
    down: 'down',
    up: 'up',
    error: '',
    right: 'right',
    left: 'left',

  }

  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  getXY = () => {
    const rows = 3

    const columns = 3

    const squares = this.state.currentIndex

    const x = squares % rows + 1

    const y = Math.floor(squares / columns + 1)

    return [x, y]
  }

  // It it not necessary to have a state to track the coordinates.
  // It's enough to know what index the "B" is at, to be able to calculate them.


  getXYMessage = () => {
    const coordinates = this.getXY()

    return `${coordinates[0]} , ${coordinates[1]}`

  }

  // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
  // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
  // returns the fully constructed string.


  reset = () => {

    this.setState(initialState)

    // Use this helper to reset all states to their initial values.
  }

  getNextIndex = (direction) => {
    const left = this.state.left

    const right = this.state.right

    const up = this.state.up

    const down = this.state.down

    const index = this.state.currentIndex

    const newMove = this.state.currentMoves

    const coordinates = this.getXY()

    const xPosition = coordinates[0]

    const yPosition = coordinates[1]

    if (direction === left && xPosition > 1) {
      return this.setState({
        ...this.state,
        currentIndex: index - 1,
        currentMoves: newMove + 1,
        message: '',
      })
    } else if (direction === left && xPosition === 1) {
      return this.setState({
        ...this.state,
        currentIndex: index,
        message: `You can't go ${direction}`
      })
    } if (direction === right && xPosition < 3) {
      return this.setState({
        ...this.state,
        currentIndex: index + 1,
        currentMoves: newMove + 1,
        message: '',
      })
    } else if (direction === right && xPosition === 3) {
      return this.setState({
        ...this.state,
        currentIndex: index,
        message: `You can't go ${direction}`,
      })
    } if (direction === up && yPosition > 1) {
      return this.setState({
        ...this.state,
        currentIndex: index - 3,
        currentMoves: newMove + 1,
        message: '',
      })
    } else if (direction === up && yPosition === 1) {
      return this.setState({
        ...this.state,
        currentIndex: index,
        message: `You can't go ${direction}`
      })
    } if (direction === down && yPosition < 3) {
      return this.setState({
        ...this.state,
        currentIndex: index + 3,
        currentMoves: newMove + 1,
        message: '',
      })
    } else if (direction === down && yPosition === 3) {
      return this.setState({
        ...this.state,
        currentIndex: index,
        message: `You can't go ${direction}`
      })
    }
  }
  // This helper takes a direction ("left", "up", etc) and calculates what the next index
  // of the "B" would be. If the move is impossible because we are at the edge of the grid,
  // this helper should return the current index unchanged.

  move = (evt) => {
    const left = this.state.left

    const right = this.state.right

    const up = this.state.up

    const down = this.state.down

    if (evt === left) {
      return this.getNextIndex(left)
    } if (evt === right) {
      return this.getNextIndex(right)
    } if (evt === up) {
      return this.getNextIndex(up)
    } if (evt === down) {
      return this.getNextIndex(down)
    }
  }
  // This event handler can use the helper above to obtain a new index for the "B",

  // and change any states accordingly.


  onChange = (evt) => {

    const newEmail = evt.target.value

    this.setState({ ...this.state, email: newEmail });
  }

  onSubmit = (evt) => {


    evt.preventDefault()
    const submitCoords = this.getXY()
    const x = submitCoords[0]
    const y = submitCoords[1]
    const steps = this.state.currentMoves
    const email = this.state.email
    axios.post('http://localhost:9000/api/result', { x: x, y: y, steps: steps, email: email })
      .then(res => {
        return this.setState({ ...this.state, message: res.data.message, email: initialEmail })
      })
      .catch(err => {
        return this.setState({ ...this.state, message: err.response.data.message })
      })
  }

  render() {
    const { className } = this.props

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates ({this.getXYMessage()})</h3>
          {
            (this.state.currentMoves === 1) ? <h3 id="steps">You moved {this.state.currentMoves} time</h3>
              : <h3 id="steps">You moved {this.state.currentMoves} times</h3>
          }
        </div>
        <div id="grid">
          {
            this.state.currentGrid.map(idx => (
              <div key={idx} className={`square${idx === this.state.currentIndex ? ' active' : ''}`}>
                {idx === this.state.currentIndex ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button onClick={() => this.move(this.state.left)} id="left">LEFT</button>
          <button onClick={() => this.move(this.state.up)} id="up">UP</button>
          <button onClick={() => this.move(this.state.right)} id="right">RIGHT</button>
          <button onClick={() => this.move(this.state.down)} id="down">DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form>
          <input value={this.state.email} onChange={this.onChange} id="email" type="email" placeholder="type email"></input>
          <input onClick={this.onSubmit} id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}