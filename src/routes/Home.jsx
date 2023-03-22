import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { dbService } from "fBase";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const getNweets = async () => {
    const dbNweets = await getDocs(collection(dbService, "nweets"));
    dbNweets.forEach((doc) => {
      // dbNweets의 모든 document에 대해, setNweets해주기
      // 최신 nweet이 상단에 나올 수 있도록, 배열에 unshift() 해준다.
      const nweetObject = {
        ...doc.data(),
        id: doc.id,
      };
      setNweets((prev) => [nweetObject, ...prev]);
    });
  };

  //component가 mount되면, nweets들을 불러옴
  useEffect(() => {
    setNweets([]);
    getNweets();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(dbService, "nweets"), {
        nweet: nweet,
        createdAt: Date.now(),
      });

      setNweet("");
    } catch (e) {
      console.error(`Error adding document: `, e);
    }
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  console.log(nweets);

  return (
    <div>
      {/* tweet용 form */}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's on your mind"
          maxLength={120}
          name="tweet"
          value={nweet}
          onChange={onChange}
        />
        <input type="submit" value="Ntweet" />
      </form>
      <div>
        {nweets.map((nweet) => (
          <div key={nweet.id}>
            <h4>{nweet.nweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
