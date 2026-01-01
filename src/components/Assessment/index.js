import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import QuestionType from '../QuestionType'
import Timer from '../Timer'
import ScoreAndTimeContext from '../../context/ScoreAndTimeContext'

import './index.css'

class Assessment extends Component {
  state = {
    response: {
      status: 'INITIAL',
      data: null,
      total: null,
      errorMsg: null,
    },
    count: 0,
    answeredQuestions: [],
  }

  componentDidMount() {
    this.getData()
  }

  onAnsweredQuestions = (qId, ansId) => {
    this.setState(prevState => ({
      answeredQuestions: prevState.answeredQuestions
        .filter(e => e.qId !== qId)
        .concat({qId, ansId}),
    }))
  }

  calculateScore = setScore => {
    const {answeredQuestions, response} = this.state
    let currentScore = 0

    answeredQuestions.forEach(e => {
      const question = response.data.find(q => q.id === e.qId)
      const correctAnswer = question.options.find(
        opt => opt.isCorrect === true || opt.isCorrect === 'true',
      )
      if (e.ansId === correctAnswer.id) {
        currentScore += 1
      }
    })

    setScore(currentScore)
  }

  submitAssessment = (timeLeft, setScore, setTimeRemains) => {
    const {history} = this.props
    this.calculateScore(setScore)

    const timeTakenToComplete = timeLeft === 0 ? 0 : 600 - timeLeft
    setTimeRemains(timeTakenToComplete)

    history.replace('/results')
  }

  updatedData = data => {
    return data.questions.map(each => {
      const {id, options_type: optionsType, question_text: questionText} = each

      const updatedOptions = each.options.map(opt => ({
        id: opt.id,
        isCorrect: opt.is_correct,
        text: opt.text,
        ...(optionsType === 'IMAGE' && {imageUrl: opt.image_url}),
      }))

      return {id, options: updatedOptions, optionsType, questionText}
    })
  }

  getData = async () => {
    this.setState({
      response: {
        status: 'IN_PROGRESS',
        data: null,
        total: null,
        errorMsg: null,
      },
    })

    const url = 'https://apis.ccbp.in/assess/questions'

    const res = await fetch(url)
    const responseData = await res.json()

    if (res.ok) {
      const data = this.updatedData(responseData)
      this.setState({
        response: {
          status: 'SUCCESS',
          data,
          total: responseData.total,
          errorMsg: null,
        },
      })
    } else {
      this.setState({
        response: {status: 'FAILURE', errorMsg: responseData.error_msg},
      })
    }
  }

  onNextQuestion = () => {
    if (this.state.count < 9) {
      this.setState(prevState => ({count: prevState.count + 1}))
    }
  }

  onSetQuestion = ind => {
    const selectedQuestion = this.state.response.data[ind]
    if (selectedQuestion.optionsType === 'SINGLE_SELECT') {
      const firstOption = selectedQuestion.options[0].id
      const alreadyAnswered = this.state.answeredQuestions.find(
        q => q.qId === selectedQuestion.id,
      )

      if (!alreadyAnswered) {
        this.setState(prevState => ({
          answeredQuestions: [
            ...prevState.answeredQuestions,
            {qId: selectedQuestion.id, ansId: firstOption},
          ],
        }))
        this.onAnsweredQuestions(selectedQuestion.id, firstOption)
      }
    }
    this.setState({count: ind})
  }

  renderSuccessView = (setScore, setTimeRemains) => {
    const {count, response, answeredQuestions} = this.state
    const question = response.data[count]

    return (
      <div className="question-container">
        <Timer
          response={response}
          answeredQuestions={answeredQuestions}
          onSetQuestion={this.onSetQuestion}
          count={count}
          submitAssessment={timeLeft =>
            this.submitAssessment(timeLeft, setScore, setTimeRemains)
          }
        />
        <QuestionType
          key={question.id}
          question={question}
          count={count}
          onNextQuestion={this.onNextQuestion}
          onAnsweredQuestions={this.onAnsweredQuestions}
          answeredQuestions={answeredQuestions}
          response={response}
        />
      </div>
    )
  }

  renderAssessment = (setScore, setTimeRemains) => {
    const {response} = this.state
    const {status} = response

    switch (status) {
      case 'IN_PROGRESS':
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#263868" height={50} width={50} />
          </div>
        )
      case 'SUCCESS':
        return this.renderSuccessView(setScore, setTimeRemains)
      case 'FAILURE':
        return (
          <div className="err-container">
            <img
              className="failure-img"
              src="https://res.cloudinary.com/dngzbeidb/image/upload/v1727146364/ml55hvnmm1r3bw32xjtw.png"
              alt="failure view"
            />
            <h1 className="failure-head">Oops! Something went wrong</h1>
            <p className="failure-txt">We are having some trouble</p>
            <button type="button" className="retry-btn" onClick={this.getData}>
              Retry
            </button>
          </div>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <ScoreAndTimeContext.Consumer>
        {({setScore, setTimeRemains}) => (
          <div className="assessment-container">
            <Header />
            {this.renderAssessment(setScore, setTimeRemains)}
          </div>
        )}
      </ScoreAndTimeContext.Consumer>
    )
  }
}

export default Assessment
