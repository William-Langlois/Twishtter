import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { User, UserInfo } from "@prisma/client";

export type UserProps = {
  id: string;
  name: string;
  email: string;
  image: string;
  createdAt:string;
  updatedAt:string;
  info: UserInfo;
};

const User: React.FC<{ user: UserProps }> = ({ user }) => {
  const authorName = user.name ? user.name : "Unknown author";
  return (
    <div className="user-div" onClick={() => Router.push("/profile/[id]", `/profile/${user.id}`)}>
      
      <style jsx>{`
        .post-div{
          color:inherit;
          border-width:1px;
          border-style:solid;
          border-radius:2em;

          background:white;

          padding:1em;
          margin-bottom:1em;

          transition: box-shadow 0.1s ease-in;
        }

        .post-div:hover{
          box-shadow: 1px 1px 3px #aaa;
          cursor:pointer;

          color:inherit;
          border-width:1px;
          border-style:solid;
          border-radius:2em;

          background:white;

          padding:1em;
          margin-bottom:1em;

          transition: box-shadow 0.1s ease-in;
        }

        .post-author{
          display:flex;
          flex-direction:row;
          justify-content:flex-start;
          align-items:center;
        }

        .post-author-avatar-image {
          border-radius:100%;
          margin-right:0.8em;
        }

        .post-author-name{
          font-weight:600;
        }
      `}</style>
    </div>
  );
};

export default User;
