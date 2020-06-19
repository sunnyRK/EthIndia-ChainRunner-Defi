import React, { Component } from 'react';

import Dashboard from './Dashboard';
import MainTemplate from '../shared/main-template/MainTemplateContainer';

class DashboardContainer extends Component {
  async componentDidMount() {
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
