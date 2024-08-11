// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ZTips is ReentrancyGuard {
    IERC20 public bountyToken;
    
    struct Bounty {
        address seeker;
        uint256 amount;
        bool isActive;
        string title;
        string description;
    }
    
    struct Tip {
        address provider;
        string contentHash;
        bool isReleased;
    }
    
    mapping(uint256 => Bounty) public bounties;
    mapping(uint256 => Tip[]) public tipsByBounty;
    uint256 public nextBountyId;
    
    event BountyCreated(uint256 indexed bountyId, address indexed seeker, uint256 amount, string title);
    event TipSubmitted(uint256 indexed bountyId, address indexed provider, string contentHash);
    event BountyReleased(uint256 indexed bountyId, address indexed provider, uint256 amount);
    
    constructor(address _bountyToken) {
        bountyToken = IERC20(_bountyToken);
    }
    
    function createBounty(uint256 _amount, string memory _title, string memory _description, bytes32 _proofHash) external nonReentrant {
        require(verifyProof(_proofHash), "Invalid proof");
        require(bountyToken.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");
        
        bounties[nextBountyId] = Bounty({
            seeker: msg.sender,
            amount: _amount,
            isActive: true,
            title: _title,
            description: _description
        });
        
        emit BountyCreated(nextBountyId, msg.sender, _amount, _title);
        nextBountyId++;
    }
    
    function submitTip(uint256 _bountyId, string memory _contentHash, bytes32 _proofHash) external nonReentrant {
        require(verifyProof(_proofHash), "Invalid proof");
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.isActive, "Bounty is not active");
        
        tipsByBounty[_bountyId].push(Tip({
            provider: msg.sender,
            contentHash: _contentHash,
            isReleased: false
        }));
        
        emit TipSubmitted(_bountyId, msg.sender, _contentHash);
    }
    
    function releaseBounty(uint256 _bountyId, uint256 _tipIndex, uint256 _amount) external nonReentrant {
        Bounty storage bounty = bounties[_bountyId];
        require(msg.sender == bounty.seeker, "Only seeker can release bounty");
        require(bounty.isActive, "Bounty is not active");
        require(_amount <= bounty.amount, "Insufficient bounty balance");
        
        Tip[] storage tips = tipsByBounty[_bountyId];
        require(_tipIndex < tips.length, "Invalid tip index");
        require(!tips[_tipIndex].isReleased, "Tip already released");
        
        bounty.amount -= _amount;
        if (bounty.amount == 0) {
            bounty.isActive = false;
        }
        
        tips[_tipIndex].isReleased = true;
        
        require(bountyToken.transfer(tips[_tipIndex].provider, _amount), "Token transfer failed");
        
        emit BountyReleased(_bountyId, tips[_tipIndex].provider, _amount);
    }
    
    function getBountyDetails(uint256 _bountyId) external view returns (Bounty memory) {
        return bounties[_bountyId];
    }
    
    function getTipCount(uint256 _bountyId) external view returns (uint256) {
        return tipsByBounty[_bountyId].length;
    }
    
    function verifyProof(bytes32 _proofHash) internal pure returns (bool) {
        // This is a placeholder for actual ZK proof verification
        // In a real implementation, you would verify the proof here
        // For now, we'll just check if the hash is not zero
        return _proofHash != bytes32(0);
    }
}