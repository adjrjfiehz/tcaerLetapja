import React, { Component } from 'react';
import { invoiceCreate, partyList, partyView, productList } from '../../../rest/Rest';
import { getSessionStorage, convertRsIntoWords, roundOfNumber } from '../../../commons/utils/Utils';
// import { getSessionStorage, convertRsIntoWords, precisionRound } from '../../../commons/utils/Utils';
import { loginToken,
    userLoginToken,
    partyId,
    invoiceDate,
    roundOf,
    invoiceNumber,
    truckNo,
    transport,
    lRNo,
    subTotal,
    totalCgst,
    totalIgst,
    totalSgst,
    rsInWord,
    total,
    iiJsonData
  } from '../../../commons/constants/Constants';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class SalesCreate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                party_id: "",
                invoice_date: "",
                round_of: "",
                invoice_number: "",
                truck_no: "",
                transport: "",
                l_r_no: "",
                sub_total: "",
                total_cgst: "",
                total_sgst: "",
                total_igst: "0",
                rs_in_word: "",
                total: "",
                ii_json_data: []
            },
            itemData: {
                max_ii_id: "",
                ii_id: "",
                ii_product_name: "",
                ii_hsn_no: "",
                ii_rate: "",
                ii_qnt: "",
                ii_unit: "",
                ii_igst: "0",
                ii_cgst: "",
                ii_sgst: "",
                ii_amount: ""
            },
            tempDate: moment(),
            isDatePickerOpen: false,
            isLoading: false,
            errorMessage: '',
            isError: false,
            isPartyLoading: false,
            partyList: '',
            partyData: '',
            partyErrorMessage: '',
            isProductLoading: false,
            productList: '',
            productErrorMessage: '',
            addProductErrorMessage: '123'
        }
        
        // Important note : when you change state in any object then do not use below
        // this.state({data : {abc: "hi"}})
        // use below
        // this.setState(prevState => ({ data: { ...prevState.data, abc: "hii" } }));

        this.handleInputChange = this.handleInputChange.bind(this);
        this.onCancleClick = this.onCancleClick.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.createInvoiceData = this.createInvoiceData.bind(this);
        this.getPartyData = this.getPartyData.bind(this);
        this.handleProductInputChange = this.handleProductInputChange.bind(this);
        this.onAddProductClick = this.onAddProductClick.bind(this);
        this.getProductData = this.getProductData.bind(this);
        this.partyOptionData = this.partyOptionData.bind(this);
        this.onPartyChange = this.onPartyChange.bind(this);
        this.getPartyView = this.getPartyView.bind(this);
        this.productOptionData = this.productOptionData.bind(this);
        this.onProductChange = this.onProductChange.bind(this);
        this.tableBody = this.tableBody.bind(this);
        this.onDeleteProductClick = this.onDeleteProductClick.bind(this);
        this.onAddProductClick = this.onAddProductClick.bind(this); 
        this.handleDateChange = this.handleDateChange.bind(this);
        this.toggleCalendar = this.toggleCalendar.bind(this);
    }

    componentDidMount() {
        this.getPartyData();
        this.getProductData();
        this.onAddProductClick();
        this.setState(prevState => ({ data: { ...prevState.data, invoice_date: this.state.tempDate.format("DD-MMM-YYYY") } }));
    }

    getPartyData() {
        const self = this;
        self.setState({isPartyLoading: true});
    
        if(getSessionStorage(userLoginToken)) {
          var FormData = require('form-data');
          var form = new FormData();
          form.append(loginToken, getSessionStorage(userLoginToken));   
    
          let responseStatus;
          partyList(form)
            .then(function(response) {
              responseStatus = response.status;
              return response.text();
            }).then(function(response) {
              self.setState({isPartyLoading: false});
    
              if(responseStatus === 200) {
                let responseObj = JSON.parse(response);
    
                if(responseObj.SUCCESS === "TRUE") {
                  self.setState({partyList: responseObj.DATA.sort((arg1, arg2) => arg1.party_id > arg2.party_id)});
                } else {
                  self.setState({partyErrorMessage: responseObj.MESSAGE});  
                }
              } else {
                self.setState({partyErrorMessage: "Something went wrong trying to get data."});
                console.log('Response Status : ', responseStatus);
              }
            }).catch(function(ex) {
              self.setState({isPartyLoading: false});
              self.setState({partyErrorMessage: "Something went wrong parsing data."});
              console.log('Parsing Failed : ', ex);
            })
        } else {
          self.setState({isPartyLoading: false});
          self.setState({partyErrorMessage: "Login Token is missing."});
        }
    }

    getProductData() {
        const self = this;
        self.setState({isProductLoading: true});
    
        if(getSessionStorage(userLoginToken)) {
          var FormData = require('form-data');
          var form = new FormData();
          form.append(loginToken, getSessionStorage(userLoginToken));    
    
          let responseStatus;
          productList(form)
            .then(function(response) {
              responseStatus = response.status;
              return response.text();
            }).then(function(response) {
              self.setState({isProductLoading: false});
    
              if(responseStatus === 200) {
                let responseObj = JSON.parse(response);
    
                if(responseObj.SUCCESS === "TRUE") {
                  self.setState({productList: responseObj.DATA.sort((arg1, arg2) => arg1.product_id > arg2.product_id)});
                } else {
                  self.setState({productErrorMessage: responseObj.MESSAGE});  
                }
              } else {
                self.setState({productErrorMessage: "Something went wrong trying to get data."});
                console.log('Response Status : ', responseStatus);
              }
            }).catch(function(ex) {
              self.setState({isProductLoading: false});
              self.setState({productErrorMessage: "Something went wrong parsing data."});
              console.log('Parsing Failed : ', ex);
            })
        } else {
          self.setState({isProductLoading: false});
          self.setState({productErrorMessage: "Login Token is missing."});
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        //this.setState({ data: { ...this.state.data, [name]: value} });
        let data = Object.assign({}, this.state.data);    //creating copy of object
        
        if (name === "sub_total" || name === "total_cgst" || name === "total_sgst") {
            data[name] = parseFloat(value).toFixed(2);
            let tempTotal = +data.sub_total + +data.total_cgst + +data.total_sgst;
            // data.total = parseFloat(precisionRound(tempTotal, -1)).toFixed(2);
            data.total = parseFloat(roundOfNumber(tempTotal)).toFixed(2);
            data.round_of = parseFloat(data.total - tempTotal).toFixed(2);
            data.rs_in_word = convertRsIntoWords(parseInt(data.total, 10));
        }else if (name === "round_of") {
            data.round_of = parseFloat(value).toFixed(2);
            let tempTotal = +data.sub_total + +data.total_cgst + +data.total_sgst;
            data.total = parseFloat(tempTotal + +data.round_of).toFixed(2);
            data.rs_in_word = convertRsIntoWords(parseInt(data.total, 10));
        } else if (name === "total") {
            data.total = parseFloat(value).toFixed(2);
            data.rs_in_word = convertRsIntoWords(parseInt(data.total, 10));
        } else if (name === "rs_in_word") {
            data.rs_in_word = value;
        } else {
            data[name] = value;
        }

        this.setState({ data });
    }

    onCancleClick() {
        this.props.changeComponent("list", null);
    }
    
    onSaveClick(data) {
        if (this.validateProductData(data)) {
            this.createInvoiceData(data);
        } else {
            this.setState({ isError: true });
        }
    }

    validateProductData(data) {
        if (!data.party_id || !data.invoice_date || !data.invoice_number || !data.sub_total ||
            !data.total_cgst || !data.total_sgst || !data.total) {
                    return false;
        }
        const ii_json_data = data.ii_json_data;
        for (var i = 0; i < ii_json_data.length; i++) {
            if (!ii_json_data[i].ii_product_name || !ii_json_data[i].ii_rate || !ii_json_data[i].ii_qnt || 
                !ii_json_data[i].ii_cgst || !ii_json_data[i].ii_sgst || !ii_json_data[i].ii_amount ) {
                    return false;
            }
        }
        return true;
    }

    createInvoiceData(data) {
        const self = this;
        self.setState({isLoading: true});

        var FormData = require('form-data');
        var form = new FormData();
        form.append(loginToken, getSessionStorage(userLoginToken));
        form.append(partyId, data.party_id);
        form.append(invoiceDate, data.invoice_date);
        form.append(roundOf, data.round_of);
        form.append(invoiceNumber, data.invoice_number);
        form.append(truckNo, data.truck_no);
        form.append(transport, data.transport);
        form.append(lRNo, data.l_r_no);
        form.append(subTotal, data.sub_total);
        form.append(totalCgst, data.total_cgst);
        form.append(totalSgst, data.total_sgst);
        form.append(totalIgst, data.total_igst);
        form.append(rsInWord, data.rs_in_word);
        form.append(total, data.total);
        form.append(iiJsonData, JSON.stringify(data.ii_json_data));

        let responseStatus;
        invoiceCreate(form)
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

    partyOptionData(partyList) {
        let partyOptionData = (partyList.map((party) =>
            <option key={party.party_id} value={party.party_id}> {party.party_name} </option>
        ))
        partyOptionData.splice(0, 0, <option key='' value=''></option>)

        return partyOptionData;
    }

    onPartyChange(partyId) {
        this.setState({partyData: ''});
        if(partyId) {
            this.getPartyView(partyId);
        }
    }

    getPartyView(id) {
        const self = this;
        self.setState({isPartyLoading: true} );  
    
        if(getSessionStorage(userLoginToken)) {
          var FormData = require('form-data');
          var form = new FormData();
          form.append(loginToken, getSessionStorage(userLoginToken));
          form.append(partyId, id);  
    
          let responseStatus;
          partyView(form)
            .then(function(response) {
              responseStatus = response.status;
              return response.text();
            }).then(function(response) {
              self.setState({isPartyLoading: false});
    
              if(responseStatus === 200) {
                let responseObj = JSON.parse(response);
    
                if(responseObj.SUCCESS === "TRUE") {
                  self.setState(prevState => ({data: {...prevState.data, party_id: responseObj.DATA[0].party_id}}));
                  self.setState({ partyData: responseObj.DATA[0]});
                } else {
                  self.setState({ partyErrorMessage: responseObj.MESSAGE});
                }
              } else {
                self.setState({ partyErrorMessage: "Something went wrong trying to get data."});
                console.log('Response Status : ', responseStatus);
              }
            }).catch(function(ex) {
              self.setState({ isPartyLoading: false});
              self.setState({ partyErrorMessage: "Something went wrong parsing data."});
              console.log('Parsing Failed : ', ex);
            })
        } else {
          self.setState({ isPartyLoading: false});
          self.setState({ partyErrorMessage: "Login Token is missing."});
        }
    }

    productOptionData(productList) {
        let productOptionData = (productList.map((product, key) =>
            <option key={key} value={key}> {product.product_name} </option>
        ))
        productOptionData.splice(0, 0, <option key='' value=''></option>)
        
        return productOptionData;
    }

    onProductChange(key, productData) {
        this.setState({ addProductErrorMessage: "" });
        let data = Object.assign({}, this.state.data);    //creating copy of object
        let ii_json_data = data.ii_json_data;
        ii_json_data[key].max_ii_id = key+1;
        if(productData) {
            ii_json_data[key].ii_id = productData.product_id;
            ii_json_data[key].ii_product_name = productData.product_name;
            ii_json_data[key].ii_hsn_no = productData.product_hsn_no;
            ii_json_data[key].ii_rate = productData.product_rate;
            ii_json_data[key].ii_qnt = '';
            ii_json_data[key].ii_unit = productData.product_unit;
            ii_json_data[key].ii_cgst = productData.product_cgst;
            ii_json_data[key].ii_sgst = productData.product_sgst;
            ii_json_data[key].ii_igst = "0";
            ii_json_data[key].ii_amount = productData.product_amount ? productData.product_amount : "";
        } else {
            ii_json_data[key].ii_id = '';
            ii_json_data[key].ii_product_name = '';
            ii_json_data[key].ii_hsn_no = '';
            ii_json_data[key].ii_rate = '';
            ii_json_data[key].ii_qnt = '';
            ii_json_data[key].ii_unit = '';
            ii_json_data[key].ii_cgst = '';
            ii_json_data[key].ii_sgst = '';
            ii_json_data[key].ii_igst = '0';
            ii_json_data[key].ii_amount = '';
        }
        this.setState({data});
        this.setState({itemData: {}})
    }

    handleProductInputChange(key, event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let data = Object.assign({}, this.state.data);    //creating copy of object
        let ii_json_data = data.ii_json_data;
        ii_json_data[key][name] = value;
        if(name !== "ii_amount") {
            if ((name === "ii_qnt" || name === "ii_rate") && (ii_json_data[key]["ii_qnt"] && ii_json_data[key]["ii_rate"])) {
                ii_json_data[key]["ii_amount"] = parseFloat(ii_json_data[key]["ii_qnt"]) * parseFloat(ii_json_data[key]["ii_rate"]);
                ii_json_data[key]["ii_amount"] = ii_json_data[key]["ii_amount"].toFixed(2);
            }
        } else {
            if (ii_json_data[key]["ii_amount"]) {
                ii_json_data[key][name] = parseFloat(ii_json_data[key][name]).toFixed(2);
            }
        }
        
        // Calculate total data
        if (name !== "ii_hsn_no") {
            let subTotal = 0;
            let totalCgst = 0;
            let totalSgst = 0;
            let roundOf = 0;
            let total = 0;
            for (var i = 0; i < ii_json_data.length; i++) {
                subTotal = +subTotal + +ii_json_data[i]["ii_amount"];
                totalCgst = +totalCgst + ((+ii_json_data[i]["ii_cgst"] * +ii_json_data[i]["ii_amount"]) / 100);
                totalSgst = +totalSgst + ((+ii_json_data[i]["ii_sgst"] * +ii_json_data[i]["ii_amount"]) / 100);
                let tempTotal = +subTotal + +totalCgst + +totalSgst;
                // total = precisionRound(tempTotal, -1);
                total = roundOfNumber(tempTotal);
                roundOf = total - tempTotal;
                roundOfNumber(tempTotal);
            }
            data.sub_total = parseFloat(subTotal).toFixed(2);
            data.total_cgst = parseFloat(totalCgst).toFixed(2);
            data.total_sgst = parseFloat(totalSgst).toFixed(2);
            data.round_of = parseFloat(roundOf).toFixed(2);
            data.total = parseFloat(total).toFixed(2);
            data.rs_in_word = convertRsIntoWords(parseInt(data.total, 10));
        }
        this.setState({data});
    }

    tableBody(data, productList, isError) {
        let productOptionData = productList ? this.productOptionData(productList) : '';
        if(data && data.ii_json_data && data.ii_json_data.length > 0) {
            const tableBody = data.ii_json_data.map((productData, key) =>
            <tr key={key}>
                <td className="id-td">{key+1}</td>
                <td>
                        <select className="form-control" onChange={(event) => this.onProductChange(key, productList[event.target.value])}>
                        {productOptionData}
                    </select>
                    {isError && !productData.ii_product_name ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </td>
                <td>
                    <input className="form-control form-control-success" name="ii_hsn_no" type="text" value={productData.ii_hsn_no ? productData.ii_hsn_no : ''} onChange={(event) => this.handleProductInputChange(key, event)}/>
                    {isError && !productData.ii_hsn_no ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </td>
                <td>
                    <input className="form-control form-control-success" name="ii_qnt" min="0" type="number" value={productData.ii_qnt ? productData.ii_qnt : ''} onChange={(event) => this.handleProductInputChange(key, event)}/>
                    {isError && !productData.ii_qnt ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </td>
                <td>
                    <input className="form-control form-control-success" name="ii_rate" min="0" type="number" value={productData.ii_rate ? productData.ii_rate : ''} onChange={(event) => this.handleProductInputChange(key, event)}/>
                    {isError && !productData.ii_rate ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </td>
                <td>
                    <input className="form-control form-control-success" name="ii_cgst" min="0" type="number" value={productData.ii_cgst ? productData.ii_cgst : ''} onChange={(event) => this.handleProductInputChange(key, event)}/>
                    {isError && !productData.ii_cgst ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </td>
                <td>
                    <input className="form-control form-control-success" name="ii_sgst" min="0" type="number" value={productData.ii_sgst ? productData.ii_sgst : ''} onChange={(event) => this.handleProductInputChange(key, event)}/>
                    {isError && !productData.ii_sgst ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </td>
                <td>
                    <input className="form-control form-control-success" name="ii_amount" min="0" type="number" value={productData.ii_amount ? productData.ii_amount : ''} onChange={(event) => this.handleProductInputChange(key, event)}/>
                    {isError && !productData.ii_amount ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                </td>
                <td>
                    <button className="form-control form-control-success btn-delete cursor-pointer" onClick={() => this.onDeleteProductClick(key)}>Delete</button>
                </td>
            </tr>
            );
    
            return tableBody;
        }
    }

    onDeleteProductClick(key) {
        if (this.state.data.ii_json_data.length > 1) {
            let new_ii_json_data = []
            for (var i = 0; i < this.state.data.ii_json_data.length; i++) {
                if (i !== key) {
                    new_ii_json_data.push(this.state.data.ii_json_data[i]);
                }
            }
            //this.setState({ data: { ii_json_data: new_ii_json_data } });
            this.setState(prevState => ({ data: { ...prevState.data, ii_json_data: new_ii_json_data } }));
        } else {
            this.setState({ addProductErrorMessage: "At least one product is required." });
        }
    }

    onAddProductClick() {
        let data = Object.assign({}, this.state.data);    //creating copy of object
        let ii_json_data = data.ii_json_data;
        let isEmpty = false;
        for (var i = 0; i < ii_json_data.length; i++) {
            if (!ii_json_data[i] || !ii_json_data[i].ii_id) {
                isEmpty = true;
                break;
            }
        }
        if(!isEmpty) {
            this.setState({ addProductErrorMessage: "" });
            const itemData = this.state.itemData;
            ii_json_data.push(itemData)
            this.setState({ data });
            this.setState({ itemData: {} });
        } else {
            this.setState({ addProductErrorMessage : "All list should select product."});
        }
        
    }

    handleDateChange(date) {
        this.setState(prevState => ({ data: { ...prevState.data, invoice_date: date.format("DD-MMM-YYYY") } }));
        this.setState({ tempDate : date});
        this.toggleCalendar();
    }

    toggleCalendar (e) {
        e && e.preventDefault()
        this.setState({ isDatePickerOpen: !this.state.isDatePickerOpen});
    }
  
    render() {
        const { isLoading, errorMessage, data, isDatePickerOpen, isError, partyList, partyData, 
            isPartyLoading, partyErrorMessage, isProductLoading, productList, 
            productErrorMessage, addProductErrorMessage, tempDate } = this.state;
        let partyOptionData = partyList ? this.partyOptionData(partyList) : '';
        const tableBody = this.tableBody(data, productList, isError);
        
        return (
        <div className="salescreate-wrapper">
            <div className="row salescreate-container">
                <div className="col-sm-11">
                    <div className="widget-box widget-color-blue2 ui-sortable-handle pagination_list_card header-card">
                        <div className="widget-header row">
                            <h5 className="widget-title-bigger-lighter ajpatel_primary_color col-sm-2">Sales Create</h5>
                            <div className="msg-wrapper col-sm-9">
                                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                {isLoading ? <div className="alert alert-info"><div className="ajpatel-loader"></div><span className="loader-msg">Loading... Please wait.</span></div> : ""}
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-md-6">
                            <div className="row">
                                <label className="col-sm-4 col-form-label text-right"><strong>Invoice Number : </strong></label>
                                <div className="col-sm-8">
                                    <input name="invoice_number" type="text" value={data.invoice_number} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success"/>
                                    {isError && !data.invoice_number ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <label className="col-sm-4 col-form-label text-right"><strong>Invoice Date : </strong></label>
                                <div className="col-sm-8">
                                    <button className="form-control cursor-pointer" 
                                        onClick={this.toggleCalendar}>
                                        {data.invoice_date}
                                    </button>
                                    {
                                        isDatePickerOpen && (
                                            <DatePicker
                                                selected={tempDate}
                                                onChange={this.handleDateChange}
                                                onClickOutside={this.toggleCalendar}
                                                withPortal
                                                inline />
                                        )
                                    }
                                    {isError && !data.invoice_date ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="party-wrapper">
                        <div className="widget-box widget-color-blue2 ui-sortable-handle pagination_list_card header-card">
                            <div className="widget-header row">
                                <h5 className="widget-title-bigger-lighter ajpatel_primary_color col-sm-3">Party Information : </h5>
                                <div className="msg-wrapper col-sm-9">
                                    {partyErrorMessage && <div className="alert alert-danger">{partyErrorMessage}</div>}
                                    {isPartyLoading ? <div className="alert alert-info"><div className="ajpatel-loader"></div><span className="loader-msg">Loading... Please wait.</span></div> : ""}
                                </div>
                            </div>
                        </div>
                        {/* {isPartyLoading ? <div className="alert alert-info"><div className="ajpatel-loader"></div><span className="loader-msg">Loading... Please wait.</span></div> : ""}
                        {partyErrorMessage && <div className="alert alert-danger">{partyErrorMessage}</div>} */}
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label text-right"><strong>Select Party : </strong></label>
                                <div className="col-sm-6">
                                <select className="form-control" onChange={(event) => this.onPartyChange(event.target.value)}>
                                    {partyOptionData}
                                </select>
                                {isError && !isPartyLoading && !partyData ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                            </div>
                        </div>
                        {partyData.party_id &&
                            <div>
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <div className="row">
                                            <label className="col-sm-4 col-form-label text-right"><strong>Name : </strong></label>
                                            <div className="col-sm-8 col-form-label">
                                                <div><span>{partyData.party_name}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <label className="col-sm-4 col-form-label text-right"><strong>Id : </strong></label>
                                            <div className="col-sm-8 col-form-label">
                                                <div><span>{partyData.party_id}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label text-right"><strong>Address : </strong></label>
                                    <div className="col-sm-6 col-form-label">
                                        <div>
                                            {partyData.party_id &&
                                                <div>
                                                    <span>{partyData.party_address}</span>
                                                    <span>{", "}</span>
                                                    <span>{partyData.party_city}</span>
                                                    <span>{", "}</span>
                                                    <span>{partyData.party_state}</span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="form-group row">
                        <div className="col-md-6">
                            <div className="row">
                                <label className="col-sm-4 col-form-label text-right"><strong>Challan No. : </strong></label>
                                <div className="col-sm-8">
                                    <input name="transport" type="text" value={data.transport} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                                    {/* {isError && !data.transport ? <div className="text-right ajpatel-error">This field is required.</div> : ""} */}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <label className="col-sm-4 col-form-label text-right"><strong>Vehicle No. : </strong></label>
                                <div className="col-sm-8">
                                    <input name="truck_no" type="text" value={data.truck_no} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                                    {/* {isError && !data.truck_no ? <div className="text-right ajpatel-error">This field is required.</div> : ""} */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="product-wrapper">
                        <div className="row">
                            <div className="msg-wrapper offset-md-2 col-sm-9">
                                {productErrorMessage && <div className="alert alert-danger">{productErrorMessage}</div>}
                                {isProductLoading ? <div className="alert alert-info"><div className="ajpatel-loader"></div><span className="loader-msg">Loading... Please wait.</span></div> : ""}
                            </div>
                        </div>
                        <div className="ajpatel-table-wrapper pagination_body table-responsive">
                            <div className="col-xs-12">
                                <table id="simple-table" className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th className="hsn-column">HSN No.</th>
                                            <th className="quantity-column">Quantity</th>
                                            <th className="rate-column">Rate</th>
                                            <th className="cgst-column">CGST</th>
                                            <th className="sgst-column">SGST</th>
                                            <th className="amount-column">Amount</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableBody}
                                    </tbody>
                                </table>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-md-2">
                                                <button className="btn btn-xs btn-ajpatel font-white" onClick={() => this.onAddProductClick()}>+ Add Product</button>
                                        </div>
                                        <div className="col-md-4">
                                            {addProductErrorMessage && <div className="alert alert-danger">{addProductErrorMessage}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="total-wrapper">
                        <div className="form-group row">
                            <label className="col-sm-8 col-form-label text-right"><strong>Sub Total : </strong></label>
                            <div className="col-sm-4">
                                    <input name="sub_total" min="0" type="number" value={data.sub_total} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                                {isError && !data.sub_total ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-8 col-form-label text-right"><strong>Total CGST : </strong></label>
                            <div className="col-sm-4">
                                    <input name="total_cgst" min="0" type="number" value={data.total_cgst} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                                {isError && !data.total_cgst ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-8 col-form-label text-right"><strong>Total SGST : </strong></label>
                            <div className="col-sm-4">
                                    <input name="total_sgst" min="0" type="number" value={data.total_sgst} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                                {isError && !data.total_sgst ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-8 col-form-label text-right"><strong>Round Of : </strong></label>
                            <div className="col-sm-4">
                                <input name="round_of" min="0" type="number" value={data.round_of} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                                {/* {isError && !data.round_of ? <div className="text-right ajpatel-error">This field is required.</div> : ""} */}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-8 col-form-label text-right"><strong>Total : </strong></label>
                            <div className="col-sm-4">
                                <input name="total" min="0" type="number" value={data.total} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                                {isError && !data.total ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label text-right"><strong>Rs in Word : </strong></label>
                            <div className="col-sm-8">
                                <input name="rs_in_word" type="text" value={data.rs_in_word} onChange={(event) => this.handleInputChange(event)} className="form-control form-control-success" />
                                {isError && !data.rs_in_word ? <div className="text-right ajpatel-error">This field is required.</div> : ""}
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="offset-sm-5 col-sm-1">
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
                {isPartyLoading ? <p>Loading... Please wait.</p> : ""}
                <p>{partyErrorMessage}</p>
                <select onChange={(event) => this.onPartyChange(event.target.value)}>
                    {partyOptionData}
                </select>
                {isError && !isPartyLoading && !partyData ? "This field is required." : ""}
            </div>
            {
                partyData
                ?
                <div>
                    <div>
                        <p>{partyData.party_id}</p>
                    </div>
                    <div>
                        <p>{partyData.party_name}</p>
                    </div>
                    <div>
                        <p>{partyData.party_contact_person}</p>
                    </div>
                    <div>
                        <p>{partyData.party_gstin}</p>
                    </div>
                    <div>
                        <p>{partyData.party_pan_no}</p>
                    </div>
                    <div>
                        <p>{partyData.party_mobile}</p>
                    </div>
                    <div>
                        <p>{partyData.party_address}</p>
                    </div>
                    <div>
                        <p>{partyData.party_city}</p>
                    </div>
                    <div>
                        <p>{partyData.party_state}</p>
                    </div>
                    <div>
                        <p>{partyData.party_pincode}</p>
                    </div>
                </div>
                :
                ''
            }
            <div>
                <button
                    onClick={this.toggleCalendar}>
                    {data.invoice_date}
                </button>
                {
                    isDatePickerOpen && (
                    <DatePicker
                        selected={tempDate}
                        onChange={this.handleDateChange}
                        onClickOutside={this.toggleCalendar}
                        withPortal
                        inline />
                    )
                }
                {isError && !data.invoice_date ? "This field is required." : ""}
            </div>
            <div>
                <input name="invoice_number" type="text" value={data.invoice_number} onChange={(event) => this.handleInputChange(event)}/>
                {isError && !data.invoice_number ? "This field is required." : ""}
            </div>
            <div>
                <input name="truck_no" type="text" value={data.truck_no} onChange={(event) => this.handleInputChange(event)}/>
                {isError && !data.truck_no ? "This field is required." : ""}
            </div>
            <div>
                <input name="transport" type="text" value={data.transport} onChange={(event) => this.handleInputChange(event)}/>
                {isError && !data.transport ? "This field is required." : ""}
            </div>
            <div>
                <input name="l_r_no" type="text" value={data.l_r_no} onChange={(event) => this.handleInputChange(event)}/>
                {isError && !data.l_r_no ? "This field is required." : ""}
            </div>
            <div>
                {isProductLoading ? <p>Loading... Please wait.</p> : ""}
                <p>{productErrorMessage}</p>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>HSN No.</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>CGST</th>
                            <th>SGST</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableBody}
                    </tbody>
                </table>
                <button onClick={() => this.onAddProductClick()}>+</button>
                    <p>{addProductErrorMessage}</p>
            </div>
            <div>
                <input name="sub_total" min="0" type="number" value={data.sub_total} onChange={(event) => this.handleInputChange(event)} />
                {isError && !data.sub_total ? "This field is required." : ""}
            </div>
            <div>
                <input name="total_cgst" min="0" type="number" value={data.total_cgst} onChange={(event) => this.handleInputChange(event)} />
                {isError && !data.total_cgst ? "This field is required." : ""}
            </div>
            <div>
                <input name="total_sgst" min="0" type="number" value={data.total_sgst} onChange={(event) => this.handleInputChange(event)} />
                {isError && !data.total_sgst ? "This field is required." : ""}
            </div>
            <div>
                <input name="round_of" min="0" type="number" value={data.round_of} onChange={(event) => this.handleInputChange(event)} />
                {isError && !data.round_of ? "This field is required." : ""}
            </div>
            <div>
                <input name="total" min="0" type="number" value={data.total} onChange={(event) => this.handleInputChange(event)} />
                {isError && !data.total ? "This field is required." : ""}
            </div>
            <div>
                <input name="rs_in_word" type="text" value={data.rs_in_word} onChange={(event) => this.handleInputChange(event)} />
                {isError && !data.rs_in_word ? "This field is required." : ""}
            </div>
            <div>
                <button onClick={() => this.onCancleClick()}>Cancle</button>
                <button onClick={() => this.onSaveClick(data)}>Save</button>
            </div> */}
        </div>
        );
    }
}
