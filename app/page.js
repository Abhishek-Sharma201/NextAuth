"use client";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import React from "react";

const Page = () => {
  const { data: session } = useSession();

  console.log(`Session: ${JSON.stringify(session)}`);

  return (
    <div>
      {session ? (
        <>
          <p>Logged in as {session.user.name}</p>
          <button onClick={signOut}>SignOut</button>
        </>
      ) : (
        <>
          <p>You are not logged in</p>
          <button onClick={signIn}>SignIn</button>
        </>
      )}
    </div>
  );
};

export default Page;
