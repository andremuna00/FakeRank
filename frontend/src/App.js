import React from 'react';
import './App.css';
import {Route, Routes} from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react';
import Home from './Pages/Home'
import LogoutButton from './Components/Authentication/logout-button';
import Profile from './Pages/Profile';

import NavBar from './Components/Navbar/nav-bar';

import Challenge from './Pages/Challenge'
import Exercise from './Pages/Exercise';
import ChallengePartecipate from './Pages/ChallengePartecipate';
import ChallengeWaiting from './Pages/ChallengeWaiting';

import ChallengeCreation from './Pages/ChallengeCreation';
import ExerciseCreation from './Pages/ExerciseCreation';

import ChallengeModify from './Pages/ChallengeModify';
import ExerciseModify from './Pages/ExerciseModify';

import Results from './Pages/Results';
import ResultsUser from './Pages/ResultsUser';

const App = () => {
  const {isLoading} = useAuth0

  if(isLoading){
    return <div>Loading...</div>
  }

  return (
    
    <div>
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
        <NavBar/>
        <Routes>

          {/** Home page of the application */}
          <Route path="/" element={<Home/>}/>

          {/** Main page of a challenge */}
          <Route path="/profile/Challenge/:challengeId" element={<Challenge/>}/>

          {/** Page where a user solves an exercise */}
          <Route path="/profile/Exercise/:challengeId/:exerciseId" element={<Exercise/>}/>

          {/** Page where a user has to give the keey access to a challenge */}
          <Route path="/profile/ChallengePartecipate/:challengeId" element={<ChallengePartecipate/>}/>

          {/** Initial page of a challenge */}
          <Route path="/profile/ChallengeWaiting/:challengeId" element={<ChallengeWaiting/>}/>

          {/** Profile page of a user */}
          <Route path="/profile" element={<Profile/>}/>

          {/** Page where a user can create a challenge */}
          <Route path="/profile/ChallengeCreation" element={<ChallengeCreation/>}/>

          {/** Page where a user can create an exercise */}
          <Route path="/profile/ExerciseCreation/:challengeId" element={<ExerciseCreation/>}/>

          {/** Page to modify a challenge after initial creation */}
          <Route path="/profile/ChallengeModify/:challengeId" element={<ChallengeModify/>}/>

          {/** Page to modify an exercise after initial creation */}
          <Route path="/profile/ExerciseModify/:challengeId/:exerciseId" element={<ExerciseModify/>}/>
          
          {/** Page where a user can see who is taking part to his own challenge with many info about the submissions */}
          <Route path="/Challenge/Results/:challengeId" element={<Results/>}/>

          {/** Page where a user can review his past submitted challenges */}
          <Route path="/Challenge/Results/Submissions/:submissionId/Challenges/:challengeId" element={<ResultsUser/>}/>

        </Routes>
        </div>
      </div>
    </div>
    
  );
}

export default App;
