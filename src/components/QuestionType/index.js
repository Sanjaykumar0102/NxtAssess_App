import {Component} from 'react'

import './index.css'

class QuestionType extends Component {
  constructor(props) {
    super(props)
    const {question, answeredQuestions} = this.props
    const {optionsType, options, id} = question

    const answeredOption = answeredQuestions.find(e => e.qId === id)

    this.state = {
      selectedOption:
        optionsType === 'SINGLE_SELECT' && answeredOption
          ? answeredOption.ansId
          : options[0].id,
    }
  }

  onClickAnswer = (q, a) => {
    const {onAnsweredQuestions} = this.props
    this.setState({selectedOption: a}, () => onAnsweredQuestions(q, a))
  }

  handleNextQuestion = () => {
    const {question, answeredQuestions, onNextQuestion} = this.props
    const {optionsType, id} = question
    const {selectedOption} = this.state

    const isAnswered = answeredQuestions.find(e => e.qId === id)
    if (optionsType === 'SINGLE_SELECT' && !isAnswered) {
      this.onClickAnswer(id, selectedOption)
    }

    onNextQuestion()
  }

  renderOptions = () => {
    const {question, count, response, answeredQuestions} = this.props
    const {options, optionsType, id} = question
    const {selectedOption} = this.state

    const f = answeredQuestions.filter(e => e.qId === id)

    if (optionsType === 'DEFAULT') {
      return (
        <div className="options-container">
          <div className="opt-cont">
            <ul className="option-container-list">
              {options.map(e => (
                <li key={e.id} className="op-list">
                  <button
                    onClick={() => this.onClickAnswer(id, e.id)}
                    type="button"
                    className={`${
                      f.length > 0 && f[0].ansId === e.id ? 'selected-item' : ''
                    } list-options`}
                  >
                    {e.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {count !== response.total - 1 && (
            <button
              type="button"
              className={`${
                options.length !== 2
                  ? 'nxt-btn nxt-s'
                  : 'nxt-btn nxt-s nxt-btn-single'
              }`}
              onClick={this.handleNextQuestion}
            >
              Next Question
            </button>
          )}
        </div>
      )
    }

    if (optionsType === 'IMAGE') {
      return (
        <div className="options-container">
          <div className="opt-cont">
            <ul className="option-container-im">
              {options.map(e => (
                <li key={e.id}>
                  <button
                    className="list-options-imgs"
                    type="button"
                    onClick={() => this.onClickAnswer(id, e.id)}
                  >
                    <img
                      src={e.imageUrl}
                      alt={e.text}
                      className={`${
                        f.length > 0 && f[0].ansId === e.id
                          ? 'selected-img'
                          : ''
                      } options-img`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {count !== response.total - 1 && (
            <button
              type="button"
              className="nxt-btn nxt-btn-img"
              onClick={this.handleNextQuestion}
            >
              Next Question
            </button>
          )}
        </div>
      )
    }

    if (optionsType === 'SINGLE_SELECT') {
      return (
        <ul className="options-container">
          <div className="opt-cont">
            <select
              className="list-options-select"
              value={selectedOption}
              onChange={e => this.onClickAnswer(id, e.target.value)}
            >
              {options.map(e => (
                <option className="option-list" key={e.id} value={e.id}>
                  {e.text}
                </option>
              ))}
            </select>
          </div>
          <div className="info-container">
            <p className="info-icon">!</p>
            <p className="info-txt">First option is selected by default</p>
          </div>

          {count !== response.total - 1 && (
            <button
              type="button"
              className="nxt-btn nxt-btn-select"
              onClick={this.handleNextQuestion}
            >
              Next Question
            </button>
          )}
        </ul>
      )
    }

    return null
  }

  render() {
    const {question, count} = this.props
    const {questionText} = question

    return (
      <div className="question-section">
        <p className="question">
          {count + 1}. {questionText}
        </p>
        <hr className="hr-line" />
        {this.renderOptions()}
      </div>
    )
  }
}

export default QuestionType
