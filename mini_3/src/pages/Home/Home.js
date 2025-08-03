import React from "react";
import Navbar from '../../components/navBar/Navbar'
import PostList from "../../components/PostList";
import './Home.css';
import NewNavBar from "../../components/newNavBar/newNavBar";
import ShareKnowledge from "../shareKnowledge/ShareKnowledge";
function Home() {
  const token = localStorage.getItem('token');
  console.log(token)
  return (

    <div>
      <h1>Items posted by your peers</h1>
      {token ? <NewNavBar/> : <Navbar/>}
      <ShareKnowledge/>
    </div>
  );
}

export default Home;
