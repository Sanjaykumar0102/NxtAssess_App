import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {history} = props

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-header">
      <div className="logo-container">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dzlwkon9z/image/upload/c_thumb,w_200,g_face/v1735744432/Group_8004_jtkb4c.png"
            className="header-logo"
            alt="website logo"
          />
        </Link>
      </div>
      <button
        className="logout-btn"
        type="button"
        data-testid="logoutButton"
        onClick={onClickLogout}
      >
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
