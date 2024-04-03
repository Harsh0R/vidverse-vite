import { useEffect, useState, React, createContext } from "react";
import { createClient } from 'urql';
import { createSmartAccountClient, PaymasterMode } from "@biconomy/account";
import {
  connectWallet,
  checkIfWalletConnected,
  disconnectFromMetaMask,
  connectingWithContract,
  tokenContract
} from "../Utils/apiFeatures";
import {
  aspectRatios,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import { smartContractAddress, apiKey } from "./constants";
import { ethers } from "ethers";

export const VidverseContext = createContext();

export const VidverseProvider = ({ children }) => {

  const config = {
    privateKey: "0xf8610ba275562cbc18233acbc6b0769c943c027ef50610002633de5814e1174d",
    biconomyPaymasterApiKey: "zk3bMIEHV.caed5756-11fe-449d-954e-5468df49a9a1",
    bundlerUrl: "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
    rpcUrl: "https://rpc-mumbai.polygon.technology/",
  };

  // let provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  // let signer = new ethers.Wallet(config.privateKey, provider);

  const [account, setAccount] = useState("");
  const [smartWallet, setSmartWallet] = useState();
  const [livepeerClient, setLivepeerClient] = useState();
  const [userName, setUserName] = useState('')
  const [chatRoomName, setChatRoomName] = useState('')

  const client = createClient({
    url: 'https://api.studio.thegraph.com/query/56822/vidversegraph/v0.0.48',
  });

  useEffect(() => {
    const initializeBlockchainConnections = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
        const signer = new ethers.Wallet(config.privateKey, provider);
        const smartWallet = await createSmartAccountClient({
          signer,
          biconomyPaymasterApiKey: config.biconomyPaymasterApiKey,
          bundlerUrl: config.bundlerUrl,
        });

        setSmartWallet(smartWallet);
        setLivepeerClient(createReactClient({
          provider: studioProvider({ apiKey }),
        }));

        const account = await connectWallet();
        setAccount(account);

      } catch (error) {
        console.error("Initialization error in VidverseContext:", error);
      }
    };

    initializeBlockchainConnections();

    return () => {
      window.ethereum.removeListener('chainChanged', window.location.reload);
      window.ethereum.removeListener('accountsChanged', window.location.reload);
    };

  }, []);

  const connectToWallet = async () => {
    const account1 = await connectWallet()
    setAccount(account1);
  }



  const allVideo = async () => {
    const query = `{
      videoDatas {
        totalTipAmount
        username
        title
        owner
        likes
        ipfsHash
        genre
        dislikes
        description
        VideoPlatform_id
      }
    }`;

    try {
      const result = await client.query(query).toPromise();
      if (result.data) {
        return result.data.videoDatas;
      }
    } catch (error) {
      console.error('Error fetching stake data:', error);
    }
  };
  const allMyVideos = async (account) => {
    const query = `{
      videoDatas(where: {owner: "${account}"}) {
        totalTipAmount
        username
        title
        owner
        likes
        ipfsHash
        genre
        dislikes
        description
        VideoPlatform_id
      }
    }`;

    try {
      const result = await client.query(query).toPromise();
      if (result.data) {
        return result.data.videoDatas;
      }

    } catch (error) {
      console.error('Error fetching stake data:', error);
    }
  };
  const getVid = async (vidId) => {
    const query = `{
      videoDatas(where: {VideoPlatform_id: ${vidId}}) {
        username
        totalTipAmount
        title
        owner
        likes
        ipfsHash
        genre
        dislikes
        description
        VideoPlatform_id
      }
    }`;

    try {
      const result = await client.query(query).toPromise();
      if (result.data) {
        return result.data.videoDatas;
      }

    } catch (error) {
      console.error('Error fetching stake data:', error);
    }
  };
  const getAllLiveStreamData = async () => {
    const query = `{
      liveStreamDatas(where: {status: true}) {
        username
        totalTipAmount
        streamKey
        streamID
        stramName
        status
        playBackId
        genre
        description
        VideoPlatform_id
        owner
      }
    }`;

    try {
      const result = await client.query(query).toPromise();
      if (result.data) {
        return result.data.liveStreamDatas;
      }
    } catch (error) {
      console.error('Error fetching liveStreamDatas data:', error);
    }
  };
  const getAllMyLiveStreamData = async (account) => {
    const query = `{
      liveStreamDatas(where: {status: true, owner: "${account}"}) {
        username
        totalTipAmount
        streamKey
        streamID
        stramName
        status
        playBackId
        owner
        genre
        description
        VideoPlatform_id
      }
    }`;

    try {
      const result = await client.query(query).toPromise();
      if (result.data) {
        return result.data.liveStreamDatas;
      }
    } catch (error) {
      console.error('Error fetching liveStreamDatas data:', error);
    }
  };
  const registeredUser = async (account1) => {
    const query = `{
      userRegistereds(
        orderBy: blockTimestamp
        orderDirection: desc 
        where: {userAddress: "${account1}"}) {
        username
        userAddress
        chatRoom
      }
    }`;

    try {
      const result = await client.query(query).toPromise();
      if (result.data) {
        const name1 = result.data.userRegistereds;
        const name = name1[0].username;
        const ChatRoomName = name1[0].chatRoom;
        // console.log("name ===> ", name);
        setUserName(name);
        console.log("ChatRoom Name  == >> ", name1[0]);
        setChatRoomName(ChatRoomName);
        return name1;
      }
    } catch (error) {
      console.error('Error fetching register User name data:', error);
    }
  };
  const getAllUniqueRegisteredUsers = async () => {
    const query = `{
      userRegistereds {
        username
        userAddress
        chatRoom
      }
    }`;

    try {
      const result = await client.query(query).toPromise();
      if (result.data) {
        const users = result.data.userRegistereds;
        // Create a map to enforce uniqueness based on userAddress
        const uniqueUsers = {};
        users.forEach(user => {
          if (!uniqueUsers[user.userAddress]) { // If the userAddress hasn't been seen yet
            uniqueUsers[user.userAddress] = user; // Store the user
          }
        });

        // Convert the map back into an array of user objects
        const uniqueUsersArray = Object.values(uniqueUsers);

        // Example usage
        console.log("Unique users: ", uniqueUsersArray);
        // Assuming setUsers is a function to update the state/context with the unique users
        // setUsers(uniqueUsersArray);

        // Optionally, return the unique users array if needed
        return uniqueUsersArray;
      }
    } catch (error) {
      console.error('Error fetching registered user data:', error);
    }
  };
  const isSubscrobeThisCreator = async (creatorAcc, account1 = account) => {
    const query = `{
      subscribedToCreators(where: {creator: "${creatorAcc}", subscriber: "${account1}"}) {
        subscriber
        creator
      }
    }`
    const query1 = `{
      unsubscribedFromCreators(where: {creator: "${creatorAcc}", subscriber: "${account1}"}) {
        subscriber
        creator
      }
    }`
    // console.log("sub and Creator  ===>>> ",creatorAcc , account1);

    try {
      const result = await client.query(query).toPromise();
      const result1 = await client.query(query1).toPromise();
      if (result.data && result1.data) {
        const data = result.data.subscribedToCreators;
        const data1 = result1.data.unsubscribedFromCreators;
        // console.log("Sub Data ===>>> ",data.length);
        // console.log("Sub1 Data ===>>> ",data1.length);
        if (data.length > 0 && data1.length === 0) {
          return true
        } else {
          return false
        }
      } else {
        console.log("No data found => ", result);
        return false
      }
    } catch (error) {
      console.error('Error fetching subs data:', error);
    }
  }
  const getSubs = async (account1) => {
    const subscribeQuery = `{
      subscribedToCreators(orderBy: subscriber, where: {creator: "${account1}"}) {
        subscriber
      }
    }`;
    const unsubscribeQuery = `{
      unsubscribedFromCreators(orderBy: subscriber, where: {creator: "${account1}"}) {
        subscriber
      }
    }`;

    try {
      const subscribedResult = await client.query(subscribeQuery).toPromise();
      const unsubscribedResult = await client.query(unsubscribeQuery).toPromise();

      if (subscribedResult.data && unsubscribedResult.data) {
        const subscribedSubscribers = subscribedResult.data.subscribedToCreators.map(sub => sub.subscriber);
        const unsubscribedSubscribers = new Set(unsubscribedResult.data.unsubscribedFromCreators.map(sub => sub.subscriber));

        const currentSubscribers = subscribedSubscribers.filter(sub => !unsubscribedSubscribers.has(sub));

        console.log("Current Subscribers ===>>> ", currentSubscribers);
        return currentSubscribers;
      } else {
        console.log("No data found");
        return [];
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      return [];
    }
  }
  const getCreators = async (account1 = account) => {
    const subscribeQuery = `{
      subscribedToCreators(orderBy: creator, where: {subscriber: "${account1}"}) {
        creator
      }
    }`;
    console.log("Account in get Creator => " , account1);
    const unsubscribeQuery = `{
      unsubscribedFromCreators(orderBy: creator, where: {subscriber: "${account1}"}) {
        creator
      }
    }`;

    try {
      const subscribedResult = await client.query(subscribeQuery).toPromise();
      const unsubscribedResult = await client.query(unsubscribeQuery).toPromise();

      if (subscribedResult.data && unsubscribedResult.data) {
        const subscribedSubscribers = subscribedResult.data.subscribedToCreators.map(sub => sub.creator);
        const unsubscribedSubscribers = new Set(unsubscribedResult.data.unsubscribedFromCreators.map(sub => sub.creator));

        const currentSubscribers = subscribedSubscribers.filter(sub => !unsubscribedSubscribers.has(sub));

        console.log("Current Subscribers ===>>> ", currentSubscribers);
        return currentSubscribers;
      } else {
        console.log("No data found");
        return [];
      }
    } catch (error) {
      console.error('Error fetching creator data:', error);
      return [];
    }
  }




  const uploadVideos = async (name, desc, cid, genre, account1 = account) => {
    try {
      const connectedAccount = await checkIfWalletConnected();
      if (!connectedAccount) throw new Error("Wallet not connected");
      console.log("Addres==", account1);
      const contract = await connectingWithContract();
      const uploadVideoTxData = contract.interface.encodeFunctionData("uploadVideo", [account1, name, desc, cid, genre]);

      const uploadVideoTx = {
        to: smartContractAddress,
        data: uploadVideoTxData,
      };

      const uploadVideoResponse = await smartWallet.sendTransaction(uploadVideoTx, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });


      const uploadVideoTxHash = await uploadVideoResponse.waitForTxHash();
      console.log("Upload Video Transaction Hash", uploadVideoTxHash);
      console.log("Video uploaded by:", connectedAccount);
    } catch (error) {
      console.error("Error while uploading videos", error);
    }
  };
  const createLiveStream = async (name, playbackId, streamKey, strId, genre, desc = "", account1 = account) => {
    try {
      const connectedAccount = await checkIfWalletConnected();
      if (!connectedAccount) throw new Error("Wallet not connected");
      console.log("Addres==", account1);
      const contract = await connectingWithContract();
      const uploadVideoTxData = contract.interface.encodeFunctionData("createStream", [account1, name, desc, playbackId, streamKey, strId, genre]);

      const uploadVideoTx = {
        to: smartContractAddress,
        data: uploadVideoTxData,
      };

      const uploadVideoResponse = await smartWallet.sendTransaction(uploadVideoTx, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });

      const uploadVideoTxHash = await uploadVideoResponse.waitForTxHash();
      console.log("Stream Start Transaction Hash", uploadVideoTxHash);
      console.log("Stream created by:", connectedAccount);
    } catch (error) {
      console.error("Error while Createing stream = ", error);
    }
  };
  const stopStreamByStreamID = async (id, account1 = account) => {
    try {
      const connectedAccount = await checkIfWalletConnected();
      if (!connectedAccount) throw new Error("Wallet not connected");
      console.log("Addres==", account1);
      const contract = await connectingWithContract();
      // await contract.stopStreamByStreamID(account1 , id)
      const uploadVideoTxData = contract.interface.encodeFunctionData("stopStreamByStreamID", [account1, id]);

      const uploadVideoTx = {
        to: smartContractAddress,
        data: uploadVideoTxData,
      };

      const uploadVideoResponse = await smartWallet.sendTransaction(uploadVideoTx, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });


      const uploadVideoTxHash = await uploadVideoResponse.waitForTxHash();
      console.log("Stream Start Transaction Hash", uploadVideoTxHash);
      console.log("Stream created by:", connectedAccount);
    } catch (error) {
      console.error("Error while Createing stream = ", error);
    }
  };
  const tipVideoOwner = async (_videoId, tipAmount, useAddre = account) => {
    try {
      const _amount = await toWei(tipAmount);
      const contract = await connectingWithContract();

      console.log("Tip data === ", _videoId, "Amo =", _amount, "OW =>", useAddre);
      const tipVideoOwnerTxData = contract.interface.encodeFunctionData("tipVideoOwner", [useAddre, _videoId, _amount]);

      const tipVideoOwnerTx = {
        to: smartContractAddress,
        data: tipVideoOwnerTxData,
      };

      const tipVideoOwnerResponse = await smartWallet.sendTransaction(tipVideoOwnerTx, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });

      const tipVideoOwnerTxHash = await tipVideoOwnerResponse.waitForTxHash();
      console.log("Tip Video Owner Transaction Hash", tipVideoOwnerTxHash);
    } catch (error) {
      console.error("Error while tipping video owner", error);
    }
  };
  const registerUser = async (username, useAddre) => {
    try {
      // const _amount = await toWei(tipAmount);
      const contract = await connectingWithContract();

      // console.log("Tip data === ", _videoId, "Amo =", _amount, "OW =>", useAddre);
      const tipVideoOwnerTxData = contract.interface.encodeFunctionData("registerUser", [username, useAddre]);

      const tipVideoOwnerTx = {
        to: smartContractAddress,
        data: tipVideoOwnerTxData,
      };

      const tipVideoOwnerResponse = await smartWallet.sendTransaction(tipVideoOwnerTx, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });

      const tipVideoOwnerTxHash = await tipVideoOwnerResponse.waitForTxHash();
      console.log("Register User Transaction Hash", tipVideoOwnerTxHash);
    } catch (error) {
      console.error("Error while Register User", error);
    }
  };
  const createChatRoom = async (mychatroom, username, userAddre) => {
    try {
      // const _amount = await toWei(tipAmount);
      console.log("Tip data === ", username, "Amo =", userAddre, "OW =>", mychatroom);
      const contract = await connectingWithContract();
      // await contract.createChatRoom(username, userAddre, mychatroom)
      const tipVideoOwnerTxData = contract.interface.encodeFunctionData("createChatRoom", [username, userAddre , mychatroom]);

      const tipVideoOwnerTx = {
        to: smartContractAddress,
        data: tipVideoOwnerTxData,
      };

      const tipVideoOwnerResponse = await smartWallet.sendTransaction(tipVideoOwnerTx, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });

      const tipVideoOwnerTxHash = await tipVideoOwnerResponse.waitForTxHash();
      console.log("Create User ChatRoom Transaction Hash", tipVideoOwnerTxHash);
    } catch (error) {
      console.error("Error while Creating User chatRoom ", error);
    }
  };
  const likeVideo = async (_videoId, account1 = account) => {
    try {
      const contract = await connectingWithContract();
      console.log("Liked video Id => ", _videoId , " By => " , account1);
      // await contract.likeVideo(_videoId , account1)
      const tipVideoOwnerTxData = contract.interface.encodeFunctionData("likeVideo", [_videoId, account1]);

      const tipVideoOwnerTx = {
        to: smartContractAddress,
        data: tipVideoOwnerTxData,
      };

      const tipVideoOwnerResponse = await smartWallet.sendTransaction(tipVideoOwnerTx, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });

      const tipVideoOwnerTxHash = await tipVideoOwnerResponse.waitForTxHash();
      console.log("Like Video Transaction Hash", tipVideoOwnerTxHash);
    } catch (error) {
      console.error("Error while Like video", error);
    }
  };
  const dislikeVideo = async (_videoId, account1 = account) => {
    try {
      // const _amount = await toWei(tipAmount);
      const contract = await connectingWithContract();

      // console.log("Tip data === ", _videoId, "Amo =", _amount, "OW =>", useAddre);
      const tipVideoOwnerTxData = contract.interface.encodeFunctionData("dislikeVideo", [_videoId, account1]);

      const tipVideoOwnerTx = {
        to: smartContractAddress,
        data: tipVideoOwnerTxData,
      };

      const tipVideoOwnerResponse = await smartWallet.sendTransaction(tipVideoOwnerTx, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });

      const tipVideoOwnerTxHash = await tipVideoOwnerResponse.waitForTxHash();
      console.log("Like Video Transaction Hash", tipVideoOwnerTxHash);
    } catch (error) {
      console.error("Error while Like video", error);
    }
  };
  const subscribeToCreator = async (creatorAddress, account1 = account) => {
    try {
      // const _amount = await toWei(tipAmount);
      const contract = await connectingWithContract();

      // console.log("Tip data === ", _videoId, "Amo =", _amount, "OW =>", useAddre);
      const tipVideoOwnerTxData = contract.interface.encodeFunctionData("subscribeToCreator", [creatorAddress, account1]);

      const tipVideoOwnerTx = {
        to: smartContractAddress,
        data: tipVideoOwnerTxData,
      };

      const tipVideoOwnerResponse = await smartWallet.sendTransaction(tipVideoOwnerTx, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });

      const tipVideoOwnerTxHash = await tipVideoOwnerResponse.waitForTxHash();
      console.log("Subscribe creater Transaction Hash", tipVideoOwnerTxHash);
    } catch (error) {
      console.error("Error while Subscribe creator", error);
    }
  };
  const unsubscribeFromCreator = async (creatorAddress, account1 = account) => {
    try {
      // const _amount = await toWei(tipAmount);
      const contract = await connectingWithContract();

      // console.log("Tip data === ", _videoId, "Amo =", _amount, "OW =>", useAddre);
      const tipVideoOwnerTxData = contract.interface.encodeFunctionData("unsubscribeFromCreator", [creatorAddress, account1]);

      const tipVideoOwnerTx = {
        to: smartContractAddress,
        data: tipVideoOwnerTxData,
      };

      const tipVideoOwnerResponse = await smartWallet.sendTransaction(tipVideoOwnerTx, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });

      const tipVideoOwnerTxHash = await tipVideoOwnerResponse.waitForTxHash();
      console.log("UnSubscribe creater Transaction Hash", tipVideoOwnerTxHash);
    } catch (error) {
      console.error("Error while UnSubscribe creator", error);
    }
  };




  const hasValideAllowance = async (owner = account) => {
    try {
      const contractObj = await connectingWithContract();
      const address = await contractObj.myToken();
      console.log("Token Address === ", address);
      const tokenContractObj = await tokenContract(address);
      const data = await tokenContractObj.allowance(
        owner,
        smartContractAddress
      );
      const result = toEth(data);
      console.log("allowance === ", result);
      return result;
    } catch (e) {
      return console.error("Error in hasAllowes == ", e);
    }
  }
  const increaseAllowance = async (amount) => {
    try {
      const contractObj = await connectingWithContract();
      const address = await contractObj.myToken();
      console.log("Amount = ", amount);
      const tokenContractObj = await tokenContract(address);
      const data = await tokenContractObj.approve(
        smartContractAddress,
        toWei(amount)
      );
      console.log("DAta = ", data);
    } catch (e) {
      return console.log("Error at Increase allowence = ", e);
    }
  }
  const getBalance = async (address) => {
    try {
      const contractObj = await connectingWithContract();
      const address1 = await contractObj.myToken();
      const tokenContractObj = await tokenContract(address1);
      const balance = await tokenContractObj.balanceOf(address);
      const balEth = await toEth(balance);
      console.log("Token Balance at context = ", balEth);
      return balEth;
    } catch (error) {
      console.error("Error accor Fetching balance .....😑");
    }
  }
  const toWei = async (amount) => {
    const toWie = ethers.utils.parseUnits(amount.toString());
    return toWie.toString();
  }
  const toEth = async (amount) => {
    const toEth = ethers.utils.formatUnits(amount.toString());
    return toEth.toString();
  }



  return (
    <VidverseContext.Provider
      value={{
        account,
        userName,
        livepeerClient,
        chatRoomName,
        connectWallet,
        checkIfWalletConnected,
        disconnectFromMetaMask,
        allVideo,
        uploadVideos,
        tipVideoOwner,
        hasValideAllowance,
        increaseAllowance,
        getBalance,
        createLiveStream,
        stopStreamByStreamID,
        allMyVideos,
        getAllLiveStreamData,
        registerUser,
        connectToWallet,
        registeredUser,
        likeVideo,
        dislikeVideo,
        subscribeToCreator,
        unsubscribeFromCreator,
        getVid,
        getAllMyLiveStreamData,
        createChatRoom,
        getAllUniqueRegisteredUsers,
        isSubscrobeThisCreator,
        getSubs,
        getCreators,
        // getAllActiveLiveStreams,
        // getMyActiveLiveStreams,
      }}
    >
      {children}
    </VidverseContext.Provider>
  );
};












// const allVideo = async () => {
//   try {
//     const contract = await connectingWithContract();
//     const vid = await contract.getAllVideos();
//     const processedVideos = vid.map((video) => {
//       const processedVideo = { ...video };
//       processedVideo.id = ethers.BigNumber.from(video.id._hex).toNumber();
//       processedVideo.tipAmount = ethers.BigNumber.from(
//         video.tipAmount._hex
//       ).toString();
//       return processedVideo;
//     });

//     console.log("All vid = ", processedVideos);
//     return processedVideos;
//   } catch (error) {
//     console.error("Currently you have no videos.....😑", error);
//   }
// };


// const stopStreamByStreamID = async (id, account1 = account) => {
//   try {
//     const contract = await connectingWithContract();
//     await contract.stopStreamByStreamID(account1,id);
//   } catch (error) {
//     console.error("Error While Stop LiveStream .....😑", error);
//   }
// };

// const uploadVideos = async (name, desc, cid) => {
//   try {
//     const contract = await connectingWithContract();
//     const ms = await contract.uploadVideo(name, desc, cid);
//     console.log("messagfe = ", ms);
//   } catch (error) {
//     console.error("Error accor while uploading videos.....😑");
//   }
// };

// const tipVideoOwner = async (vidID, tipAmount) => {
//   try {
//     const contract = await connectingWithContract();
//     const amount = toWei(tipAmount);
//     console.log("Amount to transfer - ", amount);
//     await contract.tipVideoOwner(vidID, amount);
//   } catch (error) {
//     console.error("Error accor while tip to videos.....😑", error);
//   }
// };


// const fetchData = async () => {
//   try {
//     window.ethereum.on("chainChanged", () => {
//       window.location.reload();
//     });

//     window.ethereum.on("accountsChanged", () => {
//       window.location.reload();
//     });
//     // get account
//     const connectAccount = await connectWallet();
//     const contract = await connectingWithContract();

//     setAccount(connectAccount);

//     const smartWallet = await createSmartAccountClient({
//       signer,
//       biconomyPaymasterApiKey: config.biconomyPaymasterApiKey,
//       bundlerUrl: config.bundlerUrl,
//     });
//     setSmartWallet(smartWallet)

//     const livepeerClient = createReactClient({
//       provider: studioProvider({ apiKey: apiKey }),
//     });
//     setlivepeerCli(livepeerClient);

//   } catch (error) {
//     console.log("Error in fetching account in vidverseContext...", error);
//   }
// };


// const getAllActiveLiveStreams = async () => {
//   try {
//     const contract = await connectingWithContract();
//     const vid = await contract.getAllActiveLiveStreams();
//     const processedVideos = vid.map((video) => {
//       const processedVideo = { ...video };
//       processedVideo.id = ethers.BigNumber.from(video.id._hex).toNumber();
//       processedVideo.tipAmount = ethers.BigNumber.from(
//         video.tipAmount._hex
//       ).toString();
//       return processedVideo;
//     });

//     console.log("All LiveStreams = ", processedVideos);
//     return processedVideos;
//   } catch (error) {
//     console.error("Currently you have no LiveStream .....😑", error);
//   }
// };

// const getMyActiveLiveStreams = async (account1) => {
//   try {

//     // console.log("Add = ",account1);
//     const contract = await connectingWithContract();
//     const vid = await contract.getMyActiveLiveStreams(account1);
//     const processedVideos = vid.map((video) => {
//       const processedVideo = { ...video };
//       processedVideo.id = ethers.BigNumber.from(video.id._hex).toNumber();
//       processedVideo.tipAmount = ethers.BigNumber.from(
//         video.tipAmount._hex
//       ).toString();
//       return processedVideo;
//     });

//     console.log("All My LiveStreams = ", processedVideos);
//     return processedVideos;
//   } catch (error) {
//     console.error("Error in get Active LiveStream .....😑", error);
//   }
// };