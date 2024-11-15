// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HorseRacing {
    struct Horse {
        string name;
        uint256 speed;
        uint256 stamina;
        address owner;
    }

    Horse[] public horses;
    mapping(uint256 => bool) public isRacing;
    
    event HorseCreated(uint256 indexed id, string name, address owner);
    event RaceStarted(uint256 indexed horseId, uint256 raceId);
    event RaceFinished(uint256 indexed horseId, uint256 raceId, uint256 time);

    function createHorse(string memory _name) public {
        uint256 speed = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, "speed"))) % 100;
        uint256 stamina = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, "stamina"))) % 100;
        
        horses.push(Horse(_name, speed, stamina, msg.sender));
        emit HorseCreated(horses.length - 1, _name, msg.sender);
    }

    function startRace(uint256 _horseId) public {
        require(_horseId < horses.length, "Horse does not exist");
        require(horses[_horseId].owner == msg.sender, "Not the horse owner");
        require(!isRacing[_horseId], "Horse is already racing");
        
        isRacing[_horseId] = true;
        emit RaceStarted(_horseId, block.timestamp);
    }

    function finishRace(uint256 _horseId) public {
        require(isRacing[_horseId], "Horse is not racing");
        require(horses[_horseId].owner == msg.sender, "Not the horse owner");
        
        isRacing[_horseId] = false;
        emit RaceFinished(_horseId, block.timestamp, block.timestamp);
    }

    function getHorse(uint256 _horseId) public view returns (Horse memory) {
        require(_horseId < horses.length, "Horse does not exist");
        return horses[_horseId];
    }

    function getHorseCount() public view returns (uint256) {
        return horses.length;
    }
}
