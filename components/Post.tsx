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
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      <ReactMarkdown children={post.content} />
      <style jsx>{`
        div {
          color: inherit;username
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;
