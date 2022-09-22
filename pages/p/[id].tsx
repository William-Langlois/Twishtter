// pages/p/[id].tsx

import React, {useState} from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import Layout from '../../components/Layout';
import { PostProps } from '../../components/Post';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import { stringify } from 'querystring';
import { TextArea } from '@builder.io/react';



async function deletePost(postId: string): Promise<void> {
  await fetch(`/api/post/${postId}`, {
      method: 'DELETE',
  });
  Router.push('/');
}

async function publishPost(postId: string): Promise<void> {
  await fetch(`/api/publish/${postId}`, {
      method: 'PUT',
  });
  await Router.push('/');
}



export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true, image:true },
      },
      comments:{
        orderBy:{
          createdAt:"desc"
        },
        select: {
          content: true, 
          author:{
            select:{
              name:true,
              email:true,
              image:true
            }
          },
          createdAt:true
        },
      }
    },
  });

  return {
    props: JSON.parse(JSON.stringify(post)) 
  };
};



const Post: React.FC<PostProps> = (props) => {
  const [newCommentContent, setNewCommentContent] = useState('');


  const sendNewComment = async (e: React.SyntheticEvent,postId: string) => {
    e.preventDefault();
    try {
      const body = { content:newCommentContent };
      await fetch(`/api/post/${postId}/new-comment`, {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      setNewCommentContent('');
      await Router.push(`/p/${postId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <div>
        <div className='post-div'>
          <div className='post-author'>
            <img src={props?.author?.image || "defaultAvatarUrl"} width="50" height="50" className="post-author-avatar-image" alt={props?.author?.name + "'s avatar"}/>
            <p className='post-author-name'>{props?.author?.name || 'an unknown author'}</p>
          </div>
          <h2 className='post-title'>{title}</h2>
          <div className='post-content'>
            <ReactMarkdown children={props.content} />
          </div>
          <div className='post-actions'>
            {
              !props.published && userHasValidSession && postBelongsToUser && (
                  <button className='publish-button' onClick={() => publishPost(props.id)}>Publish</button>
              )
            }
            {
              userHasValidSession && postBelongsToUser && (
                  <button className='delete-button' onClick={() => deletePost(props.id)}>Delete</button>
              )
            }
          </div>
        </div>
        <div id="comments-div">
          {
            props.comments.map((comment,index) => {
              return(
                <div className='comment-div' key={"comment-"+index.toString()} id={"comment-"+index.toString()}>
                  <div className='comment-author'>
                    <img src={comment.author.image} width="50" height="50" className="comment-author-avatar-image" alt={comment.author.name + "'s avatar"}/>
                    <p className='comment-author-name'>{comment.author.name}</p>
                  </div>
                  <div className='comment-content'>
                    <p>{comment.content}</p>
                  </div>
                </div>
              )
            })
          }
          <div className='new-comment-div'>
            <p>Write a new comment</p>
            <textarea
              cols={50}
              onChange={(e) => setNewCommentContent(e.target.value)}
              placeholder="Content of the comment"
              rows={8}
              value={newCommentContent}
            />            
            <button onClick={(e) => sendNewComment(e,props.id)}>Confirm</button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        .publish-button {
          background: light-gray;
          color:dark-grey;
          font-weight:500;
          border: 0;
          border-radius: 0.5em;
          padding: 1rem 2rem;

          transition:all 0.2s ease-in-out;
        }
        .publish-button:hover {
          background: #00cc44;
          color:white;
          font-weight:500;
          border: 0;
          border-radius: 1.5em;
          padding: 1rem 2rem;

          transition:all 0.2s ease-in-out;
        }

        .delete-button {
          background: #1a0000;
          color:white;
          font-weight:500;
          border: 0;
          border-radius: 0.5em;
          padding: 1rem 2rem;

          transition:all 0.2s ease-in-out;
        }
        .delete-button:hover {
          background:  #b30000;
          color:white;
          font-weight:500;
          border: 0;
          border-radius: 1.5em;
          padding: 1rem 2rem;

          transition:all 0.2s ease-in-out;
        }

        button + button {
          margin-left: 1rem;
        }

        .post-div{
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

        .comment-div{
          background:light-grey;
          
          padding:1em;
          margin-bottom:1em;
        }

        .comment-author{
          display:flex;
          flex-direction:row;
          justify-content:flex-start;
          align-items:center;
        }

        .comment-author-avatar-image {
          border-radius:100%;
          margin-right:0.8em;
        }

        .comment-author-name {
          font-weight:600;
        }
        
      `}</style>
    </Layout>
  );
};



export default Post;
