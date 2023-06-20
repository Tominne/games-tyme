import Phaser, { Cameras, DOWN, LEFT, RIGHT } from 'phaser'
import { useQuery } from 'react-query'
import { getWeather } from '../api'
import jitter from './jitter'

export default class libraryScene extends Phaser.Scene {
  private platforms?: Phaser.Physics.Arcade.StaticBody
  private logo!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private cat?: Phaser.Physics.Arcade.Sprite
  jitterSprite
  Cat

  keys!: any
  video!: any

  //switching scenes
  switchToCafeScene() {
    this.scene.start('cafeScene')
  }

  constructor() {
    super({ key: 'libraryScene' })
  }

  preload() {
    this.load.video('library', 'images/library.mp4')
    this.load.image('frame1', 'images/dog/run1.png')
    this.load.image('frame2', 'images/dog/run1-5.png')
    this.load.image('frame3', 'images/dog/run2.png')
    this.load.image('jitter1', 'images/jitter/jitter1.png')
    this.load.image('jitter2', 'images/jitter/jitter2.png')
    this.load.image('jitter3', 'images/jitter/jitter3.png')
    this.load.image('jitter4', 'images/jitter/jitter4.png')
    this.load.image('jitter5', 'images/jitter/jitter5.png')
    this.load.image('jitter6', 'images/jitter/jitter6.png')
    this.load.image('cat', 'images/cat.png')
  }

  create() {
    //sizing
    const targetAspectRatio = 30 / 16
    const windowAspectRatio = window.innerWidth / window.innerHeight
    //canvas size
    const canvas = this.sys.game.canvas
    canvas.style.position = 'absolute'
    canvas.style.left = '50%'
    canvas.style.top = '50%'
    canvas.style.transform = 'translate(-50%, -50%)'

    canvas.style.zIndex = '2'

    let gameWidth = window.innerWidth
    let gameHeight = window.innerHeight

    if (windowAspectRatio > targetAspectRatio) {
      gameWidth = gameHeight * targetAspectRatio
    } else {
      gameHeight = gameWidth / targetAspectRatio
    }
    const maxWidth = 1600
    if (gameWidth > maxWidth) {
      gameWidth = maxWidth
      gameHeight = gameWidth / targetAspectRatio
    }
    this.scale.setGameSize(gameWidth, gameHeight)

    //jitter sprite
    this.jitterSprite = this.physics.add.sprite(0, 0, 'jitter1')
    this.jitterSprite.setVelocity(0)
    this.jitterSprite.setBounce(0, 0)
    this.jitterSprite.setCollideWorldBounds(true)
    this.anims.create({
      key: 'jitterAnimation',
      frames: [
        { key: 'jitter1' },
        { key: 'jitter2' },
        { key: 'jitter3' },
        { key: 'jitter4' },
        { key: 'jitter5' },
        { key: 'jitter6' },
      ],
      frameRate: 2,
      repeat: -1,
    })
    this.jitterSprite.play('jitterAnimation')
    this.jitterSprite.setPosition(gameWidth / 2, gameHeight / 2)
    this.jitterSprite.setDepth(5)
    this.jitterSprite.setVisible(true)
    this.jitterSprite.setName('Player')
    this.jitterSprite.setInteractive()
    const initialScale = 2 / 8
    this.jitterSprite.setScale(initialScale, initialScale)

    // Set the position of the jitter sprite
    const x = this.scale.width / 2
    const y = this.scale.height - this.jitterSprite.displayHeight / 2
    this.jitterSprite.setPosition(x, y)

    this.cursors = this.input.keyboard.createCursorKeys()

    //video background library

    this.video = this.add.video(gameWidth / 2, gameHeight / 2, 'library')
    this.video.displayHeight = gameHeight
    this.video.displayWidth = gameWidth
    this.video.play()

    //cat
    this.Cat = this.physics.add.image(0, 0, 'cat')
    this.Cat.setOrigin(0, 1)
    this.Cat.setCollideWorldBounds(true)
    this.Cat.setScale(initialScale, initialScale)

    const door = this.add.sprite(0, 0, 'door')
    door.setOrigin(0, 1)
    door.setPosition(0, this.scale.height)
    door.setInteractive()
    door.on('pointerdown', () => {
      // Check the distance between the player and the door
      const distance = Phaser.Math.Distance.Between(
        this.jitterSprite.x,
        this.jitterSprite.y,
        door.x,
        door.y
      )
      if (distance < 100) {
        this.switchToCafeScene()
      }
    })
  }

  update() {
    if (this.cursors.left.isDown) {
      this.jitterSprite.setVelocityX(-300)
    } else if (this.cursors.right.isDown) {
      this.jitterSprite.setVelocityX(300)
    } else {
      this.jitterSprite.setVelocityX(0)
    }
    if (this.cursors.up.isDown) {
      this.jitterSprite.setVelocityY(-300)
    } else if (this.cursors.down.isDown) {
      this.jitterSprite.setVelocityY(300)
    } else {
      this.jitterSprite.setVelocityY(0)
    }
  }
}
