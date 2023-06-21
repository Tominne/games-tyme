import { GameObjects, Scene } from 'phaser'
import CopyWebpackPlugin from 'copy-webpack-plugin'
;[
  new CopyWebpackPlugin({
    patterns: [
      {
        from: 'assets',
        to: 'assets',
      },
    ],
  }),
]
export class LoadingScene extends Scene {
  private JitterBug!: GameObjects.Sprite
  constructor() {
    super('loading-scene')
  }

  async preload() {
    this.load.image('jitter1', 'images/jitter/jitter1.png')
    this.load.image('jitter2', 'images/jitter/jitter2.png')
    this.load.image('jitter3', 'images/jitter/jitter3.png')
    this.load.image('jitter4', 'images/jitter/jitter4.png')
    this.load.image('jitter5', 'images/jitter/jitter5.png')
    this.load.image('jitter6', 'images/jitter/jitter6.png')
  }

  create(): void {
    key: 'JitterBug'
    this.JitterBug = this.add.sprite(100, 100, '/images/jitter/jitter1.png')
    console.log('Loading scene was created')
  }
}

export * from './loading'
