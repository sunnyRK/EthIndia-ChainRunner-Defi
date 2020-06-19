import React from 'react';
import {
  InputLabel, MenuItem, FormControl, Select,
} from '@material-ui/core';

import TransactionHistory from './TransactionHistory';

const ProfileActions = ({
  metamaskAddress, checkPairAddress, symbol0, symbol1,
  checkPairBalance, reserve0, reserve1, options, handlecheckPairs,
}) => (
  <div className="profile-actions">
    <div className="metamask-info card">
      <h3>Metamask address</h3>
      <div className="address">{metamaskAddress || '0x2345000234.....'}</div>
    </div>
    <div className="check-liquidity card">
      <h3>Liquidity Check</h3>
      <FormControl fullWidth variant="outlined" classes={{ root: 'check-liquidity-dropdown' }}>
        <InputLabel>Select Pair</InputLabel>
        <Select
          value={checkPairAddress}
          onChange={handlecheckPairs}
          label="Select Pair"
        >
          {
            options.map((option) => (
              <MenuItem value={option.value}>{option.text}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <div className="metamask-info card">
        <h4>Your {checkPairAddress} Pool token</h4>
        <div className="address">{checkPairBalance} Uni-V2 wei</div>
      </div>
      <div className="metamask-info card">
        <h4>Total {symbol0} liquidity</h4>
        <div className="address">{reserve0} wei</div>
      </div>
      <div className="metamask-info card">
        <h4>Total {symbol1} liquidity</h4>
        <div className="address">{reserve1} wei</div>
      </div>
    </div>
    <div className="transaction-history-wrapper card">
      <h3>Transaction History</h3>
      <TransactionHistory />
    </div>
  </div>
);

export default ProfileActions;
