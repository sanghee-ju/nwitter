import React, { useState, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { dbService, storageService } from "fBase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

const NweetFactory = ({ userObj }) => {
  /* State */
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  /* Hooks */
  const fileInput = useRef();
  /* Function */
  // input file의 파일value 초기화
  const onClearInput = () => {
    fileInput.current.value = "";
  };
  // 폼이 submit 될 때 동작
  const onSubmit = async (e) => {
    e.preventDefault();
    let fileUrl = "";
    if (attachment !== "") {
      //image 업로드
      const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
      // storage 참조 경로로 파일 업로드 하기
      //v4 => image file에 이름주기
      const response = await uploadString(fileRef, attachment, "data_url");
      // storage 참조 경로에 있는 파일의 URL을 다운로드해서 fileUrl 변수에 넣어 업로드
      fileUrl = await getDownloadURL(response.ref);
    }

    // 새 nweet object
    const newNweet = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      fileUrl: fileUrl,
    };

    // nweet 버튼 누르면, newNweet(새 nweet object) document 생성해 nweets 컬렉션에 넣기
    await addDoc(collection(dbService, "nweets"), newNweet);

    // form 비우기
    setNweet("");
    //파일 미리보기 img src 비워주기
    setAttachment("");
    // input file 초기화
    onClearInput();
  };

  // input의 value가 변경될 때
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  // input file의 value가 변경될 때,(파일이 입력될 때)
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

  // 미리보기 이미지 삭제
  const onClearAttachment = () => {
    setAttachment("");
  };
  /* Render */
  return (
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
      <input
        type="file"
        ref={fileInput}
        accept="image/*"
        onChange={onFileChange}
      />
      <input type="submit" value="Ntweet" />
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" />
          <button onClick={onClearAttachment}>clear</button>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
