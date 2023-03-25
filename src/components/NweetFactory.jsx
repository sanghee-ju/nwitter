import React, { useState, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { dbService, storageService } from "fBase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import styled from "styled-components";
import { BsArrowRightShort } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";

/* Style Block */
const NweetFactoryForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SubmitNweet = styled.div`
  height: 50px;
  display: flex;
  border: 1.3px solid #1d9bf0;
  border-radius: 60px;
`;

const NweetInput = styled.input`
  width: 90%;
  height: 90%;
  border: none;
  border-radius: 5px;
  outline: none;
  background: transparent;
  padding-left: 10px;
  color: #1d9bf0;

  &::placeholder {
    color: #1d9bf0;
  }
`;

const SubmitBtn = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  outline: none;
  display: flex;
  background-color: #1d9bf0;
  color: white;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
`;

const ImageAttatchLabel = styled.label`
  textalign: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  color: #1d9bf0;
  margin-top: 10px;
`;

const PreviewTemplateBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  margin-top: 5px;
  align-items: center;
`;

const PreviewImage = styled.img`
  width: 90%;
  aspect-ratio: 1/1;
  margin-bottom: 5px;
  border-radius: 10px;
`;

const PreviewImageDelete = styled.button`
  width: 90%;
  border-radius: 20px;
  border: 1.5px solid #1d9bf0;
  outline: none;
  background-color: #1d9bf0;
  color: white;
  padding: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    background-color: transparent;
    color: #1d9bf0;
  }
`;

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
    <NweetFactoryForm onSubmit={onSubmit}>
      <SubmitNweet>
        <NweetInput
          type="text"
          placeholder="무슨 생각을 하고 있나요?"
          maxLength={120}
          name="tweet"
          value={nweet}
          onChange={onChange}
        />
        <SubmitBtn onClick={onSubmit}>
          <BsArrowRightShort />
        </SubmitBtn>
      </SubmitNweet>
      {/* 파일 입력기 */}
      <ImageAttatchLabel htmlFor="attachImage">
        <span style={{ marginRight: "5px" }}>Add Photo</span>
        <AiOutlinePlus />
        <input
          type="file"
          ref={fileInput}
          accept="image/*"
          onChange={onFileChange}
          id="attachImage"
          style={{ display: "none" }}
        />
      </ImageAttatchLabel>

      {attachment && (
        <PreviewTemplateBlock>
          <PreviewImage src={attachment} />
          <PreviewImageDelete onClick={onClearAttachment}>
            Clear!
          </PreviewImageDelete>
        </PreviewTemplateBlock>
      )}
    </NweetFactoryForm>
  );
};

export default NweetFactory;
