import React, { Component } from 'react';

import MainTemplate from './MainTemplate';

class MainTemplateContainer extends Component {
  render() {
    const { children } = this.props;
    return (
      <MainTemplate
        children={children}
      />
    );
  }
}

export default MainTemplateContainer;
