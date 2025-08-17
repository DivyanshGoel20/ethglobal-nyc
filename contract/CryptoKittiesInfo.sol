// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CryptoKittiesInfo
 * @dev Smart contract to store and retrieve CryptoKitties collection information
 * @author Generated for CryptoKitties data storage
 */
contract CryptoKittiesInfo {
    
    // Struct definitions
    struct CollectionOverview {
        string name;
        string description;
        address contractAddress;
        string blockchain;
        string tokenStandard;
        uint256 launchDate; // Unix timestamp
        string officialWebsite;
    }
    
    struct SupplyOwnership {
        uint256 totalSupply;
        uint256 uniqueOwners;
        uint256 currentFloorPriceWei; // Floor price in wei
    }
    
    struct TradingVolume {
        uint256 allTimeVolumeWei; // All-time volume in wei
        uint256 totalSales;
        uint256 volume24hWei; // 24h volume in wei
        uint256 sales24h;
        uint256 volume7dWei; // 7d volume in wei
        uint256 sales7d;
    }
    
    struct RecentPerformance {
        int256 floorPriceChange24h; // Percentage * 100 (e.g., 1429 = 14.29%)
        int256 floorPriceChange7d;  // Percentage * 100
    }
    
    struct SocialLinks {
        string twitter;
        string discord;
        string documentation;
    }
    
    struct TopHolder {
        string name;
        uint256 kittiesOwned;
        uint256 percentageOwned; // Percentage * 100 (e.g., 1031 = 10.31%)
    }
    
    struct RecentActivity {
        uint256 minRecentSaleWei;
        uint256 maxRecentSaleWei;
        string lastBuyerExample;
        string activityDescription;
    }
    
    // State variables
    CollectionOverview public collectionOverview;
    SupplyOwnership public supplyOwnership;
    TradingVolume public tradingVolume;
    RecentPerformance public recentPerformance;
    SocialLinks public socialLinks;
    RecentActivity public recentActivity;
    string public historicalSignificance;
    
    TopHolder[] public topHolders;
    
    address public owner;
    uint256 public lastUpdated;
    
    // Events
    event DataUpdated(string dataType, uint256 timestamp);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        initializeCryptoKittiesData();
        lastUpdated = block.timestamp;
    }
    
    /**
     * @dev Initialize all CryptoKitties data
     */
    function initializeCryptoKittiesData() private {
        // Collection Overview
        collectionOverview = CollectionOverview({
            name: "CryptoKitties",
            description: "CryptoKitties is a game centered around breedable, collectible, and oh-so-adorable creatures we call CryptoKitties! Each cat is one-of-a-kind and 100% owned by you; it cannot be replicated, taken away, or destroyed.",
            contractAddress: 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d,
            blockchain: "Ethereum",
            tokenStandard: "ERC-721",
            launchDate: 1511395200, // November 23, 2017
            officialWebsite: "https://www.cryptokitties.co/"
        });
        
        // Supply & Ownership (current floor price: 0.0004 ETH = 400000000000000 wei)
        supplyOwnership = SupplyOwnership({
            totalSupply: 2025658,
            uniqueOwners: 122320,
            currentFloorPriceWei: 400000000000000 // 0.0004 ETH in wei
        });
        
        // Trading Volume (1712.82 ETH = 1712820000000000000000 wei)
        tradingVolume = TradingVolume({
            allTimeVolumeWei: 1712820000000000000000, // 1712.82 ETH in wei
            totalSales: 22241,
            volume24hWei: 28000000000000000, // 0.028 ETH in wei
            sales24h: 16,
            volume7dWei: 238000000000000000, // 0.238 ETH in wei
            sales7d: 198
        });
        
        // Recent Performance
        recentPerformance = RecentPerformance({
            floorPriceChange24h: 1429, // +14.29%
            floorPriceChange7d: 0      // 0%
        });
        
        // Social Links
        socialLinks = SocialLinks({
            twitter: "@CryptoKitties",
            discord: "https://discord.gg/cryptokitties",
            documentation: "https://opensea.readme.io/page/cryptokitties"
        });
        
        // Recent Activity
        recentActivity = RecentActivity({
            minRecentSaleWei: 400000000000000, // 0.0004 ETH
            maxRecentSaleWei: 500000000000000, // 0.0005 ETH
            lastBuyerExample: "BlackBeard1337",
            activityDescription: "Consistent trading activity with recent sales ranging from 0.0004 to 0.0005 ETH"
        });
        
        // Historical Significance
        historicalSignificance = "CryptoKitties holds the distinction of being one of the first mainstream NFT collections and blockchain games, launching in 2017. It pioneered the concept of breeding mechanics in NFTs and was so popular at launch that it significantly congested the Ethereum network. The collection remains an important piece of NFT history and continues to maintain an active trading community.";
        
        // Initialize top holders
        initializeTopHolders();
    }
    
    /**
     * @dev Initialize top holders data
     */
    function initializeTopHolders() private {
        topHolders.push(TopHolder({
            name: "KittenMittens",
            kittiesOwned: 208908,
            percentageOwned: 1031 // 10.31%
        }));
        
        topHolders.push(TopHolder({
            name: "CryptoKitties-Auction-Contract",
            kittiesOwned: 162811,
            percentageOwned: 804 // 8.04%
        }));
        
        topHolders.push(TopHolder({
            name: "CryptoKitties-Siring-Contract",
            kittiesOwned: 75058,
            percentageOwned: 371 // 3.71%
        }));
        
        topHolders.push(TopHolder({
            name: "Wrapped-CryptoKitties",
            kittiesOwned: 74175,
            percentageOwned: 366 // 3.66%
        }));
        
        topHolders.push(TopHolder({
            name: "Waltmeister3000",
            kittiesOwned: 28705,
            percentageOwned: 142 // 1.42%
        }));
    }
    
    // Getter functions for different data categories
    
    /**
     * @dev Get basic collection information
     */
    function getCollectionOverview() external view returns (CollectionOverview memory) {
        return collectionOverview;
    }
    
    /**
     * @dev Get supply and ownership statistics
     */
    function getSupplyOwnership() external view returns (SupplyOwnership memory) {
        return supplyOwnership;
    }
    
    /**
     * @dev Get trading volume data
     */
    function getTradingVolume() external view returns (TradingVolume memory) {
        return tradingVolume;
    }
    
    /**
     * @dev Get recent performance metrics
     */
    function getRecentPerformance() external view returns (RecentPerformance memory) {
        return recentPerformance;
    }
    
    /**
     * @dev Get social media links
     */
    function getSocialLinks() external view returns (SocialLinks memory) {
        return socialLinks;
    }
    
    /**
     * @dev Get recent activity information
     */
    function getRecentActivity() external view returns (RecentActivity memory) {
        return recentActivity;
    }
    
    /**
     * @dev Get historical significance description
     */
    function getHistoricalSignificance() external view returns (string memory) {
        return historicalSignificance;
    }
    
    /**
     * @dev Get all top holders
     */
    function getTopHolders() external view returns (TopHolder[] memory) {
        return topHolders;
    }
    
    /**
     * @dev Get specific top holder by index
     */
    function getTopHolder(uint256 index) external view returns (TopHolder memory) {
        require(index < topHolders.length, "Index out of bounds");
        return topHolders[index];
    }
    
    /**
     * @dev Get number of top holders
     */
    function getTopHoldersCount() external view returns (uint256) {
        return topHolders.length;
    }
    
    /**
     * @dev Get current floor price in ETH (with 18 decimal places)
     */
    function getFloorPriceETH() external view returns (uint256) {
        return supplyOwnership.currentFloorPriceWei;
    }
    
    /**
     * @dev Get all-time volume in ETH (with 18 decimal places)
     */
    function getAllTimeVolumeETH() external view returns (uint256) {
        return tradingVolume.allTimeVolumeWei;
    }
    
    /**
     * @dev Get comprehensive collection summary
     */
    function getCollectionSummary() external view returns (
        string memory name,
        uint256 totalSupply,
        uint256 uniqueOwners,
        uint256 floorPriceWei,
        uint256 allTimeVolumeWei,
        uint256 totalSales
    ) {
        return (
            collectionOverview.name,
            supplyOwnership.totalSupply,
            supplyOwnership.uniqueOwners,
            supplyOwnership.currentFloorPriceWei,
            tradingVolume.allTimeVolumeWei,
            tradingVolume.totalSales
        );
    }
    
    // Update functions (only owner)
    
    /**
     * @dev Update supply and ownership data
     */
    function updateSupplyOwnership(
        uint256 _totalSupply,
        uint256 _uniqueOwners,
        uint256 _currentFloorPriceWei
    ) external onlyOwner {
        supplyOwnership.totalSupply = _totalSupply;
        supplyOwnership.uniqueOwners = _uniqueOwners;
        supplyOwnership.currentFloorPriceWei = _currentFloorPriceWei;
        lastUpdated = block.timestamp;
        emit DataUpdated("SupplyOwnership", block.timestamp);
    }
    
    /**
     * @dev Update trading volume data
     */
    function updateTradingVolume(
        uint256 _allTimeVolumeWei,
        uint256 _totalSales,
        uint256 _volume24hWei,
        uint256 _sales24h,
        uint256 _volume7dWei,
        uint256 _sales7d
    ) external onlyOwner {
        tradingVolume.allTimeVolumeWei = _allTimeVolumeWei;
        tradingVolume.totalSales = _totalSales;
        tradingVolume.volume24hWei = _volume24hWei;
        tradingVolume.sales24h = _sales24h;
        tradingVolume.volume7dWei = _volume7dWei;
        tradingVolume.sales7d = _sales7d;
        lastUpdated = block.timestamp;
        emit DataUpdated("TradingVolume", block.timestamp);
    }
    
    /**
     * @dev Update recent performance data
     */
    function updateRecentPerformance(
        int256 _floorPriceChange24h,
        int256 _floorPriceChange7d
    ) external onlyOwner {
        recentPerformance.floorPriceChange24h = _floorPriceChange24h;
        recentPerformance.floorPriceChange7d = _floorPriceChange7d;
        lastUpdated = block.timestamp;
        emit DataUpdated("RecentPerformance", block.timestamp);
    }
    
    /**
     * @dev Add a new top holder
     */
    function addTopHolder(
        string memory _name,
        uint256 _kittiesOwned,
        uint256 _percentageOwned
    ) external onlyOwner {
        topHolders.push(TopHolder({
            name: _name,
            kittiesOwned: _kittiesOwned,
            percentageOwned: _percentageOwned
        }));
        lastUpdated = block.timestamp;
        emit DataUpdated("TopHolders", block.timestamp);
    }
    
    /**
     * @dev Update existing top holder
     */
    function updateTopHolder(
        uint256 index,
        string memory _name,
        uint256 _kittiesOwned,
        uint256 _percentageOwned
    ) external onlyOwner {
        require(index < topHolders.length, "Index out of bounds");
        topHolders[index].name = _name;
        topHolders[index].kittiesOwned = _kittiesOwned;
        topHolders[index].percentageOwned = _percentageOwned;
        lastUpdated = block.timestamp;
        emit DataUpdated("TopHolders", block.timestamp);
    }
    
    /**
     * @dev Transfer ownership of the contract
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
    
    /**
     * @dev Get when data was last updated
     */
    function getLastUpdated() external view returns (uint256) {
        return lastUpdated;
    }
}
