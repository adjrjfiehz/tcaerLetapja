import React, { Component } from 'react';
import ProductList from './ProductList';
import ProductView from './ProductView';
import ProductCreate from './ProductCreate';

export default class Product extends Component {
  
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
  }

  changeComponent(name, data) {
    this.setState({component: name});
    this.setState({data: data});
  }

  updateState(stateName, stateValue) {
    this.setState({[stateName]: stateValue});
  }
  
  render() {
    const { component, data, isLoading, errorMessage } = this.state;
    
    return (
      <div className="product-wrapper">
        <div className="breadcrumb-wrapper">
          <span onClick={() => this.changeComponent("list", null)} className="cursor-pointer ajpatel_primary_color">Product</span>
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
        <ProductList 
          changeComponent={this.changeComponent}/>
        :
        component === "view"
        ?
        <ProductView 
          changeComponent={this.changeComponent}
          updateState={this.updateState}
          data={data}
          isLoading={isLoading}
          errorMessage={errorMessage}/>
        :
        <ProductCreate 
          changeComponent={this.changeComponent}/>
        }
      </div>
    );
  }
}