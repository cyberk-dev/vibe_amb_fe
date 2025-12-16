import { parseAbi } from "viem";

export const tokenFactoryAbi = parseAbi([
  // Read Functions
  "function tokens(uint256 index) view returns (address)",
  "function defaultAdmin() view returns (address)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",

  // Write Functions
  "function createToken(string memory _name, string memory _symbol, uint256 _supply)",

  // Events
  "event TokenCreated(address token, string name, string symbol, uint256 supply)",
]);
