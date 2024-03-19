import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VidverseContext } from '../../Context/VidverseContext';
import imgs from '../../assets/imgs';
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { account, connectWallet, disconnectFromMetaMask, getBalance } = useContext(VidverseContext);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (account) {
      getBalance(account).then(setBalance);
    }
  }, [account, getBalance]);

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
    { menu: "FAQs", link: "/faqs" },
    { menu: "Terms of Use", link: "/terms" },
  ];

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
        <button className={styles.connectButton} onClick={account ? disconnectFromMetaMask : connectWallet}>
          {account ? 'Disconnect' : 'Connect Wallet'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
