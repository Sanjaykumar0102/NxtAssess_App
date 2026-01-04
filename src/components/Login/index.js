import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: 'rahul',
    password: 'rahul@2021',
    error: false,
    showPassword: false,
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMessage => {
    this.setState({error: errorMessage})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onToggleShowPassword = () => {
    this.setState(prevState => ({showPassword: !prevState.showPassword}))
  }

  render() {
    const {username, password, error, showPassword} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form className="login-home-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://res.cloudinary.com/dzlwkon9z/image/upload/c_thumb,w_200,g_face/v1735613791/Group_8005_cba17r.png"
            className="logo"
            alt="login website logo"
          />
          <div className="input-field-container">
            <label htmlFor="username" className="username">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              className="text-field"
              value={username}
              onChange={this.onChangeUsername}
            />
          </div>
          <div className="input-field-container">
            <label htmlFor="password" className="username">
              PASSWORD
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="text-field"
              value={password}
              onChange={this.onChangePassword}
            />
          </div>
          <div className="checkbox-container">
            <input
              id="checkbox"
              type="checkbox"
              className="checkbox-field"
              checked={showPassword}
              onChange={this.onToggleShowPassword}
            />
            <label htmlFor="checkbox" className="checkbox-txt">
              Show Password
            </label>
          </div>
          <button type="submit" className="login-btn" data-testid="loginButton">
            Login
          </button>
          {error && <p className="err-msg">{error}</p>}
        </form>
      </div>
    )
  }
}

export default Login
