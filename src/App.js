import {Component} from 'react'
import {Switch, Route} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Assessment from './components/Assessment'
import Results from './components/Results'
import ProtectedRoute from './components/ProtectedRoute'
import ScoreAndTimeContext from './context/ScoreAndTimeContext'
import NotFound from './components/NotFound'
import './App.css'

class App extends Component {
  state = {score: 0, timeRemains: 0}

  setScore = score => {
    this.setState({score})
  }

  setTimeRemains = time => {
    this.setState({timeRemains: time})
  }

  render() {
    const {score, timeRemains} = this.state

    return (
      <ScoreAndTimeContext.Provider
        value={{
          score,
          setScore: this.setScore,
          timeRemains,
          setTimeRemains: this.setTimeRemains,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/assessment" component={Assessment} />
          <ProtectedRoute exact path="/results" component={Results} />
          <Route component={NotFound} />
        </Switch>
      </ScoreAndTimeContext.Provider>
    )
  }
}

export default App
