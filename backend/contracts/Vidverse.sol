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
        string username;
        uint256 likes;
        uint256 dislikes;
        string genre;
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
        string username;
        uint256 likes;
        uint256 dislikes;
        string genre;
    }

    struct User {
        address addr;
        string username;
        address[] subscriptions; // Add this line
    }

    mapping(address => User) public users;
    // Maps video ID to a mapping of user addresses to a boolean indicating if they've liked/disliked
    mapping(uint256 => mapping(address => bool)) public videoLikes;
    mapping(uint256 => mapping(address => bool)) public videoDislikes;

    // Similar mappings for live streams
    mapping(uint256 => mapping(address => bool)) public streamLikes;
    mapping(uint256 => mapping(address => bool)) public streamDislikes;
    mapping(string => bool) private usernameTaken;

    Video[] public videos;
    LiveStream[] public liveStreams;
    ERC20 public myToken;

    event StreamStopped(uint256 indexed id, address owner);

    event UserRegistered(address indexed userAddress, string username);
    event SubscribedToCreator(
        address indexed subscriber,
        address indexed creator
    );
    event UnsubscribedFromCreator(
        address indexed subscriber,
        address indexed creator
    );

    event VideoUploaded(
        uint256 id,
        address owner,
        string title,
        string description,
        string ipfsHash
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
        bool status,
        string streamKey,
        string streamID
    );
    
    event StreamTipped(
        uint256 indexed streamId,
        address indexed owner,
        address tipper,
        uint256 amount,
        uint256 newTipAmount
    );

    constructor() {
        MyToken token = new MyToken();
        myToken = token;
    }

    function registerUser(string memory _username, address userAddress) public {
        require(!usernameTaken[_username], "Username is already taken");
        require(
            bytes(users[userAddress].username).length == 0,
            "Address already registered"
        );

        users[userAddress] = User(userAddress, _username, new address[](0));
        usernameTaken[_username] = true;
        emit UserRegistered(userAddress, _username); // Emit event here
    }

    function uploadVideo(
        address userAddr,
        string memory _title,
        string memory _description,
        string memory _ipfsHash,
        string memory _genre
    ) public {
        require(
            bytes(users[userAddr].username).length > 0,
            "User must be registered"
        );

        for (uint256 i = 0; i < videos.length; i++) {
            require(
                keccak256(abi.encodePacked(videos[i].ipfsHash)) !=
                    keccak256(abi.encodePacked(_ipfsHash)),
                "Video with the same IPFS hash already exists"
            );
        }

        uint256 id = videos.length;
        videos.push(
            Video(
                videos.length,
                userAddr,
                _title,
                _description,
                _ipfsHash,
                0,
                users[userAddr].username,
                0,
                0,
                _genre
            )
        );
        myToken.transfer(userAddr, 100 * 10 ** 18);
        emit VideoUploaded(id, userAddr, _title, _description, _ipfsHash);
    }

    function likeVideo(uint256 _videoId) public {
        require(_videoId < videos.length, "Invalid video ID");
        require(!videoLikes[_videoId][msg.sender], "Already liked this video");
        require(
            !videoDislikes[_videoId][msg.sender],
            "Already disliked this video, cannot like"
        );

        videoLikes[_videoId][msg.sender] = true;
        videos[_videoId].likes += 1;
    }

    function dislikeVideo(uint256 _videoId) public {
        require(_videoId < videos.length, "Invalid video ID");
        require(
            !videoDislikes[_videoId][msg.sender],
            "Already disliked this video"
        );
        require(
            !videoLikes[_videoId][msg.sender],
            "Already liked this video, cannot dislike"
        );

        videoDislikes[_videoId][msg.sender] = true;
        videos[_videoId].dislikes += 1;
    }

    function createStream(
        address userAddr,
        string memory _title,
        string memory _description,
        string memory _playbackId,
        string memory streamKey,
        string memory _streamID,
        string memory _genre
    ) public {
        require(
            bytes(users[userAddr].username).length > 0,
            "User must be registered"
        );

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
                _streamID,
                users[userAddr].username,
                0,
                0,
                _genre
            )
        );
        myToken.transfer(userAddr, 1000 * 10 ** 18);
        emit CreatedStream(
            id,
            userAddr,
            _title,
            _description,
            _playbackId,
            true,
            streamKey,
            _streamID
        );
    }

    function stopStreamByStreamID(
        address useAddress,
        string memory _streamID
    ) public {
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

    function subscribeToCreator(address creatorAddress) public {
        User storage user = users[msg.sender];
        require(user.addr != address(0), "User must be registered");
        for (uint i = 0; i < user.subscriptions.length; i++) {
            require(
                user.subscriptions[i] != creatorAddress,
                "Already subscribed"
            );
        }
        user.subscriptions.push(creatorAddress);
        emit SubscribedToCreator(msg.sender, creatorAddress); // Emit event here
    }

    function unsubscribeFromCreator(address creatorAddress) public {
        User storage user = users[msg.sender];
        require(user.addr != address(0), "User must be registered");
        int256 index = -1;
        for (uint i = 0; i < user.subscriptions.length; i++) {
            if (user.subscriptions[i] == creatorAddress) {
                index = int256(i);
                break;
            }
        }
        require(index >= 0, "Not subscribed to this creator");
        user.subscriptions[uint256(index)] = user.subscriptions[
            user.subscriptions.length - 1
        ];
        user.subscriptions.pop();
        emit UnsubscribedFromCreator(msg.sender, creatorAddress); // Emit event here
    }

    function getMySubscriptions() public view returns (address[] memory) {
        return users[msg.sender].subscriptions;
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
        emit VideoTipped(
            _videoId,
            video.owner,
            userAddre,
            _amount,
            video.tipAmount
        );
    }

    function tipStreamOwner(
        address userAddr,
        uint256 _streamId,
        uint256 _amount
    ) public payable {
        require(_streamId < liveStreams.length, "Invalid Stream ID");
        require(_amount > 0, "Amount must be greater than 0");
        LiveStream storage stream = liveStreams[_streamId];
        require(stream.owner != address(0), "Stream not found");
        require(
            myToken.allowance(userAddr, address(this)) >= _amount,
            "Insufficient allowance"
        );
        require(
            myToken.transferFrom(userAddr, address(this), _amount),
            "Fail to transfer token in address"
        );
        require(
            myToken.transfer(stream.owner, _amount),
            "Fail to transfer token to stream owner"
        );
        stream.tipAmount += _amount;
        emit StreamTipped(
            _streamId,
            stream.owner,
            userAddr,
            _amount,
            stream.tipAmount
        ); // Emit event here
    }

}
