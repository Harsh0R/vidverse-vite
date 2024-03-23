import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VidverseContext } from '../../Context/VidverseContext';
import imgs from '../../assets/imgs';
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { account, connectToWallet, disconnectFromMetaMask, registeredUser, getBalance } = useContext(VidverseContext);
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState();
  const [rnum, setRnum] = useState();
  const Rnum = Math.floor(Math.random() * 10);

  let navigate = useNavigate();

  const getUserName = async () => {
    const name = await registeredUser();
    // console.log("name ===> ", name[0].username);
    setUserName(name)
  }
  const handleRegisterFunc = async () => {
    if (userName) {
      let path = `/myAccount`;
      navigate(path);
    } else {
      let path = `/register`;
      navigate(path);
    }
  }

  const fetchData = async (account) => {

    if (account) {
      console.log("Account ==> ", account);
      getUserName()
      setRnum(Rnum);
      const bal = await getBalance(account);
      setBalance(bal)
    }
  }

  useEffect(() => {
    fetchData(account)
  }, [account, getBalance, registeredUser]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account);
    alert("Address copied to clipboard!");
  };

  const truncatedAccount = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : '';

  const menuItems = [
    { menu: "Home", link: "/" },
    { menu: "About", link: "/about" },
    { menu: "My Account", link: "/myAccount" },
    { menu: "Setting", link: "/setting" },
    { menu: "Register", link: "/register" },
    { menu: "Terms of Use", link: "/terms" },
  ];

  // console.log("Balamce ==> ", balance);

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>VIDVERSE</h1>
      <ul className={styles.menu}>
        {menuItems.map((item, index) => (
          <li key={index} className={styles.item}>
            <Link to={item.link}>{item.menu}</Link>
          </li>
        ))}
      </ul>
      <div className={styles.accountInfo}>
        {account && (
          <>
            <span className={styles.accountAddress}>Acc: {truncatedAccount}</span>
            <button className={styles.copyButton} onClick={copyToClipboard}>
              <img src={imgs.copyImg} alt="Copy" height="15" />
            </button>
            <span className={styles.balance}>Balance: {balance} NVT</span>
          </>
        )}
        <button className={styles.connectButton} onClick={account ? disconnectFromMetaMask : connectToWallet}>
          {account ? 'Disconnect' : 'Connect Wallet'}
        </button>
        <button className={userName ? (styles.connectButton1) : (styles.connectButton)} onClick={handleRegisterFunc}>
          {userName &&
            (
              <img className={styles.userImg} src={imgs[`image${rnum}`]} alt="Copy" />
            )
          }
          <div>
            {userName ? `${userName}` : 'Register'}
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
