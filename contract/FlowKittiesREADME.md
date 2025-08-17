# CryptoKitties Info Smart Contract

A comprehensive Solidity smart contract that stores and manages CryptoKitties NFT collection information on the Ethereum blockchain fetched through OpenSea MPC.

## Overview

This contract stores detailed information about the CryptoKitties NFT collection, including:
- Collection metadata (name, description, contract address, launch date)
- Supply and ownership statistics
- Trading volume data
- Recent performance metrics
- Social media links
- Top holder information
- Historical significance

## Contract Features

### Data Structures

The contract uses several structs to organize data:

- **CollectionOverview**: Basic collection information
- **SupplyOwnership**: Supply and ownership statistics
- **TradingVolume**: Trading volume metrics
- **RecentPerformance**: Price change percentages
- **SocialLinks**: Social media and documentation links
- **TopHolder**: Individual holder information
- **RecentActivity**: Recent trading activity data

### Key Functions

#### Read Functions (Public)

- `getCollectionOverview()` - Returns basic collection information
- `getSupplyOwnership()` - Returns supply and ownership stats
- `getTradingVolume()` - Returns trading volume data
- `getRecentPerformance()` - Returns recent price changes
- `getSocialLinks()` - Returns social media links
- `getTopHolders()` - Returns array of all top holders
- `getRecentActivity()` - Returns recent activity information
- `getHistoricalSignificance()` - Returns historical description
- `getCollectionSummary()` - Returns key metrics in one call
- `getFloorPriceETH()` - Returns current floor price in wei
- `getAllTimeVolumeETH()` - Returns all-time volume in wei

#### Update Functions (Owner Only)

- `updateSupplyOwnership()` - Update supply and ownership data
- `updateTradingVolume()` - Update trading volume metrics
- `updateRecentPerformance()` - Update price change data
- `addTopHolder()` - Add a new top holder
- `updateTopHolder()` - Update existing top holder information

### Current Data (as of contract deployment)

- **Total Supply**: 2,025,658 CryptoKitties
- **Unique Owners**: 122,320
- **Floor Price**: 0.0004 ETH
- **All-Time Volume**: 1,712.82 ETH
- **Total Sales**: 22,241 transactions
- **Contract Address**: 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d

## Usage Examples

### Reading Data

```javascript
// Get collection overview
const overview = await contract.getCollectionOverview();
console.log("Name:", overview.name);
console.log("Description:", overview.description);

// Get current statistics
const stats = await contract.getSupplyOwnership();
console.log("Total Supply:", stats.totalSupply);
console.log("Unique Owners:", stats.uniqueOwners);
console.log("Floor Price (wei):", stats.currentFloorPriceWei);

// Get top holders
const holders = await contract.getTopHolders();
holders.forEach((holder, index) => {
    console.log(`${index + 1}. ${holder.name}: ${holder.kittiesOwned} kitties`);
});

// Get quick summary
const summary = await contract.getCollectionSummary();
console.log("Summary:", summary);
```

### Updating Data (Owner Only)

```javascript
// Update floor price and supply (amounts in wei)
await contract.updateSupplyOwnership(
    2025700,                    // New total supply
    122400,                     // New unique owners
    ethers.parseEther("0.0005") // New floor price in wei
);

// Update trading volume
await contract.updateTradingVolume(
    ethers.parseEther("1720"),  // All-time volume in wei
    22300,                      // Total sales
    ethers.parseEther("0.03"),  // 24h volume in wei
    18,                         // 24h sales
    ethers.parseEther("0.25"),  // 7d volume in wei
    205                         // 7d sales
);

// Add new top holder
await contract.addTopHolder(
    "NewWhale123",
    15000,  // Kitties owned
    74      // Percentage owned * 100 (0.74%)
);
```

## Technical Details

### Price Handling

- All ETH prices are stored in wei (1 ETH = 10^18 wei)
- Percentage values are stored as integers multiplied by 100 (e.g., 14.29% = 1429)
- Use `ethers.parseEther()` to convert ETH to wei when updating

### Access Control

- Most functions are public and read-only
- Update functions require owner privileges
- Owner can transfer ownership using `transferOwnership()`

### Events

- `DataUpdated(string dataType, uint256 timestamp)` - Emitted when data is updated
- `OwnershipTransferred(address previousOwner, address newOwner)` - Emitted on ownership transfer

## License

MIT License - Feel free to use and modify as needed.
