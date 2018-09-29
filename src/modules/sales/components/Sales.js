import React, { Component } from 'react';
import { invoiceView } from '../../../rest/Rest';
import SalesList from './SalesList';
import SalesView from './SalesView';
import SalesCreate from './SalesCreate';
import { loginToken,
  userLoginToken,
  invoiceId
} from '../../../commons/constants/Constants';
import { getSessionStorage } from '../../../commons/utils/Utils';

export default class Sales extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      component: 'list',
      data: '',
      isLoading: false,  
      errorMessage: ''   
    }
    
    this.changeComponent = this.changeComponent.bind(this);
    this.updateState = this.updateState.bind(this);
    this.getInvoiceView = this.getInvoiceView.bind(this);
  }
  
  changeComponent(name, id) {
    this.setState({component: name});
    if(name === "view") {
      this.getInvoiceView(id);
    }
  }

  updateState(stateName, stateValue) {
    this.setState({[stateName]: stateValue});
  }

  getInvoiceView(id) {
    const self = this;
    self.setState({isLoading: true} );  

    if(getSessionStorage(userLoginToken)) {
      var FormData = require('form-data');
      var form = new FormData();
      form.append(loginToken, getSessionStorage(userLoginToken));
      form.append(invoiceId, id);  

      let responseStatus;
      invoiceView(form)
        .then(function(response) {
          responseStatus = response.status;
          return response.text();
        }).then(function(response) {
          self.setState({isLoading: false});

          if(responseStatus === 200) {
            let responseObj = JSON.parse(response);

            if(responseObj.SUCCESS === "TRUE") {
              self.setState({ data: responseObj.DATA[0]});
            } else {
              self.setState({ errorMessage: responseObj.MESSAGE});
            }
          } else {
            self.setState({ errorMessage: "Something went wrong trying to get data."});
            console.log('Response Status : ', responseStatus);
          }
        }).catch(function(ex) {
          self.setState({ isLoading: false});
          self.setState({ errorMessage: "Something went wrong parsing data."});
          console.log('Parsing Failed : ', ex);
        })
    } else {
      self.setState({ isLoading: false});
      self.setState({ errorMessage: "Login Token is missing."});
    }
  }
  
  render() {
    const { component, data, isLoading, errorMessage } = this.state;
    
    return (
      <div>
        <div className="breadcrumb-wrapper">
          <span onClick={() => this.changeComponent("list", null)} className="cursor-pointer ajpatel_primary_color">Sales</span>
          <span className="ajpatel_primary_color"> > </span>
          {
            component === "list"
            ?
            <span className="ajpatel_primary_color">List</span>
            :
            component === "view"
            ?
            <span className="ajpatel_primary_color">View</span>
            :
            <span className="ajpatel_primary_color">Create</span>
          }
        </div>
        {
        component === "list"
        ?
        <SalesList 
          changeComponent={this.changeComponent}/>
        :
        component === "view"
        ?
        <SalesView 
          changeComponent={this.changeComponent}
          updateState={this.updateState}
          data={data}
          isLoading={isLoading}
          errorMessage={errorMessage}/>
        :
        <SalesCreate 
          changeComponent={this.changeComponent}/>
        }
      </div>
    );
  }
}