import React, { Component } from 'react';

import Dashboard from './Dashboard';
import MainTemplate from '../shared/main-template/MainTemplateContainer';
import web3 from '../../../config/web3';
import NetworkTypeDialogContainer from './NetworkTypeDialog/NetworkTypeDialogContainer';

class DashboardContainer extends Component {
  state = {
    displayMessage: '',
  };

  async componentDidMount() {
    let networkType;
    await web3.eth.net.getNetworkType().then(function(type) {
      networkType = type
    });
    console.log(networkType);
    if(networkType != "rinkeby") {
      // alert("Network Error: Change network " + networkType + " to rinkeby");
      this.setState({
        displayMessage: "Network Error: Change network " + networkType + " to rinkeby",
      });
    } else {
      this.setState({
        displayMessage: '',
      });
    }
    this.enablewindow();
  }

  async enablewindow() {
    await window.ethereum.enable();
  }

  render() {
    return (
      <MainTemplate>
        <Dashboard />
        <NetworkTypeDialogContainer
          displayMessage={this.state.displayMessage}
          openDialog={this.state.displayMessage}
        />
      </MainTemplate>
    );
  }
}

export default DashboardContainer;
