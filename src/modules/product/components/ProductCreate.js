import React, { Component } from 'react';
import { productCreate } from '../../../rest/Rest';
import { getSessionStorage } from '../../../commons/utils/Utils';
import { loginToken,
    userLoginToken,
    productName,
    productHsnNo,
    productRate,
    productUnit,
    productCGST,
    productSGST,
    productIGST
  } from '../../../commons/constants/Constants';

export default class ProductCreate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                product_name: "",
                product_hsn_no: "",
                product_rate: "",
                product_unit: "",
                product_cgst: "",
                product_sgst: "",
                product_igst: "0"
            },
            isLoading: false,
            errorMessage: '',
            isError: false
        }
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onCancleClick = this.onCancleClick.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.createProductData = this.createProductData.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({ data: { ...this.state.data, [name]: value} });
    }

    onCancleClick() {
        this.props.changeComponent("list", null);
    }
    
    onSaveClick(data) {
        if(data.product_name && 
            data.product_hsn_no && 
            data.product_rate &&
            // data.product_unit &&
            data.product_cgst &&
            data.product_sgst) {
            this.createProductData(data);
        } else {
          this.setState({isError: true});
        }
    }

    createProductData(data) {
        const self = this;
        self.setState({isLoading: true});

        var FormData = require('form-data');
        var form = new FormData();
        form.append(loginToken, getSessionStorage(userLoginToken));
        form.append(productName, data.product_name);
        form.append(productHsnNo, data.product_hsn_no);
        form.append(productRate, data.product_rate);
        form.append(productUnit, data.product_unit);
        form.append(productCGST, data.product_cgst);
        form.append(productSGST, data.product_sgst);
        form.append(productIGST, data.product_igst);

        let responseStatus;
        productCreate(form)
        .then(function(response) {
            responseStatus = response.status;
            return response.text();
        }).then(function(response) {
            self.setState({isLoading: false});

            if(responseStatus === 200) {
            let responseObj = JSON.parse(response);

            if(responseObj.SUCCESS === "TRUE") {
                self.props.changeComponent("list", null);
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

    render() {
        const { isLoading, errorMessage, data, isError } = this.state;
        
        return (
        <div className="productcreate-wrapper">
            <div className="row productcreate-container">
                <div className="col-sm-11">
                    <div className="widget-box widget-color-blue2 ui-sortable-handle pagination_list_card header-card">
                        <div className="widget-header product_list row">
                            <h5 className="widget-title-bigger-lighter product_name ajpatel_primary_color col-sm-2">Product Create</h5>
                            <div className="msg-wrapper col-sm-9">
                                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                {isLoading ? <div className="alert alert-info"><div className="ajpatel-loader"></div><span className="loader-msg">Loading... Please wait.</span></div> : ""}
                            </div>
                        </div>
                    </div>
                    {/* Product Name */}
                    <div className="form-group row has-success">
                        <label className="col-sm-2 col-form-label text-right"><strong>Product Name : </strong></label>
                        <div className="col-sm-6">
                            <input name="product_name" type="text" value={data.product_name} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success"/>
                            {isError && !data.product_name ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                        </div>
                    </div>
                    {/* HSN No */}
                    <div className="form-group row has-success">
                        <label className="col-sm-2 col-form-label text-right"><strong>HSN No. : </strong></label>
                        <div className="col-sm-6">
                            <input name="product_hsn_no" type="text" value={data.product_hsn_no} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                            {isError && !data.product_hsn_no ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                        </div>
                    </div>
                    {/* Rate */}
                    <div className="form-group row has-success">
                        <label className="col-sm-2 col-form-label text-right"><strong>Rate : </strong></label>
                        <div className="col-sm-6">
                            <input name="product_rate" type="number" min="0" value={data.product_rate} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                            {isError && !data.product_rate ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                        </div>
                    </div>
                    {/* Unit */}
                    <div className="form-group row has-success">
                        <label className="col-sm-2 col-form-label text-right"><strong>Unit : </strong></label>
                        <div className="col-sm-6">
                            <input name="product_unit" type="text" value={data.product_unit} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                            {/* {isError && !data.product_unit ? <div className="text-right ajpatel-error">This field is required.</div> : ""} */}
                        </div>
                    </div>
                    {/* CGST */}
                    <div className="form-group row has-success">
                        <label className="col-sm-2 col-form-label text-right"><strong>CGST : </strong></label>
                        <div className="col-sm-6">
                            <input name="product_cgst" type="number" min="0" value={data.product_cgst} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                            {isError && !data.product_cgst ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                        </div>
                    </div>
                    {/* SGST */}
                    <div className="form-group row has-success">
                        <label className="col-sm-2 col-form-label text-right"><strong>SGST : </strong></label>
                        <div className="col-sm-6">
                            <input name="product_sgst" type="number" min="0" value={data.product_sgst} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                            {isError && !data.product_sgst ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                        </div>
                    </div>
                    {/* Button */}
                    <div className="form-group row">
                        <div className="offset-sm-4 col-sm-1">
                            <button className="btn btn-xs btn-ajpatel font-white" onClick={() => this.onCancleClick()}>Cancle</button>
                        </div>
                        <div className="col-sm-1">
                            <button disabled={isLoading} className="btn btn-xs btn-ajpatel font-white" onClick={() => this.onSaveClick(data)}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* {isLoading ? <p>Loading... Please wait.</p> : ""}
            <p>{errorMessage}</p>
            <div>
                <input name="product_name" type="text" value={data.product_name} onChange={(event) => this.handleInputChange(event)}/>
                {isError && !data.product_name ? "This field is required." : ""}
            </div>
            <div>
                <input name="product_hsn_no" type="text" value={data.product_hsn_no} onChange={(event) => this.handleInputChange(event)}/>
                {isError && !data.product_hsn_no ? "This field is required." : ""}
            </div>
            <div>
                <input name="product_rate" type="number" min="0" value={data.product_rate} onChange={(event) => this.handleInputChange(event)}/>
                {isError && !data.product_rate ? "This field is required." : ""}
            </div>
            <div>
                <input name="product_unit" type="text" value={data.product_unit} onChange={(event) => this.handleInputChange(event)}/>
                {isError && !data.product_unit ? "This field is required." : ""}
            </div>
            <div>
                <input name="product_cgst" type="number" min="0" value={data.product_cgst} onChange={(event) => this.handleInputChange(event)}/>
                {isError && !data.product_cgst ? "This field is required." : ""}
            </div>
            <div>
                <input name="product_sgst" type="number" min="0" value={data.product_sgst} onChange={(event) => this.handleInputChange(event)}/>
                {isError && !data.product_sgst ? "This field is required." : ""}
            </div>
            <div>
                <button onClick={() => this.onCancleClick()}>Cancle</button>
                <button onClick={() => this.onSaveClick(data)}>Save</button>
            </div> */}
        </div>
        );
    }
}