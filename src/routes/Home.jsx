import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { dbService, storageService } from "fBase";
import Nweet from "components/Nweet";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

const Home = ({ userObj }) => {
  // 우리가 원하는 것은 uid
  // => userObj.uid
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");

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

  const onSubmit = async (e) => {
    e.preventDefault();
    //image 업로드
    const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
    // storage 참조 경로로 파일 업로드 하기
    //v4 => image file에 이름주기
    const response = await uploadString(fileRef, attachment, "data_url");
    console.log(response);
    // storage 참조 경로에 있는 파일의 URL을 다운로드해서 fileUrl 변수에 넣어 업로드
    let fileUrl = await getDownloadURL(response.ref);
    console.log(fileUrl);

    // text 업로드
    // try {
    //   const docRef = await addDoc(collection(dbService, "nweets"), {
    //     text: nweet,
    //     createdAt: Date.now(),
    //     creatorId: userObj.uid,
    //   });
    // } catch (e) {
    //   console.error(`Error adding document: `, e);
    // }
    // setNweet("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  const onFileChange = (e) => {
    // input:file에 입력된 file 가져오기
    const {
      target: { files },
    } = e;
    // file의 이미지 파일 가져오기
    const theFile = files[0];
    // 파일 리더 api 사용하기
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      // 파일 읽기 끝나면, finishedEvent 받음
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    // 파일 읽기 시작 ---
    reader.readAsDataURL(theFile);
    console.log(theFile);
  };

  const onClearAttachment = () => {
    setAttachment("");
  };

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
        {/* 파일 입력기 */}
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Ntweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>clear</button>
          </div>
        )}
      </form>

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
