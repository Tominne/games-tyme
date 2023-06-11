import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super('hello-world')
  }

  preload() {
    this.load.image('sky', 'images/background.png')
    this.load.image('logo', 'images/bee.png')
    this.load.image('octo', 'images/octo.png')
  }

  create() {
    this.add.image(400, 300, 'sky')

    const logo = this.physics.add.image(400, 100, 'logo')

    logo.setVelocity(100, 200)
    logo.setBounce(1, 1)
    logo.setCollideWorldBounds(true)

    emitter.startFollow(logo)
  }
}
