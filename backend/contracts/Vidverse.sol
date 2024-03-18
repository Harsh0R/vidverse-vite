// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("VidToken", "NVT") {
        _mint(msg.sender, 1000000000 * 10 ** 18);
    }
}

contract VideoPlatform {
    struct Video {
        uint256 id;
        address owner;
        string title;
        string description;
        string ipfsHash;
        uint256 tipAmount;
    }
    struct LiveStream {
        uint256 id;
        address owner;
        string stramName;
        string description;
        string playBackId;
        uint256 tipAmount;
        bool status;
        string streamKey;
        string streamID;
    }

    Video[] public videos;
    LiveStream[] public liveStreams;
    ERC20 public myToken;

    event StreamStopped(uint256 indexed id, address owner);

    event VideoUploaded(
        uint256 id,
        address owner,
        string title,
        string description,
        string ipfsHash,
        uint256 tipAmount
    );

     event VideoTipped(
        uint256 indexed videoId,
        address indexed owner,
        address tipper,
        uint256 amount,
        uint256 newTipAmount
    );

    event CreatedStream(
        uint256 id,
        address owner,
        string stramName,
        string description,
        string playBackId,
        bool status
    );

    constructor() {
        MyToken token = new MyToken();
        myToken = token;
    }

    function uploadVideo(
        address userAddr,
        string memory _title,
        string memory _description,
        string memory _ipfsHash
    ) public {
        // Check if the IPFS hash already exists
        for (uint256 i = 0; i < videos.length; i++) {
            require(
                keccak256(abi.encodePacked(videos[i].ipfsHash)) !=
                    keccak256(abi.encodePacked(_ipfsHash)),
                "Video with the same IPFS hash already exists"
            );
        }

        uint256 id = videos.length;
        videos.push(Video(id, userAddr, _title, _description, _ipfsHash, 0));
        myToken.transfer(userAddr, 100 * 10 ** 18);
        emit VideoUploaded(id, userAddr, _title, _description, _ipfsHash , 100 * 10 ** 18);
    }

    function createStream(
        address userAddr,
        string memory _title,
        string memory _description,
        string memory _playbackId,
        string memory streamKey,
        string memory _streamID
    ) public {
        for (uint256 i = 0; i < liveStreams.length; i++) {
            require(
                keccak256(abi.encodePacked(liveStreams[i].playBackId)) !=
                    keccak256(abi.encodePacked(_playbackId)),
                "LiveStream already exists"
            );
        }

        uint256 id = liveStreams.length;
        liveStreams.push(
            LiveStream(
                id,
                userAddr,
                _title,
                _description,
                _playbackId,
                0,
                true,
                streamKey,
                _streamID
            )
        );
        myToken.transfer(userAddr, 1000 * 10 ** 18);
        emit CreatedStream(
            id,
            userAddr,
            _title,
            _description,
            _playbackId,
            true
        );
    }

    function stopStreamByStreamID(address useAddress ,string memory _streamID) public {
        bool streamFound = false;

        for (uint256 i = 0; i < liveStreams.length; i++) {
            // Compare the streamID of each stream with the provided _streamID
            if (
                keccak256(abi.encodePacked(liveStreams[i].streamID)) ==
                keccak256(abi.encodePacked(_streamID))
            ) {
                // Check if the caller is the owner of the stream
                require(
                    useAddress == liveStreams[i].owner,
                    "Caller is not the stream owner"
                );

                // Update the stream's status to false
                liveStreams[i].status = false;

                emit StreamStopped(liveStreams[i].id, useAddress);

                streamFound = true;
                break; // Exit the loop once the stream is found and updated
            }
        }

        require(
            streamFound,
            "Stream with the given ID does not exist or has already been stopped."
        );
    }

    function tipVideoOwner(
        address userAddre,
        uint256 _videoId,
        uint256 _amount
    ) public payable {
        require(_videoId < videos.length, "Invalid video ID");
        require(_amount > 0, "Amount must be greater than 0");

        Video storage video = videos[_videoId];
        require(video.owner != address(0), "Video not found");
        require(
            myToken.allowance(userAddre, address(this)) >= _amount,
            "Insufficient allowance"
        );
        require(
            myToken.transferFrom(userAddre, address(this), _amount),
            "Fail to transfer token in address"
        );
        require(
            myToken.transfer(video.owner, _amount),
            "Fail to transfer token to videos owner"
        );

        // Update tip amount
        video.tipAmount += _amount;
        emit VideoUploaded(video.id, video.owner, video.title, video.description, video.ipfsHash , video.tipAmount);
        
        emit VideoTipped(_videoId, video.owner, userAddre, _amount, video.tipAmount);
    }

    function tipStreamOwner(
        address useAddre,
        uint256 _streamId,
        uint256 _amount
    ) public payable {
        require(_streamId < liveStreams.length, "Invalid Stream ID");
        require(_amount > 0, "Amount must be greater than 0");

        LiveStream storage stream = liveStreams[_streamId];
        require(stream.owner != address(0), "Stream not found");
        require(
            myToken.allowance(useAddre, address(this)) >= _amount,
            "Insufficient allowance"
        );
        require(
            myToken.transferFrom(useAddre, address(this), _amount),
            "Fail to transfer token in address"
        );
        require(
            myToken.transfer(stream.owner, _amount),
            "Fail to transfer token to stream owner"
        );

        // Update tip amount
        stream.tipAmount += _amount;
    }

    function getAllActiveLiveStreams()
        public
        view
        returns (LiveStream[] memory)
    {
        // Step 1: Count active streams
        uint256 activeCount = 0;
        for (uint256 i = 0; i < liveStreams.length; i++) {
            if (liveStreams[i].status) {
                activeCount++;
            }
        }

        // Step 2: Allocate memory array and populate with active streams
        LiveStream[] memory activeStreams = new LiveStream[](activeCount);
        uint256 activeIndex = 0;
        for (uint256 i = 0; i < liveStreams.length; i++) {
            if (liveStreams[i].status) {
                activeStreams[activeIndex] = liveStreams[i];
                activeIndex++;
            }
        }

        return activeStreams;
    }

    function getMyActiveLiveStreams(
        address account
    ) public view returns (LiveStream[] memory) {
        uint256 activeCount = 0;
        // First, count the active streams owned by the account
        for (uint256 i = 0; i < liveStreams.length; i++) {
            if (liveStreams[i].status && liveStreams[i].owner == account) {
                activeCount++;
            }
        }

        LiveStream[] memory activeStreams = new LiveStream[](activeCount);
        uint256 activeIndex = 0;
        // Then, allocate and populate the array with those streams
        for (uint256 i = 0; i < liveStreams.length; i++) {
            if (liveStreams[i].status && liveStreams[i].owner == account) {
                activeStreams[activeIndex] = liveStreams[i];
                activeIndex++;
            }
        }

        return activeStreams;
    }

}
