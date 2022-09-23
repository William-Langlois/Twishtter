import React, {useState} from "react"
import { GetStaticProps } from "next"
import Layout from "../../components/Layout"
import Post, { UserProps } from "../../components/User"
import Router from 'next/router';
import { getSession, useSession } from 'next-auth/react';

import prisma from '../../lib/prisma';

export async function getStaticPaths() {
  /*
    Fetch all published pages for the current model.
    Using the `fields` option will limit the size of the response
    and only return the `data.url` field from the matching pages.
  */

    const users = await prisma.user.findMany({});
    console.log(users)
    const profilePaths = users.map((user) => ({
      params: { id:user.id.toString() },
      url:"/profile/"+user.id.toString()
    }))
    

  return {
    paths: [
      ...profilePaths.map(profilePage => `${profilePage.url}`)
    ],
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({params}) => {

  const user = await prisma.user.findUnique({
      where: { id: String(params.id) },
      select:{
        id:true,
        name:true,
        email:true,
        image:true,
        posts:true,
        info:true
      }
  });

  var infoExist = (user.info != null && user.info != undefined);

  var infoWasCreated= (false);

  const createInfos = async (userId) => {

    var res = await fetch(`${process.env.BASE_URL}/api/user/${userId}/createInfos`, {
      method:'POST'
    });
    var response = await res.json();

    infoWasCreated = (true);
  }

  if(!infoExist){
    await createInfos(user.id);
  }
  
  return {
      props:{user:JSON.parse(JSON.stringify(user))}
  };
};

type Props = {
  user: UserProps
}


const Blog: React.FC<Props> = (props) => { 
  if(props.user?.info != null && props.user?.info != undefined)
  {
    //user
    const [usernameState, setUsernameState] = useState(props.user?.name);
    const [emailState, setEmailState] = useState(props.user?.email);
    const [imageState, setImageState] = useState(props.user?.image);
  
    //userInfo
    const [phoneState, setPhoneState] = useState(props.user?.info?.phone);
    const { data: session } = useSession();
  
    const saveChange = async (e: React.SyntheticEvent,userId: string) => {
      e.preventDefault();
      var userObjHasChange = (
        usernameState != props.user.name ? true :
        emailState != props.user.email ? true :
        imageState != props.user.image ? true :
        false
      );
  
      var userInfoObjHasChange = (
        phoneState != props.user.info?.phone ? true : 
        false
      );
  
      if(userInfoObjHasChange){
        try{
          const userInfoBody = {
            phone:phoneState
          }
  
          var res = await fetch(`/api/user/${userId}/updateInfos/${props.user?.info?.id}`, {
            method:'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userInfoBody),
          });
          var response = await res.json();
          if(response["error"]){
            Router.push(`/error`);
            return;
          }
  
        }
        catch(exception)
        {
          console.error(exception);
        }
      }
      
      if(userObjHasChange){
        try {
        
          const userBody = { 
            name:usernameState,
            email:emailState,
            image:imageState
          };
  
    
          var res = await fetch(`/api/user/${userId}`, {
            method:'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userBody),
          });
          var response = await res.json();
          if(response["error"]){
            Router.push(`/error`);
            return;
          }
    
        } 
        catch(exception){
          console.error(exception);
        }
      }
  
      return Router.push(`/profile/${userId}`);  
      
    };
    
    if(session?.user?.id == props.user?.id)
    {
      return (
        <Layout>
          <div className="profile-page">
            <h1>Profile</h1>
    
            <div className="avatar-div">
              <img src={imageState} width="150" height="150" className="avatar-image" alt={props?.user?.name + "'s avatar"}/>
                <input
                  type="text"
                  size={250}
                  value={imageState}
                  onChange={(e) => setImageState(e.target.value)}
                />
              </div>
    
            <div className="input-row">
              <span className="input-label">Username</span>
              <input className="input-input"
              value={usernameState}
              onChange={(e) => setUsernameState(e.target.value)}
              />
            </div>
    
            <div className="input-row">
              <span className="input-label">Email</span>
              <input className="input-input"
              value={emailState}
              onChange={(e) => setEmailState(e.target.value)}
              />
            </div>
  
            <div className="actions-div">
              <div className="action-save-div">
                <button onClick={(e) => saveChange(e,props.user.id)} className="save-button">Sauvegarder</button>
              </div>
            </div>
          </div>
          <style jsx>{`
            .profile-page{
    
            }
          `}</style>
        </Layout>
      )
    }
    else{
      return(
      <Layout>
          <div className="profile-page">
            <h1>Profile</h1>
    
            <div className="avatar-div">
              <img src={imageState} width="150" height="150" className="avatar-image" alt={props?.user?.name + "'s avatar"}/>
            </div>
    
            <div className="input-row">
              <span className="input-label">Username</span>
              <input className="input-input"
              value={usernameState}
              readOnly={true}
              />
            </div>
    
            <div className="input-row">
              <span className="input-label">Email</span>
              <input className="input-input"
              value={emailState}
              readOnly={true}
  
              />
            </div>
    
          </div>
          <style jsx>{`
            .profile-page{
    
            }
          `}</style>
        </Layout>
      )
    }
  }
  else
  {

    return(
      <Layout>
        <div className="profile-page">
          <p>Loading user's informations</p>
          <button onClick={(e) => Router.reload()}>Reload this page if your not redirected automaticaly</button>
        </div>
        <style jsx>{`
        
        `}</style>
      </Layout>
    )
    
  }
}
  

export default Blog
