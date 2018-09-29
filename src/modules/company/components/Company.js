import React, { Component } from 'react';
import { adminView,
  adminEdit
} from '../../../rest/Rest';
import { getSessionStorage } from '../../../commons/utils/Utils';
import { loginToken,
  userLoginToken,
  name,
  mobile,
  email,
  company,
  tagline,
  address,
  city,
  state,
  pincode,
  gstin,
  panNo
} from '../../../commons/constants/Constants';

export default class Company extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      editedData: '',
      isError: false,
      errorMessage: '',
      isEditable: false,
      isLoading: false
    }
    
    this.getCompanydata = this.getCompanydata.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onCancleClick = this.onCancleClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.saveCompanyData = this.saveCompanyData.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});
    this.getCompanydata();
  }

  getCompanydata() {
    const self = this;

    if(getSessionStorage(userLoginToken)) {
      var FormData = require('form-data');
      var form = new FormData();
      form.append(loginToken, getSessionStorage(userLoginToken));     

      let responseStatus;
      adminView(form)
        .then(function(response) {
          responseStatus = response.status;
          return response.text();
        }).then(function(response) {
          self.setState({isLoading: false});

          if(responseStatus === 200) {
            let responseObj = JSON.parse(response);

            if(responseObj.SUCCESS === "TRUE") {
              let data = responseObj.data[0];
              
              self.setState({data: data});
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

  onEditClick() {
    this.setState({editedData: this.state.data});
    this.setState({isEditable: true});
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({ editedData: { ...this.state.editedData, [name]: value} });
  }

  onCancleClick() {
    this.setState({editedData: ''});
    this.setState({isEditable: false});
  }

  saveCompanyData(editedData) {
    const self = this;

    var FormData = require('form-data');
      var form = new FormData();
      form.append(loginToken, getSessionStorage(userLoginToken));
      form.append(name, editedData.user_name);
      form.append(mobile, editedData.user_mobile);
      form.append(email, editedData.user_email);
      form.append(company, editedData.user_company);
      form.append(tagline, editedData.user_tagline);
      form.append(address, editedData.user_address);
      form.append(city, editedData.user_city);
      form.append(state, editedData.user_state);
      form.append(pincode, editedData.user_pincode);
      form.append(gstin, editedData.user_gstin);
      form.append(panNo, editedData.user_pan_no);

      let responseStatus;
      adminEdit(form)
        .then(function(response) {
          responseStatus = response.status;
          return response.text();
        }).then(function(response) {
          self.setState({isLoading: false});

          if(responseStatus === 200) {
            let responseObj = JSON.parse(response);

            if(responseObj.SUCCESS === "TRUE") {
              self.setState({isEditable: false});
              self.getCompanydata();
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
  }

  onSaveClick(editedData) {
    if(editedData.user_company && 
      // editedData.user_tagline && 
      editedData.user_address &&
      editedData.user_city &&
      editedData.user_state &&
      editedData.user_pincode &&
      editedData.user_gstin
      // editedData.user_pan_no
    ) {
        this.setState({isLoading: true});
        this.saveCompanyData(editedData);
    } else {
      this.setState({isError: true});
    }
  }
  
  render() {
    const { data, editedData, errorMessage, isEditable, isError, isLoading } = this.state;
    
    return (
      <div className="company-wrapper">
        <div className="breadcrumb-wrapper">
          <span className="ajpatel_primary_color cursor-pointer" onClick={() => this.onCancleClick()}>Company</span>
          <span className="ajpatel_primary_color"> > </span>
          <span className="ajpatel_primary_color">View</span>
        </div>
        <div className="row company-container">
          <div className="col-sm-11">
            <div className="widget-box widget-color-blue2 ui-sortable-handle pagination_list_card header-card">
              <div className="widget-header product_list row">
                <h5 className="widget-title-bigger-lighter ajpatel_primary_color col-sm-2">Company View</h5>
                <div className="msg-wrapper col-sm-9">
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                  {isLoading ? <div className="alert alert-info"><div className="ajpatel-loader"></div><span className="loader-msg">Loading... Please wait.</span></div> : ""}
                </div>
                <div className="widget-toolbar product_Edit col-sm-1">
                  {!errorMessage && !isEditable && !isLoading && <button onClick={() => this.onEditClick()} className="btn btn-xs btn-ajpatel font-white">Edit</button>}
                </div>
              </div>
            </div>
            {/* Company Name */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Comapny Name : </strong></label>
                <div className="col-sm-6">
                <input name="user_company" type="text" value={editedData.user_company} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                {isError && !editedData.user_company ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Comapny Name : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.user_company}</span></div>
                </div>
              </div>
            }
            {/* Tag Line */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Tag Line : </strong></label>
                <div className="col-sm-6">
                <input name="user_tagline" type="text" value={editedData.user_tagline} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                {/* {isError && !editedData.user_tagline ? <div className="text-right ajpatel-error">This field is required.</div> : ""} */}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Tag Line : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.user_tagline}</span></div>
                </div>
              </div>
            }
            {/* Address */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Address : </strong></label>
                <div className="col-sm-6">
                <input name="user_address" type="text" value={editedData.user_address} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                {isError && !editedData.user_address ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Address : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.user_address}</span></div>
                </div>
              </div>
            }
            {/* City */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>City : </strong></label>
                <div className="col-sm-6">
                <input name="user_city" type="text" value={editedData.user_city} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                {isError && !editedData.user_city ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>City : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.user_city}</span></div>
                </div>
              </div>
            }
            {/* State */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>State : </strong></label>
                <div className="col-sm-6">
                <input name="user_state" type="text" value={editedData.user_state} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                {isError && !editedData.user_state ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>State : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.user_state}</span></div>
                </div>
              </div>
            }
            {/* PinCode */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Pin Code : </strong></label>
                <div className="col-sm-6">
                <input name="user_pincode" type="text" value={editedData.user_pincode} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                {isError && !editedData.user_pincode ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Pin Code : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.user_pincode}</span></div>
                </div>
              </div>
            }
            {/* GST No */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>GST No. : </strong></label>
                <div className="col-sm-6">
                <input name="user_gstin" type="text" value={editedData.user_gstin} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                {isError && !editedData.user_gstin ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>GST No. : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.user_gstin}</span></div>
                </div>
              </div>
            }
            {/* Pan No */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Pan No. : </strong></label>
                <div className="col-sm-6">
                <input name="user_pan_no" type="text" value={editedData.user_pan_no} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                {/* {isError && !editedData.user_pan_no ? <div className="text-right ajpatel-error">This field is required.</div> : ""} */}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Pan No. : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.user_pan_no}</span></div>
                </div>
              </div>
            }
            {/* Button */}
            {isEditable &&
              <div className="form-group row">
                <div className="offset-sm-4 col-sm-1">
                  <button className="btn btn-xs btn-ajpatel font-white" onClick={() => this.onCancleClick()}>Cancle</button>
                </div>
                <div className="col-sm-1">
                  <button className="btn btn-xs btn-ajpatel font-white" onClick={() => this.onSaveClick(editedData)}>Save</button>
                </div>
              </div>
            }
          </div>
        </div>
      {/* {isLoading ? <p>Loading... Please wait.</p> : ""}
      {!errorMessage && !isEditable && !isLoading ? <button onClick={() => this.onEditClick()}>Edit</button> : ''}
      <p>{errorMessage}</p>
      {isEditable
      ?
      <div>
      <input name="user_company" type="text" value={editedData.user_company} onChange={(event) => this.handleInputChange(event)}/>
      {isError && !editedData.user_company ? "This field is required." : ""}
      </div>
      :
      <div>{!isLoading ? <p>{data.user_company}</p> : '' }</div>
      }
      {isEditable
      ?
      <div>
      <input name="user_tagline" type="text" value={editedData.user_tagline} onChange={(event) => this.handleInputChange(event)}/>
      {isError && !editedData.user_tagline ? "This field is required." : ""}
      </div>
      :
      <div>{!isLoading ? <p>{data.user_tagline}</p> : '' }</div>
      }
      {isEditable
      ?
      <div>
      <input name="user_address" type="text" value={editedData.user_address} onChange={(event) => this.handleInputChange(event)}/>
      {isError && !editedData.user_address ? "This field is required." : ""}
      </div>
      :
      <div>{!isLoading ? <p>{data.user_address}</p> : '' }</div>
      }
      {isEditable
      ?
      <div>
      <input name="user_city" type="text" value={editedData.user_city} onChange={(event) => this.handleInputChange(event)}/>
      {isError && !editedData.user_city ? "This field is required." : ""}
      </div>
      :
      <div>{!isLoading ? <p>{data.user_city}</p> : '' }</div>
      }
      {isEditable
      ?
      <div>
      <input name="user_state" type="text" value={editedData.user_state} onChange={(event) => this.handleInputChange(event)}/>
      {isError && !editedData.user_state ? "This field is required." : ""}
      </div>
      :
      <div>{!isLoading ? <p>{data.user_state}</p> : '' }</div>
      }
      {isEditable
      ?
      <div>
      <input name="user_pincode" type="text" value={editedData.user_pincode} onChange={(event) => this.handleInputChange(event)}/>
      {isError && !editedData.user_pincode ? "This field is required." : ""}
      </div>
      :
      <div>{!isLoading ? <p>{data.user_pincode}</p> : '' }</div>
      }
      {isEditable
      ?
      <div>
      <input name="user_gstin" type="text" value={editedData.user_gstin} onChange={(event) => this.handleInputChange(event)}/>
      {isError && !editedData.user_gstin ? "This field is required." : ""}
      </div>
      :
      <div>{!isLoading ? <p>{data.user_gstin}</p> : '' }</div>
      }
      {isEditable
      ?
      <div>
      <input name="user_pan_no" type="text" value={editedData.user_pan_no} onChange={(event) => this.handleInputChange(event)}/>
      {isError && !editedData.user_pan_no ? "This field is required." : ""}
      </div>
      :
      <div>{!isLoading ? <p>{data.user_pan_no}</p> : '' }</div>
      }
      {isEditable
      ?
      <div>
      <button onClick={() => this.onCancleClick()}>Cancle</button>
      <button onClick={() => this.onSaveClick(editedData)}>Save</button>
      </div>
      :
      ''
      } */}
      </div>
    );
  }
}