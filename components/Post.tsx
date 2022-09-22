import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { Post } from "@prisma/client";

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
    image:string | null;
  } | null;
  content: string;
  published: boolean;
  comments: [
    {
      author: {
        name: string;
        email: string;
        image: string | null;
      } | null,
      content: string;
      post:Post;
      createdAt: string;
    }
  ] | null;
  createdAt:string;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div className="post-div" onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <div className='post-author'>
        <img src={post?.author?.image || "defaultAvatarUrl"} width="50" height="50" className="post-author-avatar-image" alt={post?.author?.name + "'s avatar"}/>
        <p className='post-author-name'>{post?.author?.name || 'an unknown author'}</p>
      </div>
      <h2 className='post-title'>{post.title}</h2>
      <div className='post-content'>
        <ReactMarkdown children={post.content} />
      </div>
      <style jsx>{`
        .post-div{
          color:inherit;
          border-width:1px;
          border-style:solid;
          border-radius:2em;

          padding:1em;
          margin-bottom:1em;
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

export default Post;
