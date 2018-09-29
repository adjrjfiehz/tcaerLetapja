import React, { PureComponent } from 'react';
import LoadingIndicator from '../ui/components/LoadingIndicator';

export default class  extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      Component: null
    }
  }

  componentWillMount() {
    if(!this.state.Component) {
      this.props.moduleProvider().then( ({Component}) => this.setState({ Component }));
    }
  }

  render() {
    const { Component } = this.state;

    return (
      <div>
        {Component ? <Component /> : <LoadingIndicator />}
      </div>
    );
  }
};