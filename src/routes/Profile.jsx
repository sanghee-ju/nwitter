import { authService, dbService } from "fBase";
import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nweet from "components/Nweet";

const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [editMode, setEditMode] = useState(false);
  const [myNweet, setMyNweet] = useState([]);

  const auth = getAuth();
  const navigate = useNavigate();
  const onLogOutClick = (e) => {
    const {
      target: { name },
    } = e;
    if (name === "signout") {
      auth.signOut();
      navigate("/");
    } else if (name === "edit") {
      setEditMode((prev) => !prev);
    }
  };

  const getMyNweets = async () => {
    // collection 불러오는 reference 생성
    const nweetsRef = collection(dbService, "nweets");
    // 검색 쿼리
    // where(field name|operation|condition)
    // 정렬이 지원되지 않는다! 따라서, firestore에서 '사전쿼리'인 index를 생성해줘야 한다.
    const nweets = query(
      nweetsRef,
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );

    //getDocs() 메서드로 쿼리 결과 값 가져오기
    const querySnapshot = await getDocs(nweets);
    // console.log(querySnapshot.forEach());
    onSnapshot(nweets, (snapshot) => {
      const mynweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyNweet(mynweetArr);
    });
    console.log(myNweet);
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      //수정 가능
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      // userObj 업데이트
      setEditMode((prev) => !prev);
      refreshUser();
    }
  };

  useEffect(() => {
    getMyNweets();
  }, [userObj]);

  return (
    <div style={{ width: "430px" }}>
      <div
        style={{
          height: "50px",
          display: "flex",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <button
          style={{
            width: "80px",
            height: "40px",
            borderRadius: "40px",
            border: "none",
            outline: "none",
            backgroundColor: "#1d9bf0",
            color: "#f5f6fa",
            marginRight: "10px",
          }}
          name="signout"
          onClick={onLogOutClick}
        >
          Sign Out
        </button>
        <button
          style={{
            width: "80px",
            height: "40px",
            borderRadius: "40px",
            border: "none",
            outline: "none",
            backgroundColor: "#1d9bf0",
            color: "#f5f6fa",
          }}
          name="edit"
          onClick={onLogOutClick}
        >
          Edit
        </button>
      </div>
      <div style={{ border: "1px solid #1d9bf0" }} />
      <h4 style={{ color: "#1d9bf0", fontSize: "18px" }}>닉네임</h4>
      {editMode ? (
        <form
          onSubmit={onSubmit}
          style={{
            display: "flex",
            backgroundColor: "transparent",
            height: "60px",
            alignItems: "center",
            padding: "10px",
            border: "1.5px solid #1d9bf0",
            borderRadius: "60px",
            outline: "none",
          }}
        >
          <input
            style={{
              width: "80%",
              height: "70%",
              marginRight: "5px",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              paddingLeft: "10px",
              color: "#1d9bf0",
              fontSize: "18px",
            }}
            type="text"
            name=""
            value={newDisplayName}
            onChange={onChange}
            placeholder="Display name"
            id=""
          />
          <input
            style={{
              height: "50px",
              width: "80px",
              borderRadius: "50px",
              border: "1.5px solid #1d9bf0",
              outline: "none",
              cursor: "pointer",
              backgroundColor: "#1d9bf0",
              color: "#f5f6fa",
            }}
            type="submit"
            value="Update"
          />
        </form>
      ) : (
        <div style={{ color: "#f5f6fa", fontSize: "18px" }}>
          {userObj.displayName}
        </div>
      )}
      <h4 style={{ color: "#1d9bf0" }}>내 Nweet</h4>
      <div>
        {myNweet.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
