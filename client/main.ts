import Phaser from 'phaser'
import cafeScene from './components/cafeScene'
import libraryScene from './components/libraryScene'
import { LoadingScene } from './components'
import express from 'express'
//scene switching

//config game
const config = {
  type: Phaser.WEBGL,
  width: 1000,
  height: 800,
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  scale: {
    mode: Phaser.Scale.ScaleModes.NONE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },

  canvasStyle: `display: block; width: 100%; height: 100%;`,
  autoFocus: true,
  audio: {
    disableWebAudio: false,
  },

  scene: [libraryScene, cafeScene],
}

export default new Phaser.Game(config)
