pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 { 

    struct Star { 
        string name;
        string story;
        string dec; 
        string mag;
        string cent;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;
    mapping(uint256 => bool) public starCoord;

    function concat(string _a, string _b) internal pure returns (string) {
        bytes memory _baseBytes = bytes(_a);
        bytes memory _valueBytes = bytes(_b);
        string memory _tmpValue = new string(_baseBytes.length + _valueBytes.length);
        bytes memory _newValue = bytes(_tmpValue);
        uint i;
        uint j;
        for(i = 0; i < _baseBytes.length; i++) {
            _newValue[j++] = _baseBytes[i];
        }

        for(i = 0; i < _valueBytes.length; i++) {
            _newValue[j++] = _valueBytes[i++];
        }

        return string(_newValue);
    }

    function createStar(uint256 _tokenId, string _name, string _story, string _dec, string _mag, string _cent) public { 
        Star memory newStar = Star(_name, _story, _dec, _mag, _cent);    

        require(checkIfStarExist(_dec, _mag, _cent) == false, "This star already exist. Please create a different one");

        uint256 coords = uint256(keccak256(abi.encodePacked(concat(concat(_dec, _mag), _cent))));
        starCoord[coords] = true;

        tokenIdToStarInfo[_tokenId] = newStar;
        _mint(msg.sender, _tokenId);
    }


    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0);
        
        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function checkIfStarExist(string _dec, string _mag, string _cent) public view returns (bool) {
        uint256 coords = uint256(keccak256(abi.encodePacked(concat(concat(_dec, _mag), _cent))));
        if(starCoord[coords] == true){
            return true;
        } else{
            return false;
        }  
    }

    function tokenIdToStarInfo(uint256 _tokenId) public view returns(string, string, string, string, string){
        return (
            tokenIdToStarInfo[_tokenId].name, 
            tokenIdToStarInfo[_tokenId].story, 
            tokenIdToStarInfo[_tokenId].dec, 
            tokenIdToStarInfo[_tokenId].mag, 
            tokenIdToStarInfo[_tokenId].cent);
    }

}