import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"

import prisma from '../lib/prisma';



export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    orderBy:{
      createdAt: "desc"
    },
    where: { published: true },
    include: {
      author: {
        select: { name:true, image:true },
      },
    },
  });
  return {
    props: JSON.parse(JSON.stringify({ feed })),
    revalidate: 10,
  };
};

type Props = {
  feed: PostProps[]
}

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Blog
