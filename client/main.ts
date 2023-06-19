import Phaser from 'phaser'
import cafeScene from './components/cafeScene'
import libraryScene from './components/libraryScene'
//scene switching

//config game
const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 800,
  zoom: 2,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 200, y: 200 },
    },
  },
  scene: [libraryScene, cafeScene],
}

export default new Phaser.Game(config)
