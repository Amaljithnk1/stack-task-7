// UserProfile.jsx

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake, faPen, faClock } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import Avatar from "../../components/Avatar/Avatar";
import EditProfileForm from "./EditProfileForm";
import ProfileBio from "./ProfileBio";
import { getLoginHistory } from "../../api";
import "./UsersProfile.css";

const UserProfile = ({ slideIn, handleSlideIn }) => {
  const { id } = useParams();
  const users = useSelector((state) => state.usersReducer);
  const currentProfile = users.find((user) => user._id === id);
  const currentUser = useSelector((state) => state.currentUserReducer);
  const [loginHistory, setLoginHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loginHistoryVisible, setLoginHistoryVisible] = useState(false);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        const response = await getLoginHistory(id);
        setLoginHistory(response.data);
      } catch (error) {
        console.error('Error fetching login history:', error);
      }
    };

    fetchLoginHistory();
  }, [id]);

  const setSwitch = (value) => {
    setIsEditing(value);
  };

  return (
    <div className="home-container-1">
      <LeftSidebar slideIn={slideIn} handleSlideIn={handleSlideIn} />
      <div className="home-container-2">
        <section>
          <div className="user-details-container">
            <div className="user-details">
              <Avatar
                backgroundColor="purple"
                color="white"
                fontSize="50px"
                px="40px"
                py="30px"
              >
                {currentProfile?.name.charAt(0).toUpperCase()}
              </Avatar>
              <div className="user-name">
                <h1>{currentProfile?.name}</h1>
                <p>
                  <FontAwesomeIcon icon={faBirthdayCake} /> Joined{" "}
                  {moment(currentProfile?.joinedOn).fromNow()}
                </p>
              </div>
            </div>
            <div className="user-actions">
              {currentUser?.result._id === id && (
                <>
                  <button
                    type="button"
                    onClick={() => setSwitch(true)}
                    className="edit-profile-btn"
                  >
                    <FontAwesomeIcon icon={faPen} /> Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginHistoryVisible(!loginHistoryVisible)}
                    className="view-login-history-btn"
                  >
                    <FontAwesomeIcon icon={faClock} /> View Login History
                  </button>
                </>
              )}
            </div>
          </div>
          <>
            {isEditing ? (
              <EditProfileForm
                currentUser={currentUser}
                setSwitch={setSwitch}
              />
            ) : (
              <>
                <ProfileBio currentProfile={currentProfile} />
                {loginHistoryVisible && (
                  <div className="login-history-container">
                    <h3>Login History</h3>
                    <ul>
                      {loginHistory.map((login) => (
                        <li key={login._id}>
                          <p>Login Time: {moment(login.login_time).format('LLLL')}</p>
                          <p>Browser: {login.browser}</p>
                          <p>Operating System: {login.operating_system}</p>
                          <p>Device Type: {login.device_type}</p>
                          <p>IP Address: {login.ip_address}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </>
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
