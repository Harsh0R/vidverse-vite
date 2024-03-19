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

  let provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  let signer = new ethers.Wallet(config.privateKey, provider);

  const [account, setAccount] = useState("");
  const [smartWallet, setSmartWallet] = useState();
  const [livepeerClient, setLivepeerClient] = useState();

  const client = createClient({
    url: 'https://api.studio.thegraph.com/query/56822/vidversegraph/version/latest',
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

  const allVideo = async () => {
    const query = `{
      videoDatas {
        title
        totalTipAmount
        ipfsHash
        VideoPlatform_id
        description
        owner
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
        title
        totalTipAmount
        ipfsHash
        VideoPlatform_id
        description
        owner
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
        streamKey
        streamID
        stramName
        playBackId
        status
        owner
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

  const getAllActiveLiveStreams = async () => {
    try {
      const contract = await connectingWithContract();
      const vid = await contract.getAllActiveLiveStreams();
      const processedVideos = vid.map((video) => {
        const processedVideo = { ...video };
        processedVideo.id = ethers.BigNumber.from(video.id._hex).toNumber();
        processedVideo.tipAmount = ethers.BigNumber.from(
          video.tipAmount._hex
        ).toString();
        return processedVideo;
      });

      console.log("All LiveStreams = ", processedVideos);
      return processedVideos;
    } catch (error) {
      console.error("Currently you have no LiveStream .....😑", error);
    }
  };

  const getMyActiveLiveStreams = async (account1) => {
    try {

      // console.log("Add = ",account1);
      const contract = await connectingWithContract();
      const vid = await contract.getMyActiveLiveStreams(account1);
      const processedVideos = vid.map((video) => {
        const processedVideo = { ...video };
        processedVideo.id = ethers.BigNumber.from(video.id._hex).toNumber();
        processedVideo.tipAmount = ethers.BigNumber.from(
          video.tipAmount._hex
        ).toString();
        return processedVideo;
      });

      console.log("All My LiveStreams = ", processedVideos);
      return processedVideos;
    } catch (error) {
      console.error("Error in get Active LiveStream .....😑", error);
    }
  };

  const uploadVideos = async (name, desc, cid, account1 = account) => {
    try {
      const connectedAccount = await checkIfWalletConnected();
      if (!connectedAccount) throw new Error("Wallet not connected");
      console.log("Addres==", account1);
      const contract = await connectingWithContract();
      const uploadVideoTxData = contract.interface.encodeFunctionData("uploadVideo", [account1, name, desc, cid]);

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

  const createLiveStream = async (name, playbackId, streamKey, strId, desc = "", account1 = account) => {
    try {
      const connectedAccount = await checkIfWalletConnected();
      if (!connectedAccount) throw new Error("Wallet not connected");
      console.log("Addres==", account1);
      const contract = await connectingWithContract();
      const uploadVideoTxData = contract.interface.encodeFunctionData("createStream", [account1, name, desc, playbackId, streamKey, strId]);

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


  const hasValideAllowance = async (owner = account) => {
    try {
      const contractObj = await connectingWithContract();
      const address = await contractObj.myToken();
      console.log("Token Address === ",address);
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
      console.error("Error accor while uploading videos.....😑");
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
        livepeerClient,
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
        getAllActiveLiveStreams,
        stopStreamByStreamID,
        getMyActiveLiveStreams,
        allMyVideos,
        getAllLiveStreamData,
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