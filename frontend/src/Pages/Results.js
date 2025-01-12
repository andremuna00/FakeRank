import React, {useEffect, useState}from 'react';
import { useParams } from 'react-router-dom';
import PieChart from "../Components/PieChart";
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import "../assets/css/sb-admin-2.min.css"
import NavigationButton from '../Components/navigation-button';

const Results=() =>{

  const {challengeId} = useParams()
  const {getAccessTokenSilently} = useAuth0()
  const [ls, setLs] = useState([])
  const [users, setUsers] = useState([])
  const [exercises, setExercises] = useState([])


  // Retrieves the necessary info about the users that took part to the challenge
  const getUsers = async()=>{

    const token = await getAccessTokenSilently()

    axios.get(`/api/submissions/challenges/${challengeId}`,
    {
        headers: {
          'Authorization': `Bearer ${token}`
        }
    }).then(res => {

      setUsers(res.data.map(x => [x.user_id, x.rating, x.user.email, x.id]))
    })
  }


  // Retrieves all the exercises related to the challenge, along with the results for each user
  const getExercises = async() => {      
    const token = await getAccessTokenSilently()
    let exerciseList = []
    
    axios.get(`/api/exercises/challenges/${challengeId}`,
    {
        headers: {
          'Authorization': `Bearer ${token}`
        }
    }).then(res => {
 
      exerciseList = res.data.map(x => [x.id, x.title])
      setExercises(exerciseList)


      for(var i=0 ; i< exerciseList.length ; i++){

        const index = i

        axios.get(`/api/testcases/exercises/${exerciseList[index][0]}`,
        {
            headers: {
              'Authorization': `Bearer ${token}`
            }
        }).then(res => {

          const number_test_cases = res.data.length

          axios.get(`/api/exercise_submissions/exercises/${exerciseList[index][0]}`,
          {
              headers: {
                'Authorization': `Bearer ${token}`
              }
          }).then(res => {

            let out = {}

            out["exerciseId"] = exerciseList[index][0]
            out["number_test_cases"] = number_test_cases
            out["submissions"] = res.data
            setLs(ls =>[...ls, out])

            
          })
          
        })
      }
    })

  };

  useEffect(() => {
    getUsers();
    getExercises();
  }, []);


  // This will display the title for each exercise
  function setColumnsExercises(){
    return exercises.map(x => <th>{x[1]}</th>)
  }


  // For each exercise, the graph will show the percentage of completion reached by the user
  // The score is calculated by n_testcases_passed_by_users / n_testcases * n_users
  function showGraphs(){
    let number_users = users.length
    let out = []

    for(let i=0 ; i<exercises.length ; i++){
      let o = {}
      let ex_id = exercises[i][0]
      o["title"] = exercises[i][1]

      console.log(ex_id)
      let exercise_data = ls.filter(x=>x.exerciseId ==ex_id)[0]
      if(exercise_data != undefined){
        console.log(exercise_data)
        o["total"]  = exercise_data.number_test_cases*number_users
        let points = exercise_data.submissions.map(x => x.rating).reduce((a,b)=>a+b, 0)
        o["passed"] = points
      }

      out.push(o)

      
    }

    return out.map(ex =>
    
    (ex.total>0 && <div className='' style={{ width: 700 }}>
      <PieChart title={ex.title} quantities={
        [
          ex.passed,
          ex.total-ex.passed
        ]
      } labels={['Passed', 'Not passed']}/>
    </div>)

    )

  }


  // For each user that took part to the challenge, it creates a row containing the number of passed testcases and a link to a page where the owner can see
  // the code submitted by others.
  function showRows(){

    let rows = []

    for(let i=0 ; i<users.length ; i++){

      let row = {}
      let user_id = users[i][0]
      let user = users[i][2]

      let points = 0
      let total_points = 0

      row["user_id"] = user_id
      row["user"] = user
      row["submission_id"] = users[i][3]
      for(let j=0; j<exercises.length; j++){

        let ex_id = exercises[j][0]
        let exercise_data = ls.filter(x=>x.exerciseId ==ex_id)[0]

        if(exercise_data != undefined){

          let exercise_submission = exercise_data.submissions.filter(x=>x.user_id==user_id)[0]

          console.log(exercise_submission)

          if(exercise_submission != undefined){
            row[ex_id] = exercise_submission.rating+"/"+exercise_data.number_test_cases
            points += exercise_submission.rating
            
          } else {
            row[ex_id] = "-/"+exercise_data.number_test_cases

          }
          total_points += exercise_data.number_test_cases

        }
      }
      console.log(row)
      row["total"] = points+"/"+total_points
      rows.push(row)
    }

    return rows.map((x, index) =>
      <tr key={index}>
      <td>{x.user}</td>
      {exercises.map(y=> y[0]).map(
        ex => <td>{x[ex]}</td>
      )}
      <td>{x.total}</td>
      <td>
      <NavigationButton dir={`/Challenge/Results/Submissions/${x.submission_id}/Challenges/${challengeId}`} text="Code"/>
      </td>
    </tr>)
  }
  
  return (
    <div className="Result">
      <div className="card shadow mb-4">
          <div className="card-header py-3">
              <small className="d-block text-end mt-3 "> 
                <NavigationButton dir={`/profile`} text="X"></NavigationButton>  
              </small> 
              <h6 className="m-0 font-weight-bold text-primary">Results Challenge</h6>
          </div>
          <div className="card-body">
              <div className="table-responsive">
                  <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                      <thead>
                          <tr>
                            <th>User</th>
                            {setColumnsExercises()}
                            <th>Total Rating</th>
                            <th>View Code</th>
                          </tr>
                      </thead>
                      <tbody>

                      {showRows()}
                      </tbody>
                  </table>
              </div>
              <div className='d-flex flex-wrap flex-row' style={{"justifyContent": "center"}}>
                {showGraphs()}
                </div>
          </div>
      </div>

      


    </div>
  );
}

export default Results;