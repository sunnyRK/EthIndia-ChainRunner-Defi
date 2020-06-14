pragma solidity ^0.5.0;

import "github.com/tellor-io/usingtellor/blob/master/contracts/UsingTellor.sol";
import "Ownable.sol";

// Rinkeby Tellor Address: 0xFe41Cb708CD98C5B20423433309E55b53F79134a
// Mainnet Tellor Address: 0x0ba45a8b5d5575935b8158a88c631e9f9c95a2e5

contract TellorOracle is UsingTellor, Ownable {
    uint public tellorID;
    uint public qualifiedValue;
    uint public currentValue;
  
    struct tellorOracleTokenIdStruct {
        uint tellorID;
    }
    mapping(string => tellorOracleTokenIdStruct) public tellorOracleTokenIdMapping;
    
    constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) public {
    }

    modifier setTellorId(string memory tokenSymbol) {
        require(tellorOracleTokenIdMapping[tokenSymbol].tellorID == 0, "Already tellor id added for this token");
        _;
    }
    
    modifier isTellorId(string memory tokenSymbol) {
        require(tellorOracleTokenIdMapping[tokenSymbol].tellorID != 0, "Tellor Id is not available");
        _;
    }

    function updateValues(uint _tellorID) external {
        bool _didGet;
        uint _timestamp;
        uint _value;
        
        (_didGet,_value,_timestamp) = getDataBefore(_tellorID, now - 1 hours);
        if(_didGet){
          qualifiedValue = _value;
        }
        
        (_didGet,currentValue,_timestamp) = getCurrentValue(_tellorID);
    }
    
    // Tokensymbol with its tellorId
    // DAI = 39
    // ETH = 1
    // BAT = 32 
    // ZRX = 34 
    // TRB = 50
    function AddToken(string memory tokenSymbol, uint tellorId) public onlyOwner setTellorId(tokenSymbol) {
      tellorOracleTokenIdMapping[tokenSymbol].tellorID = tellorId;
    } 

    function getCurrentValueFromTellorOracle(string memory tokenSymbol) public 
    isTellorId(tokenSymbol) 
    view 
    returns(bool, uint, uint) {
        return getCurrentValue(tellorOracleTokenIdMapping[tokenSymbol].tellorID);
    }

}
