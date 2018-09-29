import React, { Component } from 'react';

export default class Home extends Component {
  
  render() {
    
    return (
      <div className="home-wrapper">
        <div className="breadcrumb-wrapper">
          <span className="ajpatel_primary_color">Home</span>
        </div>
      <div className="welcome-text text-center">
        Welcome to <b>A. J. Patel & CO.</b> Portal
      </div>
      </div>
    );
  }
}