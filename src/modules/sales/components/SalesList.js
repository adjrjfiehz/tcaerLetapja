import React, { Component } from 'react';
import { invoiceList, invoiceDelete } from '../../../rest/Rest';
import { getSessionStorage } from '../../../commons/utils/Utils';
import { loginToken,
  userLoginToken,
  invoiceId
} from '../../../commons/constants/Constants';
import moment from 'moment';

export default class SalesList extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
        data: '',
        keyword: '',
        isLoading: false,
        errorMessage: ''
    }
    
    this.getSalesData = this.getSalesData.bind(this);
  }

  componentDidMount() {
    this.getSalesData();
  }

  getSalesData() {
    const self = this;
    self.setState({isLoading: true});

    if(getSessionStorage(userLoginToken)) {
      var FormData = require('form-data');
      var form = new FormData();
      form.append(loginToken, getSessionStorage(userLoginToken));    

      let responseStatus;
      invoiceList(form)
        .then(function(response) {
          responseStatus = response.status;
          return response.text();
        }).then(function(response) {
          self.setState({isLoading: false});

          if(responseStatus === 200) {
            let responseObj = JSON.parse(response);

            if(responseObj.SUCCESS === "TRUE") {
              let newData = responseObj.DATA.sort((arg1, arg2) => arg2.invoice_date - arg1.invoice_date);
              self.setState({ data: newData});
            } else {
              self.setState({errorMessage: responseObj.MESSAGE});  
            }
          } else {
            self.setState({errorMessage: "Something went wrong trying to get data."});
            console.log('Response Status : ', responseStatus);
          }
        }).catch(function(ex) {
          self.setState({isLoading: false});
          self.setState({errorMessage: "Something went wrong parsing data."});
          console.log('Parsing Failed : ', ex);
        })
    } else {
      self.setState({isLoading: false});
      self.setState({errorMessage: "Login Token is missing."});
    }
  }

  tableBody(data) {
    if(data && data.length > 0) {
        const tableBody = data.map((data, key) =>
        <tr key={key}>
            <td>{key+1}</td>
            <td>{data.invoice_party_name}</td>
            <td>{data.invoice_number}</td>
            <td>{data.invoice_total}</td>
            <td>{moment.unix(data.invoice_date).format("DD-MM-YYYY")}</td>
            <td>
              <button disabled={this.state.isLoading} className="btn btn-xs btn-ajpatel" onClick={() => this.props.changeComponent("view", data.invoice_id)}>View</button>
              <button disabled={this.state.isLoading} className="btn btn-xs btn-danger delete-button" onClick={() => this.invoiceDelete(data.invoice_id)}>Delete</button>
            </td>
        </tr>
        );

        return tableBody;
    }
  }

  invoiceDelete(id) {
    if (window.confirm("Are you sure you want to DELETE this Party?")) {
      const self = this;
      self.setState({ isLoading: true });

      if (getSessionStorage(userLoginToken)) {
        var FormData = require('form-data');
        var form = new FormData();
        form.append(loginToken, getSessionStorage(userLoginToken));
        form.append(invoiceId, id);

        let responseStatus;
        invoiceDelete(form)
          .then(function (response) {
            responseStatus = response.status;
            return response.text();
          }).then(function (response) {
            self.setState({ isLoading: false });

            if (responseStatus === 200) {
              let responseObj = JSON.parse(response);

              if (responseObj.SUCCESS === "TRUE") {
                self.getSalesData();
              } else {
                self.setState({ errorMessage: responseObj.MESSAGE });
              }
            } else {
              self.setState({ errorMessage: "Something went wrong trying to get data." });
              console.log('Response Status : ', responseStatus);
            }
          }).catch(function (ex) {
            self.setState({ isLoading: false });
            self.setState({ errorMessage: "Something went wrong parsing data." });
            console.log('Parsing Failed : ', ex);
          })
      } else {
        self.setState({ isLoading: false });
        self.setState({ errorMessage: "Login Token is missing." });
      }
    }
  }
  
  render() {
      const { data, isLoading, errorMessage } = this.state;
      const tableBody = this.tableBody(data);
    
    return (
      <div className="saleslist-wrapper">
        <div className="row saleslist-container">
          <div className="col-sm-11">
            <div className="widget-box widget-color-blue2 ui-sortable-handle pagination_list_card">
              <div className="widget-header sales_list row">
                <h5 className="widget-title-bigger-lighter sales_name ajpatel_primary_color col-sm-2">Sales List</h5>
                <div className="msg-wrapper col-sm-9">
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                  {isLoading ? <div className="alert alert-info"><div className="ajpatel-loader"></div><span className="loader-msg">Loading... Please wait.</span></div> : ""}
                </div>
                <div className="widget-toolbar sales_add col-sm-1">
                  <button onClick={() => this.props.changeComponent("create", null)} className="btn btn-xs btn-ajpatel font-white">Add</button>
                </div>
              </div>
            </div>
            <div className="ajpatel-table-wrapper pagination_body table-responsive">
              <div className="col-xs-12">
                <table id="simple-table" className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Party Name</th>
                      <th>Invoice Number</th>
                      <th>Invoice Total</th>
                      <th>Invoice Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableBody}
                  </tbody>
                </table>
                {!data || !data.length > 0 ? <div className="text-center">Nothing to display.</div> : ''}
              </div>
            </div>
          </div>
        </div>
          {/* <button onClick={() => this.props.changeComponent("create", null)}>Add</button>
          {isLoading ? <p>Loading... Please wait.</p> : ""}
          <p>{errorMessage}</p>
          <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Party Name</th>
                        <th>Invoice Number</th>
                        <th>Invoice Total</th>
                        <th>Invoice Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tableBody}
                </tbody>
            </table>
            {!data || !data.length > 0 ? <div>Nothing to display.</div> : '' }
          </div> */}
      </div>
    );
  }
}