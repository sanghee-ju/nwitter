import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { dbService } from "fBase";
import Nweet from "components/Nweet";

import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
  /* State */
  // nweets collection에 담긴 document 가져오기
  const [nweets, setNweets] = useState([]);
  /* Hooks */
  //component가 mount되면, nweets들을 불러옴
  // firestore에 저장해서 실시간 test 확일할 땐 createAt 속성 추가해주기
  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);

  /* Render */
  return (
    <div>
      {/* tweet용 form */}
      <NweetFactory userObj={userObj} />
      <div>
        {nweets.map((nweet) => (
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

export default Home;
