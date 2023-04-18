import React, { Component } from 'react';
import ParticlesBg from 'particles-bg'
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import SignIn from './components/signIn/SignIn';
import Register from './components/register/Register';
import './App.css';

const USER_ID = 'hld3';
// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '2e4a2196676d4e4f8e0dee0b12b14b62';
const APP_ID = 'd2c92fdc722b4142aa5509a365a10a4c';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
let IMAGE_URL = '';

///////////////////////////////////////////////////////////////////////////////////
// YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
///////////////////////////////////////////////////////////////////////////////////

const constructRaw = () => {
  return JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });
}

const requestOptions = (raw) => {
  return {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signIn',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (currUser) => {
    this.setState({
      user:
      {
        id: currUser.id,
        name: currUser.name,
        email: currUser.email,
        entries: currUser.entries,
        joined: currUser.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const imageWidth = Number(image.width);
    const imageHeight = Number(image.height);

    return {
      topRow: clarifaiFace.top_row * imageHeight,
      leftCol: clarifaiFace.left_col * imageWidth,
      bottomRow: imageHeight - (clarifaiFace.bottom_row * imageHeight),
      rightCol: imageWidth - (clarifaiFace.right_col * imageWidth)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }

  onDetectClick = () => {
    this.setState({ imageUrl: this.state.input });
    IMAGE_URL = this.state.input;
    const raw = constructRaw();

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions(raw))
      .then(response => response.json())
      .then(result => {
        if (result) {
          fetch('http://localhost:3000/image', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: this.state.user.id })
          })
            .then(res => res.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {entries: count}))
            })
            .catch(error => console.log(error))
        }
        this.displayFaceBox(this.calculateFaceLocation(result))
      })
      .catch(error => console.log('error', error));

    // this.setState({ user:  })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onRouteChange = (route) => {
    if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    if (route === 'signOut') {
      this.setState({ isSignedIn: false })
    }
    this.setState({ route: route });
  }

  render() {
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
        {
          this.state.route === 'home'
            ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm onInputUrlChange={this.onInputChange} onDetectClick={this.onDetectClick} />
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
            </div>
            : (
              this.state.route === 'signIn'
                ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
                : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            )
        }
      </div>
    );
  }
}

export default App;
