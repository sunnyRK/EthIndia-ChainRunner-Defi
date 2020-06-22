import React, { Component } from 'react';

import Dashboard from './Dashboard';
import MainTemplate from '../shared/main-template/MainTemplateContainer';
import web3 from "../../../config/web3";
class DashboardContainer extends Component {
  async componentDidMount() {
    let networkType;
    await web3.eth.net.getNetworkType().then(function(type) {
      networkType = type
    });
    console.log(networkType);
    if(networkType != "rinkeby"){
      alert("Change network " + networkType + " to rinkeby");
    }
    window.ethereum.enable();
  }

  render() {
    return (
      <MainTemplate>
        <Dashboard />
      </MainTemplate>
    );
  }
}

export default DashboardContainer;
