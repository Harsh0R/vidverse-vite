import { useEffect, useState, React, createContext } from "react";
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
  const [smartWallet, setSmartWallet] = useState()
  const [livepeerCli, setlivepeerCli] = useState();

  const fetchData = async () => {
    try {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
      // get account
      const connectAccount = await connectWallet();
      const contract = await connectingWithContract();

      setAccount(connectAccount);

      const smartWallet = await createSmartAccountClient({
        signer,
        biconomyPaymasterApiKey: config.biconomyPaymasterApiKey,
        bundlerUrl: config.bundlerUrl,
      });
      setSmartWallet(smartWallet)

      const livepeerClient = createReactClient({
        provider: studioProvider({ apiKey: apiKey }),
      });
      setlivepeerCli(livepeerClient);

    } catch (error) {
      console.log("Error in fetching account in vidverseContext...", error);
    }
  };


  useEffect(() => {

    fetchData();
  }, []);

  const allVideo = async () => {
    try {
      const contract = await connectingWithContract();
      const vid = await contract.getAllVideos();
      const processedVideos = vid.map((video) => {
        const processedVideo = { ...video };
        processedVideo.id = ethers.BigNumber.from(video.id._hex).toNumber();
        processedVideo.tipAmount = ethers.BigNumber.from(
          video.tipAmount._hex
        ).toString();
        return processedVideo;
      });

      console.log("All vid = ", processedVideos);
      return processedVideos;
    } catch (error) {
      console.error("Currently you have no videos.....😑", error);
    }
  };
  // const uploadVideos = async (name, desc, cid) => {
  //   try {
  //     const contract = await connectingWithContract();
  //     const ms = await contract.uploadVideo(name, desc, cid);
  //     console.log("messagfe = ", ms);
  //   } catch (error) {
  //     console.error("Error accor while uploading videos.....😑");
  //   }
  // };
  const uploadVideos = async (name, desc, cid, account1 = account) => {
    try {
      const connectedAccount = await checkIfWalletConnected(); // This should return the current user's wallet address
      if (!connectedAccount) throw new Error("Wallet not connected");
      console.log("Addres==", account1);
      const contract = await connectingWithContract();
      const uploadVideoTxData = contract.interface.encodeFunctionData("uploadVideo", [account1, name, desc, cid]);

      const uploadVideoTx = {
        to: smartContractAddress, // Your contract address
        data: uploadVideoTxData,
      };

      const uploadVideoResponse = await smartWallet.sendTransaction(uploadVideoTx, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });


      const uploadVideoTxHash = await uploadVideoResponse.waitForTxHash();
      console.log("Upload Video Transaction Hash", uploadVideoTxHash);
      console.log("Video uploaded by:", connectedAccount); // Log or handle the connected account as needed
    } catch (error) {
      console.error("Error while uploading videos", error);
    }
  };


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
  
  const tipVideoOwner = async (vidID, tipAmount, account1 = account) => {
    try {
      const amount = await toWei(tipAmount); // Convert tip amount to Wei
      const contract = await connectingWithContract();
      const tipVideoOwnerTxData = contract.interface.encodeFunctionData("tipVideoOwner", [account1, vidID, amount]);

      const tipVideoOwnerTx = {
        to: smartContractAddress, // Your contract address
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


  const hasValideAllowance = async (owner) => {
    try {
      const contractObj = await connectingWithContract();
      const address = await contractObj.myToken();

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
      const contract = await connectingWithContract();
      const balance = await contract.getBalance(address);
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
        livepeerCli,
        connectWallet,
        checkIfWalletConnected,
        disconnectFromMetaMask,
        allVideo,
        uploadVideos,
        tipVideoOwner,
        hasValideAllowance,
        increaseAllowance,
        getBalance
      }}
    >
      {children}
    </VidverseContext.Provider>
  );
};
