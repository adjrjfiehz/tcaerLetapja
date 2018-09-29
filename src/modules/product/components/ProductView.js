import React, { Component } from 'react';
import { productEdit } from '../../../rest/Rest';
import { getSessionStorage } from '../../../commons/utils/Utils';
import { loginToken,
  userLoginToken,
  productId,
  productName,
  productHsnNo,
  productRate,
  productUnit,
  productCGST,
  productSGST,
  productIGST
} from '../../../commons/constants/Constants';

export default class ProductView extends Component {
  
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
    this.saveProductData = this.saveProductData.bind(this);
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
    if(editedData.product_name && 
      editedData.product_hsn_no && 
      editedData.product_rate &&
      // editedData.product_unit &&
      editedData.product_cgst &&
      editedData.product_sgst) {
        this.saveProductData(editedData);
    } else {
      this.setState({isError: true});
    }
  }

  saveProductData(editedData) {
    const self = this;
    self.props.updateState('isLoading', true);

    var FormData = require('form-data');
    var form = new FormData();
    form.append(loginToken, getSessionStorage(userLoginToken));
    form.append(productId, editedData.product_id);
    form.append(productName, editedData.product_name);
    form.append(productHsnNo, editedData.product_hsn_no);
    form.append(productRate, editedData.product_rate);
    form.append(productUnit, editedData.product_unit);
    form.append(productCGST, editedData.product_cgst);
    form.append(productSGST, editedData.product_sgst);
    form.append(productIGST, "0");

    let responseStatus;
    productEdit(form)
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
      <div className="productview-wrapper">
        <div className="row productview-container">
          <div className="col-sm-11">
            <div className="widget-box widget-color-blue2 ui-sortable-handle pagination_list_card header-card">
              <div className="widget-header product_list row">
                <h5 className="widget-title-bigger-lighter product_name ajpatel_primary_color col-sm-2">Product View</h5>
                <div className="msg-wrapper col-sm-9">
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                  {isLoading ? <div className="alert alert-info"><div className="ajpatel-loader"></div><span className="loader-msg">Loading... Please wait.</span></div> : ""}
                </div>
                <div className="widget-toolbar product_Edit col-sm-1">
                  {!errorMessage && !isEditable && !isLoading && <button onClick={() => this.onEditClick()} className="btn btn-xs btn-ajpatel font-white">Edit</button>}
                </div>
              </div>
            </div>
            {/* Product Id */}
            {(isEditable || (!isEditable && !isLoading)) &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Product Id : </strong></label>
                <div className="col-sm-2 col-form-label">
                  <div><span>{data.product_id}</span></div>
                </div>
              </div>
            }
            {/* Product Name */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Product Name : </strong></label>
                <div className="col-sm-6">
                  <input name="product_name" type="text" value={editedData.product_name} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success"/>
                {isError && !editedData.product_name ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Product Name : </strong></label>
                <div className="col-sm-6 col-form-label">
                  <div><span>{data.product_name}</span></div>
                </div>
              </div>
            }
            {/* Product HSN No */}
            {isEditable &&
              <div className="form-group row has-success">
              <label className="col-sm-2 col-form-label text-right"><strong>HSN No. : </strong></label>
                <div className="col-sm-6">
                <input className="form-control form-control-success" name="product_hsn_no" type="text" value={editedData.product_hsn_no} onChange={(event) => this.handleInputChange(event)} />
                {isError && !editedData.product_hsn_no ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
              <label className="col-sm-2 col-form-label text-right"><strong>HSN No. : </strong></label>
                <div className="col-sm-6 col-form-label">
                <div><span>{data.product_hsn_no}</span></div>
                </div>
              </div>
            }
            {/* Product Rate */}
            {isEditable &&
              <div className="form-group row has-success">
              <label className="col-sm-2 col-form-label text-right"><strong>Rate : </strong></label>
                <div className="col-sm-6">
                <input className="form-control form-control-success" name="product_rate" type="number" min="0" value={editedData.product_rate} onChange={(event) => this.handleInputChange(event)} />
                {isError && !editedData.product_rate ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
              <label className="col-sm-2 col-form-label text-right"><strong>Rate : </strong></label>
                <div className="col-sm-6 col-form-label">
                  <div><span>{data.product_rate}</span></div>
                </div>
              </div>
            }
            {/* Product Unit */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Unit : </strong></label>
                <div className="col-sm-6">
                <input className="form-control form-control-success" name="product_unit" type="text" value={editedData.product_unit} onChange={(event) => this.handleInputChange(event)} />
                {/* {isError && !editedData.product_unit ? <div className="text-right ajpatel-error">This field is required.</div> : ""} */}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>Unit : </strong></label>
                <div className="col-sm-6 col-form-label">
                  <div><span>{data.product_unit}</span></div>
                </div>
              </div>
            }
            {/* CGST */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>CGST : </strong></label>
                <div className="col-sm-6">
                <input className="form-control form-control-success" name="product_cgst" type="number" min="0" value={editedData.product_cgst} onChange={(event) => this.handleInputChange(event)} />
                {isError && !editedData.product_cgst ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>CGST : </strong></label>
                <div className="col-sm-6 col-form-label">
                  <div><span>{data.product_cgst}</span></div>
                </div>
              </div>
            }
            {/* SGST */}
            {isEditable &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>SGST : </strong></label>
                <div className="col-sm-6">
                  <input className="form-control form-control-success" name="product_sgst" type="number" min="0" value={editedData.product_sgst} onChange={(event) => this.handleInputChange(event)} />
                {isError && !editedData.product_sgst ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </div>
              </div>
            }
            {!isEditable && !isLoading &&
              <div className="form-group row has-success">
                <label className="col-sm-2 col-form-label text-right"><strong>SGST : </strong></label>
                <div className="col-sm-6 col-form-label">
                  <div><span>{data.product_sgst}</span></div>
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
        <div><p>{data.product_id}</p></div>
        :
        <div>{!isLoading ? <p>{data.product_id}</p> : '' }</div>
        }
        {isEditable
        ?
        <div>
        <input name="product_name" type="text" value={editedData.product_name} onChange={(event) => this.handleInputChange(event)}/>
        {isError && !editedData.product_name ? "This field is required." : ""}
        </div>
        :
        <div>{!isLoading ? <p>{data.product_name}</p> : '' }</div>
        }
        {isEditable
        ?
        <div>
        <input name="product_hsn_no" type="text" value={editedData.product_hsn_no} onChange={(event) => this.handleInputChange(event)}/>
        {isError && !editedData.product_hsn_no ? "This field is required." : ""}
        </div>
        :
        <div>{!isLoading ? <p>{data.product_hsn_no}</p> : '' }</div>
        }
        {isEditable
        ?
        <div>
        <input name="product_rate" type="number" min="0" value={editedData.product_rate} onChange={(event) => this.handleInputChange(event)}/>
        {isError && !editedData.product_rate ? "This field is required." : ""}
        </div>
        :
        <div>{!isLoading ? <p>{data.product_rate}</p> : '' }</div>
        }
        {isEditable
        ?
        <div>
        <input name="product_unit" type="text" value={editedData.product_unit} onChange={(event) => this.handleInputChange(event)}/>
        {isError && !editedData.product_unit ? "This field is required." : ""}
        </div>
        :
        <div>{!isLoading ? <p>{data.product_unit}</p> : '' }</div>
        }
        {isEditable
        ?
        <div>
        <input name="product_cgst" type="number" min="0" value={editedData.product_cgst} onChange={(event) => this.handleInputChange(event)}/>
        {isError && !editedData.product_cgst ? "This field is required." : ""}
        </div>
        :
        <div>{!isLoading ? <p>{data.product_cgst}</p> : '' }</div>
        }
        {isEditable
        ?
        <div>
        <input name="product_sgst" type="number" min="0" value={editedData.product_sgst} onChange={(event) => this.handleInputChange(event)}/>
        {isError && !editedData.product_sgst ? "This field is required." : ""}
        </div>
        :
        <div>{!isLoading ? <p>{data.product_sgst}</p> : '' }</div>
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