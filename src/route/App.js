import React, { Component } from 'react';

import { BrowserRouter as Router, Route } from "react-router-dom";

import AppTemplate from '../commons/ui/components/AppTemplate';
import AsyncComponent from '../commons/async/AsyncComponent';
import basePath from '../commons/utils/basePath';

const Login = () => import('../modules/login/index');
const Home = () => import('../modules/home/index');
const Sales = () => import('../modules/sales/index');
const Party = () => import('../modules/party/index');
const Product = () => import('../modules/product/index');
const Company = () => import('../modules/company/index');

class App extends Component {
  render() {
    return (
      <Router>
      <AppTemplate>
      <Route path={basePath`login`} exact={true} component={() => <AsyncComponent moduleProvider={Login} />} />
        <Route path={basePath``} exact={true} component={() => <AsyncComponent moduleProvider={Home} />} />
        <Route path={basePath`sales`} exact={true} component={() => <AsyncComponent moduleProvider={Sales} />} />
        <Route path={basePath`party`} exact={true} component={() => <AsyncComponent moduleProvider={Party} />} />
        <Route path={basePath`product`} exact={true} component={() => <AsyncComponent moduleProvider={Product} />} />
        <Route path={basePath`company`} exact={true} component={() => <AsyncComponent moduleProvider={Company} />} />
      </AppTemplate>
     </Router>
    );
  }
}

export default App;
