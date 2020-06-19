import React from 'react';

import LiquidityContainer from './Liquidity/LiquidityContainer';
import TradeContainer from './Trade/TradeContainer';
import ProfileActionsContainer from '../shared/profile-actions/ProfileActionsContainer';

const Dashboard = () => (
  <div className="dashboard">
    <div className="dashboard-content">
      <TradeContainer />
      <LiquidityContainer />
    </div>
    <div className="profile-actions-container">
      <ProfileActionsContainer />
    </div>
  </div>
);

export default Dashboard;
