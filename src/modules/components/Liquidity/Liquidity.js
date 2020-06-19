import React from 'react';
import {
  Button, Form, Input,
  Segment, Grid, Dropdown,
  Message, Icon, Divider, Label,
} from 'semantic-ui-react';

const Liquidity = ({
  addLiquidity, tagOptions, handleLiquidityPairs,
  addLiquidityamount0, addLiquidityamount1,
  addLiquidityLoading, selectMax, removeTokenPair,
  handleRemovePairTokens, removeLiquidityTokenAmount,
  removeLiquidity, removeLiquidityLoading, handleState,
  handleInputPair,
}) => (
  <div className="liquidity">
    <div className="add-liquidity card">
      <h3>Add Liquidity</h3>
      <div className="form-field">
        <label>Pair tokens</label>
        <Dropdown
          className="liquidity-pairs form-control"
          options={tagOptions}
          onChange={handleLiquidityPairs}
          fluid
          selection
          placeholder="Select Pair tokens.."
        />
      </div>
      <div className="form-field">
        <label>token0</label>
        <Input
          type="input"
          // labelPosition="right"
          className="form-control"
          placeholder="Enter value in WEI"
          value={addLiquidityamount0}
          onChange={handleInputPair}
          fluid
        />
        <label className="total">total will see here</label>
      </div>
      <div className="form-field">
        <label>token1</label>
        <Input
          type="input"
          fluid
          className="form-control"
          placeholder="Etner value in WEI"
          value={addLiquidityamount1}
          onChange={(event) => {
            handleState({
              addLiquidityamount1: event.target.value,
            });
          }}
          disabled
        />
        <label className="total">total will see here</label>
      </div>
      <div className="form-field button add-liquidity-footer">
        <Button
          onClick={() => {
            handleState({
              addLiquidityamount0: '',
              addLiquidityamount1: '',
            });
          }}
        >
          Clear
        </Button>
        <Button
          type="submit"
          loading={addLiquidityLoading}
          primary
          style={{ backgroundColor: '#2d507d' }}
          onClick={addLiquidity}
        >
          Add Liquidity
        </Button>
      </div>
    </div>

    <div className="remove-liquidity card">
      <h3>Remove Liquidity</h3>
      <div className="pool-wrapper">
        <div className="form-field ">
          <label>token0</label>
          <Input
            label={(
              <Dropdown
                value={removeTokenPair}
                options={tagOptions}
                onChange={handleRemovePairTokens}
                className="form-control pool-dropdown"
                placeholder="Select"
              />
            )}
            fluid
            className="form-control"
            type="input"
            labelPosition="left"
            placeholder="Add Pool value in wei"
            value={removeLiquidityTokenAmount}
            onChange={(event) => {
              handleState({
                removeLiquidityTokenAmount: event.target.value,
              });
            }}
          />
          <label className="total">total will see here</label>
        </div>
        <div className="button form-field set-max-button">
          <Button
            basic
            className="form-control"
            type="submit"
            onClick={() => selectMax()}
          >
            Set Max
          </Button>
        </div>
      </div>
      <div className="form-field button remove-liquidity-footer">
        <Button
          onClick={() => {
            handleState({
              removeTokenPair: '',
              removeLiquidityTokenAmount: '',
            });
          }}
        >
          Clear
        </Button>
        <Button
          bsStyle="primary"
          type="submit"
          loading={removeLiquidityLoading}
          primary
          onClick={(event) => removeLiquidity(event)}
          style={{ backgroundColor: '#2d507d' }}
        >
          Remove Liquidity
        </Button>
      </div>
    </div>
  </div>
);

export default Liquidity;