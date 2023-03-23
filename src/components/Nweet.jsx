import { async } from "@firebase/util";
import { dbService } from "fBase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
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
    if (ok) {
      //delete nweet
      console.log("삭제!");
      //삭제하기
      await deleteDoc(target);
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
