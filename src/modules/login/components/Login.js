import React, { Component } from 'react';
import { login } from '../../../rest/Rest';
import { setSessionStorage,
  getSessionStorage,
  clearSessionStorage
} from '../../../commons/utils/Utils';
import { loginEmailMob,
  loginPassword,
  userLoginToken,
  userName
} from '../../../commons/constants/Constants';
import basePath from '../../../commons/utils/basePath';
import { Redirect } from 'react-router';

export default class Login extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      idOrNumber: '',
      password: '',
      errorMessage: '',
      redirect: false,
      isLoading: false
    }

    this.onLoginClick = this.onLoginClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {this.clearState();}, 70);
    if(getSessionStorage(userLoginToken)) {
      this.setState({redirect: true});
    } else {
      clearSessionStorage();
    }
  }

  clearState() {
    this.setState({idOrNumber: ''});
    this.setState({password: ''});
    this.setState({errorMessage: ''});
    this.setState({redirect: false});
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value});
    this.setState({errorMessage: ''});
  }

  onLoginClick(idOrNumber, password) {
    const self = this;
    this.setState({errorMessage: ''});
    
    if(idOrNumber && password) {
      var FormData = require('form-data');
      var form = new FormData();
      form.append(loginEmailMob, idOrNumber);
      form.append(loginPassword, password);      

      let responseStatus;
      self.setState({isLoading: true});
      login(form)
        .then(function(response) {
          responseStatus = response.status;
          return response.text();
        }).then(function(response) {
          self.setState({ isLoading: false });
          if(responseStatus === 200) {
            let responseObj = JSON.parse(response);

            if(responseObj.SUCCESS === "TRUE") {
              let userData = responseObj.user_data[0];

              setSessionStorage(userLoginToken, userData[userLoginToken]);
              setSessionStorage(userName, userData[userName]);
              //setSessionStorage(userMobile, userData[userMobile]);
              //setSessionStorage(userEmail, userData[userEmail]);

              self.setState({redirect: true});
            } else {
              self.setState({errorMessage: responseObj.MESSAGE});  
            }
          } else {
            self.setState({errorMessage: "Something went wrong trying to get data."});
            console.log('Response Status : ', responseStatus);
          }
        }).catch(function(ex) {
          self.setState({ isLoading: false });
          self.setState({errorMessage: "Something went wrong parsing data."});
          console.log('Parsing Failed : ', ex);
        })
    } else {
      self.setState({errorMessage: "Fields are required."});
    }
  }
  
  render() {
    const { idOrNumber, password, errorMessage, redirect, isLoading } = this.state;

    if(redirect) {
      return <Redirect to={basePath``}/>;
    }
    
    return (
      <div className="login_wrapper">
        <div className="clearfix login_container">
          <div className="col offset-md-4 col-md-4 col-xs-12">
            <div className="login-container">
              <div className="center">
                <h1 className="ajpatel_primary_color">Login</h1>
              </div>
            </div>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {isLoading ? <div className="alert alert-info"><div className="ajpatel-loader"></div><span className="loader-msg">Loading... Please wait.</span></div> : ""}
            <div className="login-container-wrapper">
              <div className="container login-container">
                <label className="ajpatel_primary_color"><b>ID</b></label>
                <input type="text" placeholder="ID" name="idOrNumber" value={idOrNumber} onChange={(event) => this.handleInputChange(event)}/>
                <label className="ajpatel_primary_color"><b>Password</b></label>
                <input type="password" placeholder="Password" name="password" value={password} onChange={(event) => this.handleInputChange(event)} />
                <button onClick={() => this.onLoginClick(idOrNumber, password)} className="login-btn btn btn-success">Login</button>
  				    </div>
			      </div>
          </div>
          
        </div>
        {/* <input name="idOrNumber" type="text" value={idOrNumber} onChange={(event) => this.handleInputChange(event)}/>
        <input name="password" type="password" value={password} onChange={(event) => this.handleInputChange(event)}/>
        <button onClick={() => this.onLoginClick(idOrNumber, password)}>Login</button> */}
      </div>
    );
  }
}