import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import logo from '../assets/img/logo.png';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const Home = () => {
    const {user} = useAuth0();

    return (
        <div>
        {/*put image to center of page*/}
        <Card className="text-center">
            <Card.Header>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <img src={logo} alt
                            ="logo" className="img-fluid mx-auto d-block" style={{width: "50%"}}/>
                        </div>
                    </div>
                </div>
            </Card.Header>
            <Card.Body>
                <Card.Title>Start coding & testing</Card.Title>
                <Card.Text>
                    {user!==undefined && 
                        <>
                            <h1>Welcome {user.name} !</h1>
                            <Button variant="primary" href="/profile">Profile</Button>
                        </>             
                        }
                    {user===undefined && <h1>Welcome! Please Log-In</h1>}
                    
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">Andrea Munarin - Francesco Perencin - Simone Jovon - Laura Martignon - Victoria Grosu</Card.Footer>
        </Card>

            

            
        </div>
    );
}

export default Home;