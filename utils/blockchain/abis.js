export const ERC20_ABI = [
  "function balanceOf(address owner) external view returns (uint256 balance)",
  "function decimals() external view returns (uint8)",
  "function name() external view returns (string name)",
  "function symbol() external view returns (string symbol)",
  "function totalSupply() external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
];

export const ERC721_ABI = [
  "function balanceOf(address owner) external view returns (uint256 balance)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId)",
  "function ownerOf(uint256 tokenId) external view returns (address owner)",
  "function name() external view returns (string name)",
  "function symbol() external view returns (string symbol)",
  "function totalSupply() external view returns (uint256)",
  "function supportsInterface(bytes4 interfaceId) external view returns (bool)",
];

export const ERC1155_ABI = [
  "function balanceOf(address account, uint256 id) external view returns (uint256)",
  "function balanceOfBatch(address[] accounts, uint256[] ids) external view returns (uint256[])",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address account, address operator) external view returns (bool)",
  "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external",
];
