import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VidverseContext } from '../../Context/VidverseContext';
import imgs from '../../assets/imgs';
import styles from "./Navbar.module.css";
import { FaBars, FaTimes } from 'react-icons/fa'; // You can use react-icons for menu icons

import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { account, connectToWallet, disconnectFromMetaMask, registeredUser, getBalance } = useContext(VidverseContext);
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [rnum, setRnum] = useState();
  const Rnum = Math.floor((Math.random() * 9) + 1);

  let navigate = useNavigate();

  const getUserName = async (account1) => {
    // const acc = account
    const data = await registeredUser(account1);
    const name = data[0].username;
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
      getUserName(account)
      // console.log(Rnum);
      setRnum(Rnum);
      const bal = await getBalance(account);
      console.log("Bal ==> " , bal);
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
    { menu: "Call Room", link: "/callroom" },
  ];

  const handleBack = () => {
    let path = `/`;
    navigate(path);
  }

  return (
    <nav className={styles.navbar}>
      <h1 onClick={handleBack} className={styles.logo}>VIDVERSE</h1>
      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={styles.mobileMenuIcon}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      <ul className={`${styles.menu} ${isMobileMenuOpen ? styles.menuActive : ''}`}>
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
