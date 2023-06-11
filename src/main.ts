import Phaser from 'phaser'

import HelloWorldScene from './HelloWorldScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
    },
  },
  scene: [HelloWorldScene],
}

export default new Phaser.Game(config)
