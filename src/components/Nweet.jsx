import React, { useState, useRef } from "react";
import { dbService, storageService } from "fBase";
import { v4 } from "uuid";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import styled from "styled-components";

const NweetTemplateBlock = styled.div`
  background-color: #f5f6fa;
  min-height: 100px;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
`;

const EditFormTemplate = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const EditInput = styled.input`
  height: 40px;
  width: 95%;
  border: none;
  outline: none;
  background-color: transparent;
`;

const EditButonBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EditBtn = styled.button`
  width: 70px;
  height: 30px;
  border-radius: 30px;
  border: 1.5px solid #1d9bf0;
  outline: none;
  cursor: pointer;
  background-color: #1d9bf0;
  color: #f5f6fa;
  margin-right: 10px;
  &:hover {
    background-color: transparent;
    color: #1d9bf0;
  }
`;

const EditAreaBlock = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 18px;
`;

const ImageTemplate = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Nweet = ({ nweetObj, isOwner, refreshUser }) => {
  const [editting, setEditting] = useState(false);
  // 수정값
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [attachment, setAttachment] = useState(nweetObj.fileUrl);
  //리터럴 - 아마 filter 작업..!
  const target = doc(dbService, "nweets", `${nweetObj.id}`);
  const fileInput = useRef();
  const onDeleteClick = async () => {
    //:삭제 전 확인 작업 => true | false
    const ok = confirm("Are you sure you want to delete this nweet?");
    // 삭제할 파일의 reference 만들기
    const storage = getStorage();
    const deleteRef = ref(storage, nweetObj.fileUrl);

    if (ok) {
      //delete nweet
      console.log("삭제!");
      //삭제하기
      await deleteDoc(target);
      // 파일 삭제하기
      if (nweetObj.fileUrl !== "") {
        deleteObject(deleteRef)
          .then(() => {
            //file delete successfully
            alert("파일 삭제가 완료되었습니다!");
          })
          .catch((err) => {
            // Uh-oh,,, an error occured!
            alert("오류가 발생하였습니다:(");
          });
      }
    }
  };

  // 수정모드 토글
  const toggleEditing = () => {
    setEditting((prev) => !prev);
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

  // 수정값 제출하기
  const onSubmit = async (e) => {
    e.preventDefault();
    let fileUrl = "";
    if (attachment !== "") {
      //image 업로드
      const fileRef = ref(storageService, `${nweetObj.id}/${v4()}`);
      // storage 참조 경로로 파일 업로드 하기
      //v4 => image file에 이름주기
      const response = await uploadString(fileRef, attachment, "data_url");
      // storage 참조 경로에 있는 파일의 URL을 다운로드해서 fileUrl 변수에 넣어 업로드
      fileUrl = await getDownloadURL(response.ref);
    }
    await updateDoc(target, { text: newNweet, fileUrl: fileUrl });
    setEditting(false);
    refreshUser();
  };
  // 수정값 입력시
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  };

  /* Style Block */

  return (
    <NweetTemplateBlock>
      {editting ? (
        <EditFormTemplate>
          <form
            onSubmit={onSubmit}
            style={{ height: "80%", display: "flex", flexDirection: "column" }}
          >
            <EditInput
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              onChange={onChange}
              required
            />
            <label htmlFor="editFile">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "15px",
                  cursor: "pointer",
                  color: "#2d3436",
                }}
              >
                <BiEdit style={{ fontSize: "20px" }} />
                <span>이미지 변경</span>
              </div>
              <input
                type="file"
                ref={fileInput}
                onChange={onFileChange}
                accept="image/*"
                id="editFile"
                style={{ display: "none" }}
              />
            </label>
            <img
              src={attachment}
              width="80px"
              height="80px"
              style={{ borderRadius: "5px" }}
            />
          </form>

          <EditButonBlock>
            <EditBtn onClick={onSubmit}>Update</EditBtn>
            <EditBtn onClick={toggleEditing}>Cancel</EditBtn>
          </EditButonBlock>
        </EditFormTemplate>
      ) : (
        <div>
          {isOwner ? (
            <EditAreaBlock>
              <div
                onClick={onDeleteClick}
                style={{ marginRight: "10px", cursor: "pointer" }}
              >
                <AiOutlineDelete />
              </div>
              <div onClick={toggleEditing}>
                <AiOutlineEdit />
              </div>
            </EditAreaBlock>
          ) : (
            <div style={{ height: "20px" }}></div>
          )}
          <div style={{ marginBottom: "20px" }}>{nweetObj.text}</div>
          <ImageTemplate>
            {nweetObj.fileUrl && (
              <img
                src={attachment}
                style={{
                  width: "70%",
                  aspectRatio: "1/1",
                  borderRadius: "10px",
                }}
              />
            )}
          </ImageTemplate>
        </div>
      )}
    </NweetTemplateBlock>
  );
};

export default Nweet;
