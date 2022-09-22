// pages/drafts.tsx

import React from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import Layout from '../../components/Layout';

const Error: React.FC = (params) => {


  return (
    <Layout>
      <div className="page">
        <h1>Error unable to view ressource</h1>
      </div>
      <style jsx>{`
        
      `}</style>
    </Layout>
  );
};

export default Error;
