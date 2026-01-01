import {Component} from 'react'
import './index.css'

class Timer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timeLeft: 600,
    }
    this.timerId = null
  }

  componentDidMount() {
    this.startTimer()
  }

  componentWillUnmount() {
    this.clearTimer()
  }

  startTimer = () => {
    this.timerId = setInterval(() => {
      this.setState(
        prevState => ({timeLeft: prevState.timeLeft - 1}),
        () => {
          const {timeLeft} = this.state
          const {submitAssessment} = this.props

          if (timeLeft === 0) {
            this.clearTimer()
            submitAssessment(timeLeft)
          }
        },
      )
    }, 1000)
  }

  clearTimer = () => {
    if (this.timerId) {
      clearInterval(this.timerId)
    }
  }

  onClickButton = index => {
    const {onSetQuestion} = this.props
    onSetQuestion(index)
  }

  formatTime = seconds => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  renderTimer = () => {
    const {timeLeft} = this.state

    return (
      <div className="timer-container">
        <p className="time-left-txt">Time Left</p>
        <p className="timer">{this.formatTime(timeLeft)}</p>
      </div>
    )
  }

  renderQuestionView = () => {
    const {
      response,
      answeredQuestions,
      onSetQuestion,
      count,
      submitAssessment,
    } = this.props
    const {total, data} = response

    return (
      <div className="question-view-container">
        <div className="question-view">
          <div className="count-container">
            <p className="answered-count">{answeredQuestions.length}</p>
            <p className="answered-count-txt">Answered Questions</p>
          </div>
          <div className="count-container unanswered-container">
            <p className="answered-count count-container-unanswered">
              {total - answeredQuestions.length}
            </p>
            <p className="answered-count-txt">Unanswered Questions</p>
          </div>
        </div>

        <hr className="hr-question-line" />

        <div className="question-view2">
          <h1 className="question-len">Questions ({total})</h1>
          <ul className="question-list-container">
            {data.map((question, index) => {
              const answered = answeredQuestions.find(
                each => each.qId === question.id,
              )
              const current = count === index

              return (
                <li key={question.id}>
                  <button
                    className={`${answered ? 'answered-one' : ''} ${
                      current ? 'current-one' : ''
                    } question-btn`}
                    type="button"
                    onClick={() => onSetQuestion(index)}
                  >
                    {index + 1}
                  </button>
                </li>
              )
            })}
          </ul>
          <button
            className="submit-assessment-btn"
            type="button"
            onClick={() => submitAssessment(this.state.timeLeft)}
          >
            Submit Assessment
          </button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="timer-question-view-container">
        {this.renderTimer()}
        {this.renderQuestionView()}
      </div>
    )
  }
}

export default Timer
