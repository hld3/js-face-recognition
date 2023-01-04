import React, { Component } from 'react';
import ParticlesBg from 'particles-bg'
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import './App.css';

const USER_ID = 'hld3';
// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '2e4a2196676d4e4f8e0dee0b12b14b62';
const APP_ID = 'd2c92fdc722b4142aa5509a365a10a4c';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'general-image-recognition';
const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';
const IMAGE_URL = 'https://i2-prod.mirror.co.uk/incoming/article14334083.ece/ALTERNATES/s1200d/3_Beautiful-girl-with-a-gentle-smile.jpg';

///////////////////////////////////////////////////////////////////////////////////
// YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
///////////////////////////////////////////////////////////////////////////////////

const raw = JSON.stringify({
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

const requestOptions = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Key ' + PAT
  },
  body: raw
};

// NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
// this will default to the latest version_id

class App extends Component {
  constructor() {
    super();
    this.state = {
      inputUrl: ''
    }
  }

  onDetectClick(event) {
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  onInputUrlChange(event) {
    // this.setState({inputUrl: event.target.value});
    console.log(event.target.value);
  }

  render() {
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputUrlChange={this.onInputUrlChange} onDetectClick={this.onDetectClick} />
        <FaceRecognition />
      </div>
    );
  }
}

export default App;
