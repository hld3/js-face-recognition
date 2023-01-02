import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return (
        <div className='w4 pa2'>
            <Tilt className='Tilt br2 shadow-2'>
                <div style={{ height: '100px'}}>
                    <h1 className='pa3'><img alt='logo' src={brain}/></h1>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo;