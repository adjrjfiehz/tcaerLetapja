import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import basePath from '../../utils/basePath';
import { getSessionStorage,
  clearSessionStorage
} from '../../../commons/utils/Utils';
import { userLoginToken,
  userName
} from '../../../commons/constants/Constants';
import { Redirect } from 'react-router';

export class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      redirect: false
    }
  }
  
  componentDidMount() {
    if(getSessionStorage(userLoginToken) && getSessionStorage(userName)) {
      this.setState({userName: getSessionStorage(userName)});
    } else {
      this.setState({redirect: true});
    }
  }

  onLogoutClick() {
    clearSessionStorage();
    this.setState({redirect: true});
  }

  render() {
    const { redirect } = this.state;

    if(redirect) {
      return <Redirect to={basePath`login`}/>;
    }
    
    return (
      <div className="header_wrapper">
        <nav className="navbar navbar-expand-sm bg-light menu_ajpatel">
          <div className="row header-row">
            <div className="col">
              <h1 className="font-white">A. J. PATEL & CO.</h1>
            </div>
            <div className="col">
              <ul className="navbar-nav link-container">
                <li className="nav-item">
                  <Link to={basePath``} className="nav-link font-white">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to={basePath`sales`} className="nav-link font-white">Sales</Link>
                </li>
                <li className="nav-item">
                  <Link to={basePath`party`} className="nav-link font-white">Party</Link>
                </li>
                <li className="nav-item">
                  <Link to={basePath`product`} className="nav-link font-white">Product</Link>
                </li>
                <li className="nav-item">
                  <Link to={basePath`company`} className="nav-link font-white">Company</Link>
                </li>
              </ul>
            </div>
            <div className="col logout-wrapper">
              {/* <h6>Welcome <b>{userName}</b></h6> */}
              <div className="logout-container font-white cursor-pointer" onClick={() => this.onLogoutClick()}><span>Logout</span></div>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
