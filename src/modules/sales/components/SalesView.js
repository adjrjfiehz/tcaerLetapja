import React, { Component } from 'react';
import moment from 'moment';

export default class SalesView extends Component {

  tableBody(data) {
    if(data && data.length > 0) {
        const tableBody = data.map((data, key) =>
        <tr key={key}>
            <td>{key+1}</td>
            <td>{data.ii_product_name}</td>
            <td>{data.ii_hsn_no}</td>
            <td>{data.ii_qnt}</td>
            <td>{data.ii_rate}</td>
            <td>{data.ii_cgst}</td>
            <td>{data.ii_sgst}</td>
            <td>{data.ii_amount}</td>
        </tr>
        );

        return tableBody;
    }
  }

  onDownloadClick(url) {
    window.open(url, '_blank');
  }
  
  render() {
    const { data, isLoading, errorMessage } = this.props;
    const tableBody = this.tableBody(data.invoice_item_data);
    
    return (
      <div className="salesview-wrapper">
        <div className="row salesview-container">
          <div className="col-sm-11">
            <div className="widget-box widget-color-blue2 ui-sortable-handle pagination_list_card header-card">
              <div className="widget-header row">
                <h5 className="widget-title-bigger-lighter ajpatel_primary_color col-sm-2">Sales View</h5>
                <div className="msg-wrapper col-sm-8">
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                  {isLoading ? <div className="alert alert-info"><div className="ajpatel-loader"></div><span className="loader-msg">Loading... Please wait.</span></div> : ""}
                </div>
                <div className="widget-toolbar col-sm-2">
                  {!isLoading && <button className="btn btn-xs btn-ajpatel font-white" onClick={() => this.onDownloadClick(data.invoice_pdf)}>Download</button>}
                </div>
              </div>
            </div>
            {/* Invoice Number, Invoice Date */}
            {!isLoading &&
              <div className="form-group row">
                <div className="col-md-6">
                  <div className="row">
                    <label className="col-sm-4 col-form-label text-right"><strong>Invoice Number : </strong></label>
                    <div className="col-sm-8 col-form-label">
                      <div><span>{data.invoice_number}</span></div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <label className="col-sm-4 col-form-label text-right"><strong>Invoice Date : </strong></label>
                    <div className="col-sm-8 col-form-label">
                    <div><span>{moment.unix(data.invoice_date).format("DD-MMM-YYYY")}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            }
            {/* Party Information */}
            {!isLoading &&
              <div className="party-wrapper">
                <div className="widget-box widget-color-blue2 ui-sortable-handle pagination_list_card header-card">
                  <div className="widget-header row">
                    <h5 className="widget-title-bigger-lighter ajpatel_primary_color col-sm-3">Party Information : </h5>
                  </div>
                </div>
                <div>
                  <div className="form-group row">
                    <div className="col-md-6">
                      <div className="row">
                        <label className="col-sm-4 col-form-label text-right"><strong>Name : </strong></label>
                        <div className="col-sm-8 col-form-label">
                        <div><span>{data.invoice_party_name}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row">
                        <label className="col-sm-4 col-form-label text-right"><strong>Id : </strong></label>
                        <div className="col-sm-8 col-form-label">
                        <div><span>{data.invoice_party_id}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label text-right"><strong>Address : </strong></label>
                    <div className="col-sm-6 col-form-label">
                      <div>
                        <div>
                        <span>{data.invoice_party_address}</span>
                          <span>{", "}</span>
                        <span>{data.invoice_party_city}</span>
                          <span>{", "}</span>
                        <span>{data.invoice_party_state}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            {/* Transport, Vehicle No */}
            {!isLoading && 
              <div className="form-group row">
                <div className="col-md-6">
                  <div className="row">
                    <label className="col-sm-4 col-form-label text-right"><strong>Challan No. : </strong></label>
                    <div className="col-sm-8 col-form-label">
                      <div><span>{data.invoice_transport}</span></div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <label className="col-sm-4 col-form-label text-right"><strong>Vehicle No. : </strong></label>
                    <div className="col-sm-8 col-form-label">
                      <div><span>{data.invoice_truck_no}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            }
            {/* Product */}
            {!isLoading &&
              <div className="product-wrapper">
                <div className="ajpatel-table-wrapper pagination_body table-responsive">
                  <div className="col-xs-12">
                    <table id="simple-table" className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Name</th>
                          <th className="hsn-column">HSN No.</th>
                          <th className="quantity-column">Quantity</th>
                          <th className="rate-column">Rate</th>
                          <th className="cgst-column">CGST</th>
                          <th className="sgst-column">SGST</th>
                          <th className="amount-column">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableBody}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            }
            {/* Total */}
            {!isLoading &&
              <div className="total-wrapper">
                <div className="form-group row">
                  <label className="col-sm-8 col-form-label text-right"><strong>Sub Total : </strong></label>
                <div className="col-sm-4 col-form-label">
                  <div><span>{data.invoice_sub_total}</span></div>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-8 col-form-label text-right"><strong>Total CGST : </strong></label>
                <div className="col-sm-4 col-form-label">
                  <div><span>{data.invoice_total_cgst}</span></div>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-8 col-form-label text-right"><strong>Total SGST : </strong></label>
                <div className="col-sm-4 col-form-label">
                  <div><span>{data.invoice_total_sgst}</span></div>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-8 col-form-label text-right"><strong>Round Of : </strong></label>
                <div className="col-sm-4 col-form-label">
                  <div><span>{data.invoice_round_of_on_total}</span></div>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-8 col-form-label text-right"><strong>Total : </strong></label>
                <div className="col-sm-4 col-form-label">
                  <div><span>{data.invoice_total}</span></div>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-4 col-form-label text-right"><strong>Rs in Word : </strong></label>
                <div className="col-sm-8 col-form-label">
                  <div><span>{data.invoice_rs_in_word}</span></div>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="offset-sm-4 col-sm-1">
                    <button className="btn btn-xs btn-ajpatel font-white" onClick={() => this.props.changeComponent("list", null)}>Back</button>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
        {/* {isLoading ? <p>Loading... Please wait.</p> : ""}
        <p>{errorMessage}</p>
        <div>{!isLoading ? <p>{data.invoice_id}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_number}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_owner_name}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_owner_mobile}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_owner_email}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_owner_address}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_owner_city}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_owner_state}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_owner_pincode}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_owner_gstin}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_owner_pan_no}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_party_id}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_party_name}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_party_contact_person}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_party_mobile}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_party_address}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_party_city}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_party_state}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_party_pincode}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_party_gstin}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_party_pan_no}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_date}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_truck_no}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_transport}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_l_r_no}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_delivery_note}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_round_of_on_total}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_total}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_bank_name}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_bank_ac_no}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_bank_branch}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_bank_ifsc}</p> : '' }</div>
        <div>{!isLoading ? <p>{data.invoice_is_challan}</p> : '' }</div>
        <div>
          {!isLoading
          ?
          <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>HSN Number</th>
                        <th>Rate</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>CGST</th>
                        <th>SGST</th>
                        <th>IGST</th>
                    </tr>
                </thead>
                <tbody>
                    {tableBody}
                </tbody>
            </table>
          </div>
          :
          ''
          }
        </div>         */}
      </div>
    );
  }
}