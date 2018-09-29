import React, { Component } from 'react';
import { partyList, partyDelete } from '../../../rest/Rest';
import { getSessionStorage } from '../../../commons/utils/Utils';
import { loginToken,
  userLoginToken,
  keyword,
  partyId
} from '../../../commons/constants/Constants';

export default class PartyList extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
        data: '',
        keyword: '',
        isLoading: false,
        errorMessage: ''
    }
    
    this.getPartyData = this.getPartyData.bind(this);
    this.partyDelete = this.partyDelete.bind(this);
  }

  componentDidMount() {
    this.getPartyData();
  }

  getPartyData() {
    const self = this;
    self.setState({isLoading: true});

    if(getSessionStorage(userLoginToken)) {
      var FormData = require('form-data');
      var form = new FormData();
      form.append(loginToken, getSessionStorage(userLoginToken));
      form.append(keyword, this.state.keyword);     

      let responseStatus;
      partyList(form)
        .then(function(response) {
          responseStatus = response.status;
          return response.text();
        }).then(function(response) {
          self.setState({isLoading: false});

          if(responseStatus === 200) {
            let responseObj = JSON.parse(response);

            if(responseObj.SUCCESS === "TRUE") {
              self.setState({data: responseObj.DATA.sort((arg1, arg2) => arg1.party_name > arg2.party_name)});
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

  partyDelete(id) {
    if (window.confirm("Are you sure you want to DELETE this Party?")) {
      const self = this;
      self.setState({ isLoading: true });

      if (getSessionStorage(userLoginToken)) {
        var FormData = require('form-data');
        var form = new FormData();
        form.append(loginToken, getSessionStorage(userLoginToken));
        form.append(partyId, id);

        let responseStatus;
        partyDelete(form)
          .then(function (response) {
            responseStatus = response.status;
            return response.text();
          }).then(function (response) {
            self.setState({ isLoading: false });

            if (responseStatus === 200) {
              let responseObj = JSON.parse(response);

              if (responseObj.SUCCESS === "TRUE") {
                self.getPartyData();
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

  tableBody(data) {
    if(data && data.length > 0) {
        const tableBody = data.map((data, key) =>
        <tr key={key}>
            <td>{key+1}</td>
            <td>{data.party_name}</td>
            <td>{data.party_contact_person}</td>
            <td>{data.party_mobile}</td>
            <td>
              <button disabled={this.state.isLoading} className="btn btn-xs btn-ajpatel" onClick={() => this.props.changeComponent("view", data.party_id)}>View</button>
              <button disabled={this.state.isLoading} className="btn btn-xs btn-danger delete-button" onClick={() => this.partyDelete(data.party_id)}>Delete</button>
            </td>
        </tr>
        );

        return tableBody;
    }
  }
  
  render() {
    const { data, isLoading, errorMessage } = this.state;
    const tableBody = this.tableBody(data);
    
    return (
      <div className="partylist-wrapper">
        <div className="row partylist-container">
          <div className="col-sm-11">
            <div className="widget-box widget-color-blue2 ui-sortable-handle pagination_list_card">
              <div className="widget-header party_list row">
                <h5 className="widget-title-bigger-lighter party_name ajpatel_primary_color col-sm-2">Party List</h5>
                <div className="msg-wrapper col-sm-9">
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                  {isLoading ? <div className="alert alert-info"><div className="ajpatel-loader"></div><span className="loader-msg">Loading... Please wait.</span></div> : ""}
                </div>
                <div className="widget-toolbar party_add col-sm-1">
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
                      <th>Name</th>
                      <th>Contact Person</th>
                      <th>Mobile</th>
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
                        <th>Name</th>
                        <th>Contact Person</th>
                        <th>Mobile</th>
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