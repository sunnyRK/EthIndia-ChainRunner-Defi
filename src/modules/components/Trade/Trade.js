import React from 'react';
// import PropTypes from 'prop-types';
import {
  Button, Input, Dropdown,
} from 'semantic-ui-react';

const Trade = ({
  swapExactTokensForTokens, tradePairTokens, tagOptions,
  handlePairs, pairTokens, handlePairTokens, amountSwapDesired,
  handleInputPrice, tradeLoading, amountOut, slippage, handleState,
  onClearClick,
}) => (
  <div className="card trade">
    <h3>For Traders</h3>
    <div className="form-field">
      <label>Select Pair</label>
      <Dropdown
        placeholder="Select pair tokens.."
        className="form-control"
        value={tradePairTokens}
        options={tagOptions}
        onChange={handlePairs}
        selection
        fluid
      />
    </div>
    <div className="form-field">
      <label>Value</label>
      <Input
        className="pair-input form-control"
        label={(
          <Dropdown
            options={pairTokens}
            onChange={handlePairTokens}
            className="pair-input-dropdown form-control"
            placeholder="Select"
          />
        )}
        labelPosition="left"
        color="teal"
        type="input"
        fluid
        // labelPosition="right"
        placeholder="Add value in Wei"
        value={amountSwapDesired}
        onChange={handleInputPrice}
      />
      <label className="total">total will see here</label>
    </div>
    <div className="form-field">
      <label>Amount out</label>
      <Input
        type="input"
        className="form-control"
        value={amountOut}
        onChange={(event) => {
          handleState({ amountOut: event.target.value });
        }}
        disabled
      />
    </div>
    <div className="form-field">
      <label>Tellor Rate %</label>
      <Input
        type="input"
        className="form-control"
        // value={amountOut}
        // onChange={(event) => {
        //   handleState({ amountOut: event.target.value });
        // }}
        disabled
      />
      <label className="total">total will see here</label>
    </div>
    <div className="form-field">
      <label>Slippage Rate %</label>
      <Input
        type="input"
        className="form-control"
        value={slippage}
        onChange={(event) => {
          handleState({ slippage: event.target.value });
        }}
        disabled
      />
    </div>
    <div className="form-field trade-footer">
      <Button
        bsStyle="primary"
        onClick={(event) => onClearClick(event)}
      >
        Clear
      </Button>
      <Button
        color="blue"
        bsStyle="primary"
        type="submit"
        loading={tradeLoading}
        onClick={(event) => swapExactTokensForTokens(event)}
        style={{ backgroundColor: '#2d507d' }}
      >
        Trade
      </Button>
    </div>
  </div>
);

export default Trade;
