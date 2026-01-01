import {Component} from 'react'
import Header from '../Header'
import ScoreAndTimeContext from '../../context/ScoreAndTimeContext'

import './index.css'

class Results extends Component {
  onClickReattempt = () => {
    const {history} = this.props
    history.push('/assessment')
  }

  renderResults = (score, timeRemains) => {
    return (
      <div className="result-bg-container">
        <div className="result-view">
          <img
            src="https://res.cloudinary.com/dzlwkon9z/image/upload/v1736013476/Screenshot_2025-01-04_232651_kjif0z.png"
            alt="time up"
            className={`${timeRemains === 0 ? 'submit-img' : 'display-none'}`}
          />
          <img
            src="https://res.cloudinary.com/dzlwkon9z/image/upload/c_thumb,w_200,g_face/v1736013459/Asset_2_1_kgvvg2.png"
            alt="submit"
            className={`${timeRemains !== 0 ? 'submit-img' : 'display-none'}`}
          />
          <h1
            className={`${
              timeRemains !== 0 ? 'congrats-heading' : 'display-none'
            }`}
          >
            Congrats! You completed the assessment.
          </h1>

          <h1 className={`${timeRemains === 0 ? 'time-up' : 'display-none'}`}>
            Time is up!
          </h1>

          <div
            className={`${
              timeRemains !== 0 ? 'time-taken-container' : 'display-none'
            }`}
          >
            <p className="time-taken-txt">Time Taken:</p>

            <p className="time-taken">
              00:
              {Math.floor(timeRemains / 60) < 10
                ? `0${Math.floor(timeRemains / 60)}`
                : Math.floor(timeRemains / 60)}
              :
              {timeRemains % 60 < 10
                ? `0${timeRemains % 60}`
                : timeRemains % 60}
            </p>
          </div>

          <p className={`${timeRemains === 0 ? 'not-cmpt' : 'display-none'}`}>
            You did not complete the assessment within the time.
          </p>

          <div className="your-score-container">
            <p className="your-score-txt">Your Score:</p>
            <p className="your-score"> {score}</p>
          </div>

          <button
            className="reattempt-btn"
            data-testid="reattemptButton"
            type="button"
            onClick={this.onClickReattempt}
          >
            Reattempt
          </button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <ScoreAndTimeContext.Consumer>
        {({score, timeRemains}) => (
          <>
            <Header />
            {this.renderResults(score, timeRemains)}
          </>
        )}
      </ScoreAndTimeContext.Consumer>
    )
  }
}

export default Results
