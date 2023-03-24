import { authService, dbService } from "fBase";
import { getAuth, updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const auth = getAuth();
  const navigate = useNavigate();
  const onLogOutClick = () => {
    auth.signOut();
    navigate("/");
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
      refreshUser();
    }
  };

  useEffect(() => {
    getMyNweets();
  }, [userObj]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name=""
          value={newDisplayName}
          onChange={onChange}
          placeholder="Display name"
          id=""
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
