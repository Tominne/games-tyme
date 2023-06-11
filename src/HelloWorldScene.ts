import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
  private logo!: Phaser.Physics.Arcade.Image
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super('hello-world')
  }

  preload() {
    this.load.image('sky', 'images/background.png')
    this.load.image('logo', 'images/face.png')
  }

  create() {
    this.add.image(400, 300, 'sky')

    const logo = this.physics.add.image(800, 900, 'logo')

    logo.setVelocity(50, 200)
    logo.setBounce(1, 1)
    logo.setCollideWorldBounds(true)
    logo.setName('Izak')

    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update() {
    if (this.cursors.left.isDown) {
      this.logo.setVelocityX(-160)
    } else if (this.cursors.right.isDown) {
      this.logo.setVelocityX(160)
    } else {
      this.logo.setVelocityX(0)
    }

    if (this.cursors.up.isDown) {
      this.logo.setVelocityY(-160)
    } else if (this.cursors.down.isDown) {
      this.logo.setVelocityY(160)
    } else {
      this.logo.setVelocityY(0)
    }
  }
}
