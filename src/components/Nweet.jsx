import { async } from "@firebase/util";
import { dbService, storageService } from "fBase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editting, setEditting] = useState(false);
  // 수정값
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  //리터럴 - 아마 filter 작업..!
  const target = doc(dbService, "nweets", `${nweetObj.id}`);

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

  // 수정값 제출하기
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(nweetObj, newNweet);
    await updateDoc(target, { text: newNweet });
    setEditting(false);
  };
  // 수정값 입력시
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  };
  return (
    <div>
      {editting ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              onChange={onChange}
              required
            />
            <input type="submit" value="Update Nweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <div>
          <h4>{nweetObj.text}</h4>
          {nweetObj.fileUrl && (
            <img src={nweetObj.fileUrl} width="50px" height="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Nweet;
