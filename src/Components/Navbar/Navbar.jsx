import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { useDispatch } from "react-redux";
import { logout } from "../../firebaseLogics/config";
import { auth } from "../../api/firebaseConfig";
import { Link } from "react-router-dom";

function Navbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useDispatch();
  let user = JSON.parse(localStorage.getItem("localUser"));
  const [users, setUsers] = useState("");
  useEffect(() => {
    auth.onAuthStateChanged((e) => {
      setUsers(e);
    });
  }, []);
  return (
    <header>
      <div className="nav-container">
        <nav className="navbar">
          <h2>{users?.displayName}</h2>
          <div className="dropdown">
            <div
              className="btn"
              onClick={() => setDropdownVisible(!dropdownVisible)}
            >
              <h1><i class="fa-solid fa-gear"></i></h1>
            </div>
            <ul className={`dropdown-menu ${dropdownVisible ? "active" : ""}`}>
              <li>{user?.displayName}</li>
              <Link to={`/home/user/${user?.uid}`}>
                <li>
                  Settings <FontAwesomeIcon icon={faGear} />
                </li>
              </Link>
              <Link >
                <li onClick={() => dispatch(logout())}>
                  Sign out <i class="fa-solid fa-arrow-right-from-bracket"></i>
                </li>
              </Link>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
