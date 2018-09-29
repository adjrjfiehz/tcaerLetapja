import React, { Component } from 'react';
import { partyEdit } from '../../../rest/Rest';
import { getSessionStorage } from '../../../commons/utils/Utils';
import { loginToken,
  userLoginToken,
  partyId,
  partyName,
  partyMobile,
  partyContactPerson,
  partyAddress,
  partyCity,
  partyState,
  partyPincode,
  partyGstin,
  partyPanNo
} from '../../../commons/constants/Constants';

export default class PartyView extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      editedData: '',
      isEditable: false,
      isError: false
    }
    
    this.onEditClick = this.onEditClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onCancleClick = this.onCancleClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.savePartyData = this.savePartyData.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({ editedData: { ...this.state.editedData, [name]: value} });
  }

  onEditClick() {
    this.setState({editedData: this.props.data});
    this.setState({isEditable: true});
  }

  onCancleClick() {
    this.setState({editedData: ''});
    this.setState({isEditable: false});
  }

  onSaveClick(editedData) {
    if(editedData.party_name && 
      // editedData.party_contact_person && 
      // editedData.party_gstin &&
      // editedData.party_pan_no &&
      // editedData.party_mobile &&
      editedData.party_address &&
      editedData.party_city &&
      editedData.party_state
      // editedData.party_pincode
    ) {
        this.savePartyData(editedData);
    } else {
      this.setState({isError: true});
    }
  }

  savePartyData(editedData) {
    const self = this;
    self.props.updateState('isLoading', true);

    var FormData = require('form-data');
    var form = new FormData();
    form.append(loginToken, getSessionStorage(userLoginToken));
    form.append(partyId, editedData.party_id);
    form.append(partyName, editedData.party_name);
    form.append(partyMobile, editedData.party_mobile);
    form.append(partyContactPerson, editedData.party_contact_person);
    form.append(partyAddress, editedData.party_address);
    form.append(partyCity, editedData.party_city);
    form.append(partyState, editedData.party_state);
    form.append(partyPincode, editedData.party_pincode);
    form.append(partyGstin, editedData.party_gstin);
    form.append(partyPanNo, editedData.party_pan_no);

    let responseStatus;
    partyEdit(form)
      .then(function(response) {
        responseStatus = response.status;
        return response.text();
      }).then(function(response) {
        self.props.updateState('isLoading', false);

        if(responseStatus === 200) {
          let responseObj = JSON.parse(response);

          if(responseObj.SUCCESS === "TRUE") {
            self.setState({isEditable: false});
            self.props.updateState('data', editedData);
          } else {
            self.props.updateState('errorMessage', responseObj.MESSAGE);
          }
        } else {
          self.props.updateState('errorMessage', "Something went wrong trying to get data.");
          console.log('Response Status : ', responseStatus);
        }
      }).catch(function(ex) {
        self.props.updateState('isLoading', false);
        self.props.updateState('errorMessage', "Something went wrong parsing data.");
        console.log('Parsing Failed : ', ex);
      })
  }

  render() {
    const { data, isLoading, errorMessage } = this.props;
    const { editedData, isEditable, isError } = this.state;
    
    return (
      <div className="partyview-wrapper">
        <div className="row partyview-container">
          <div className="col-sm-11">
            <div className="widget-box widget-color-blue2 ui-sortable-handle pagination_list_card header-card">
              <div className="widget-header row">
                <h5 className="widget-title-bigger-lighter ajpatel_primary_color col-sm-2">Party View</h5>
                <div className="msg-wrapper col-sm-9">
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                  {isLoading ? <div className="alert alert-info"><div className="ajpatel-loader"></div><span className="loader-msg">Loading... Please wait.</span></div> : ""}
                </div>
                <div className="widget-toolbar col-sm-1">
                  {!errorMessage && !isEditable && !isLoading && <button onClick={() => this.onEditClick()} className="btn btn-xs btn-ajpatel font-white">Edit</button>}
                </div>
              </div>
            </div>
            {/* Party Id */}
            {(isEditable || (!isEditable && !isLoading)) &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Party Id : </strong></label>
                <div className="col-sm-2 col-form-label">
                  <div><span>{data.party_id}</span></div>
                </div>
              </div>
            }
            {/* Party Name */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Party Name : </strong></label>
                <div className="col-sm-6">
                  <input name="party_name" type="text" value={editedData.party_name} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                  {isError && !editedData.party_name ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Party Name : </strong></label>
                <div className="col-sm-6 col-form-label">
                  <div><span>{data.party_name}</span></div>
                </div>
              </div>
            }
            {/* Contact Person */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Contact Person : </strong></label>
                <div className="col-sm-6">
                <input name="party_contact_person" type="text" value={editedData.party_contact_person} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                {/* {isError && !editedData.party_contact_person ? <div className="text-right ajpatel-error">This field is required.</div> : ""} */}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Contact Person : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.party_contact_person}</span></div>
                </div>
              </div>
            }
            {/* Mobile */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Mobile : </strong></label>
                <div className="col-sm-6">
                <input name="party_mobile" type="text" value={editedData.party_mobile} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                {/* {isError && !editedData.party_mobile ? <div className="text-right ajpatel-error">This field is required.</div> : ""} */}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Mobile : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.party_mobile}</span></div>
                </div>
              </div>
            }
            {/* Address */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Address : </strong></label>
                <div className="col-sm-6">
                <input name="party_address" type="text" value={editedData.party_address} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                {isError && !editedData.party_address ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Address : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.party_address}</span></div>
                </div>
              </div>
            }
            {/* City */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>City : </strong></label>
                <div className="col-sm-6">
                <input name="party_city" type="text" value={editedData.party_city} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                {isError && !editedData.party_city ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>City : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.party_city}</span></div>
                </div>
              </div>
            }
            {/* State */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>State : </strong></label>
                <div className="col-sm-6">
                <input name="party_state" type="text" value={editedData.party_state} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                {isError && !editedData.party_state ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>State : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.party_state}</span></div>
                </div>
              </div>
            }
            {/* PinCode */}
            {isEditable &&
              <div className="form-group row has-success">
              <label className="col-sm-2 col-form-label text-right"><strong>Pin Code : </strong></label>
                <div className="col-sm-6">
                <input name="party_pincode" type="text" value={editedData.party_pincode} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                {/* {isError && !editedData.party_pincode ? <div className="text-right ajpatel-error">This field is required.</div> : ""} */}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
              <label className="col-sm-2 col-form-label text-right"><strong>Pin Code : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.party_pincode}</span></div>
                </div>
              </div>
            }
            {/* GST No */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>GST No. : </strong></label>
                <div className="col-sm-6">
                <input name="party_gstin" type="text" value={editedData.party_gstin} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                {/* {isError && !editedData.party_gstin ? <div className="text-right ajpatel-error">This field is required.</div> : ""} */}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>GST No. : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.party_gstin}</span></div>
                </div>
              </div>
            }
            {/* Pan No */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Pan No. : </strong></label>
                <div className="col-sm-6">
                <input name="party_pan_no" type="text" value={editedData.party_pan_no} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                {/* {isError && !editedData.party_pan_no ? <div className="text-right ajpatel-error">This field is required.</div> : ""} */}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Pan No. : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.party_pan_no}</span></div>
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
            {!isEditable && !isLoading &&
              <div className="form-group row">
                <div className="offset-sm-4 col-sm-1">
                  <button className="btn btn-xs btn-ajpatel font-white" onClick={() => this.props.changeComponent("list", null)}>Back</button>
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
        <div><p>{data.party_id}</p></div>
        :
        <div>{!isLoading ? <p>{data.party_id}</p> : '' }</div>
        }
        {isEditable
        ?
        <div>
        <input name="party_name" type="text" value={editedData.party_name} onChange={(event) => this.handleInputChange(event)}/>
        {isError && !editedData.party_name ? "This field is required." : ""}
        </div>
        :
        <div>{!isLoading ? <p>{data.party_name}</p> : '' }</div>
        }
        {isEditable
        ?
        <div>
        <input name="party_contact_person" type="text" value={editedData.party_contact_person} onChange={(event) => this.handleInputChange(event)}/>
        {isError && !editedData.party_contact_person ? "This field is required." : ""}
        </div>
        :
        <div>{!isLoading ? <p>{data.party_contact_person}</p> : '' }</div>
        }
        {isEditable
        ?
        <div>
        <input name="party_gstin" type="text" value={editedData.party_gstin} onChange={(event) => this.handleInputChange(event)}/>
        {isError && !editedData.party_gstin ? "This field is required." : ""}
        </div>
        :
        <div>{!isLoading ? <p>{data.party_gstin}</p> : '' }</div>
        }
        {isEditable
        ?
        <div>
        <input name="party_pan_no" type="text" value={editedData.party_pan_no} onChange={(event) => this.handleInputChange(event)}/>
        {isError && !editedData.party_pan_no ? "This field is required." : ""}
        </div>
        :
        <div>{!isLoading ? <p>{data.party_pan_no}</p> : '' }</div>
        }
        {isEditable
        ?
        <div>
        <input name="party_mobile" type="text" value={editedData.party_mobile} onChange={(event) => this.handleInputChange(event)}/>
        {isError && !editedData.party_mobile ? "This field is required." : ""}
        </div>
        :
        <div>{!isLoading ? <p>{data.party_mobile}</p> : '' }</div>
        }
        {isEditable
        ?
        <div>
        <input name="party_address" type="text" value={editedData.party_address} onChange={(event) => this.handleInputChange(event)}/>
        {isError && !editedData.party_address ? "This field is required." : ""}
        </div>
        :
        <div>{!isLoading ? <p>{data.party_address}</p> : '' }</div>
        }
        {isEditable
        ?
        <div>
        <input name="party_city" type="text" value={editedData.party_city} onChange={(event) => this.handleInputChange(event)}/>
        {isError && !editedData.party_city ? "This field is required." : ""}
        </div>
        :
        <div>{!isLoading ? <p>{data.party_city}</p> : '' }</div>
        }
        {isEditable
        ?
        <div>
        <input name="party_state" type="text" value={editedData.party_state} onChange={(event) => this.handleInputChange(event)}/>
        {isError && !editedData.party_state ? "This field is required." : ""}
        </div>
        :
        <div>{!isLoading ? <p>{data.party_state}</p> : '' }</div>
        }
        {isEditable
        ?
        <div>
        <input name="party_pincode" type="text" value={editedData.party_pincode} onChange={(event) => this.handleInputChange(event)}/>
        {isError && !editedData.party_pincode ? "This field is required." : ""}
        </div>
        :
        <div>{!isLoading ? <p>{data.party_pincode}</p> : '' }</div>
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