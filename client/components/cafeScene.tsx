import Phaser, { Cameras, DOWN, LEFT, RIGHT } from 'phaser'
import { useQuery } from 'react-query'

import jitter from './jitter'
import { config } from 'dotenv'
import main from '../main'

export default class cafeScene extends jitter {
  //switching scenes

  constructor() {
    super({ key: 'cafeScene' })
  }
  switchToLibraryScene() {
    this.scene.start('libraryScene')
  }
  preload() {
    this.load.image('farm', 'images/farm.png')
    this.load.image('cafeGif', 'images/cafe.gif')
    this.load.image('cafe1', 'images/devcafe/cafe1.png')
    this.load.image('cafe2', 'images/devcafe/cafe2.png')
    this.load.image('cafe3', 'images/devcafe/cafe3.png')
    this.load.image('frame1', 'images/dog/run1.png')
    this.load.image('frame2', 'images/dog/run1-5.png')
    this.load.image('frame3', 'images/dog/run2.png')
    this.load.image('jitter1', 'images/jitter/jitter1.png')
    this.load.image('jitter2', 'images/jitter/jitter2.png')
    this.load.image('jitter3', 'images/jitter/jitter3.png')
    this.load.image('jitter4', 'images/jitter/jitter4.png')
    this.load.image('jitter5', 'images/jitter/jitter5.png')
    this.load.image('jitter6', 'images/jitter/jitter6.png')
  }

  create() {
    const targetAspectRatio = 30 / 16
    const windowAspectRatio = window.innerWidth / window.innerHeight
    //add video to canvas
    const canvas = this.sys.game.canvas
    canvas.style.position = 'absolute'
    canvas.style.left = '50%'
    canvas.style.top = '50%'
    canvas.style.transform = 'translate(-50%, -50%)'

    let gameWidth = window.innerWidth
    let gameHeight = window.innerHeight

    if (windowAspectRatio > targetAspectRatio) {
      gameWidth = gameHeight * targetAspectRatio
    } else {
      gameHeight = gameWidth / targetAspectRatio
    }
    const maxWidth = 1000
    if (gameWidth > maxWidth) {
      gameWidth = maxWidth
      gameHeight = gameWidth / targetAspectRatio
    }
    this.scale.setGameSize(gameWidth, gameHeight)
    this.physics.world.setBounds(0, 0, gameWidth, gameHeight)

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
    this.jitterSprite.setName('jitterSprite')
    this.jitterSprite.setInteractive()
    const initialScale = 2 / 8
    this.jitterSprite.setScale(initialScale, initialScale)

    // Set the position of the jitter sprite
    const x = this.scale.width / 2
    const y = this.scale.height - this.jitterSprite.displayHeight / 2
    this.jitterSprite.setPosition(x, y)

    //other backgrounds
    const farmBackground = this.add.image(0, 0, 'farm')
    farmBackground.setOrigin(0, 0)

    const cafeBackground = this.add.image(0, 0, 'cafeGif')
    cafeBackground.setOrigin(0, 0)
    cafeBackground.setVisible(false)
    //cafeGIF
    this.anims.create({
      key: 'cafeAnimation',
      frames: [{ key: 'cafe1' }, { key: 'cafe2' }, { key: 'cafe3' }],
      frameRate: 0.2,
      repeat: -1,
    })

    //cafe sprite
    const cafe = this.add.sprite(0, 0, 'cafe1')
    cafe.play('cafeAnimation')
    cafe.setPosition(this.scale.width / 2, cafe.width / 2)
    const [cafeScaleX, cafeScaleY] = getScaleValues(cafe, this.cameras.main)
    cafe.setDepth(0)
    cafe.setVisible(false)
    cafe.setScale(cafeScaleX, cafeScaleY + 0.2)

    function getScaleValues(
      backgroundImage: Phaser.GameObjects.Image,
      camera: Phaser.Cameras.Scene2D.Camera
    ) {
      const scaleX = camera.width / backgroundImage.width
      const scaleY = camera.height / backgroundImage.height
      return [scaleX, scaleY]
    }

    const [farmScaleX, farmScaleY] = getScaleValues(
      farmBackground,
      this.cameras.main
    )

    const [CafeScaleX, CafeScaleY] = getScaleValues(
      cafeBackground,
      this.cameras.main
    )
    farmBackground.setScale(farmScaleX, farmScaleY)
    cafeBackground.setScale(CafeScaleX, CafeScaleY)

    //player
    const dialogues = [
      'Hello there fine sir!',
      'How are you today????',
      'Nice to see you I guess...',
    ]

    this.anims.create({
      key: 'myAnimation',
      frames: [{ key: 'frame1' }, { key: 'frame2' }, { key: 'frame3' }],
      frameRate: 10,
      repeat: -1,
    })
    // Play animation on a sprite
    const mySprite = this.add.sprite(0, 0, 'frame1')
    mySprite.setPosition(gameWidth / 2, gameHeight / 2)
    mySprite.setScale(0.1, 0.1)
    mySprite.play('myAnimation')
    //make it move
    this.tweens.add({
      targets: mySprite,
      x: gameWidth,
      duration: 9000,
      ease: 'linear',
      repeat: -1,
      yoyo: true,
    })
    //down
    mySprite.y += 20
    //left
    mySprite.x -= 50
    mySprite.setVisible(true)
    const dialogueText = this.add.text(0, 0, '')
    //activating talk
    this.input.keyboard.on('keydown-C', () => {
      const distance = Phaser.Math.Distance.Between(
        mySprite.x,
        mySprite.y,
        this.jitterSprite.x,
        this.jitterSprite.y
      )
      if (distance < 100) {
        const randomIndex = Math.floor(Math.random() * dialogues.length)
        const randomDialogue = dialogues[randomIndex]
        dialogueText.setText(randomDialogue)
        dialogueText.setPosition(mySprite.x, mySprite.y - 20)
      }
    })

    this.cursors = this.input.keyboard.createCursorKeys()

    this.input.keyboard.on('keydown-D', () => {
      if (farmBackground.visible) {
        farmBackground.setVisible(false)
        cafeBackground.setVisible(false)
        mySprite.setVisible(false)
        cafe.setVisible(true)
      } else if (cafeBackground.visible) {
        farmBackground.setVisible(true)
        cafeBackground.setVisible(false)
        mySprite.setVisible(false)
        cafe.setVisible(false)
      } else {
        farmBackground.setVisible(false)
        cafeBackground.setVisible(true)
        mySprite.setVisible(true)
        cafe.setVisible(false)
      }
    })

    this.cursors = this.input.keyboard.createCursorKeys()

    this.keys = this.input.keyboard.addKeys({
      A: Phaser.Input.Keyboard.KeyCodes.A,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      W: Phaser.Input.Keyboard.KeyCodes.W,
      S: Phaser.Input.Keyboard.KeyCodes.S,
    })
    //ground
    const ground = this.physics.add.staticGroup()
    ground.create(400, 568, 'ground').setScale(2).refreshBody()

    const door = this.add.sprite(0, 0, 'wonderlandDoor')
    door.setOrigin(0, 1)
    door.setScale(0.2)
    door.setPosition(0, this.scale.height)
    door.setInteractive()

    door.on('pointerdown', () => {
      // Check the distance between the jitterSprite and the door
      const distance = Phaser.Math.Distance.Between(
        this.jitterSprite.x,
        this.jitterSprite.y,
        door.x,
        door.y
      )
      if (distance < 300) {
        this.switchToLibraryScene()
      }
    })
  }

  update() {
    this.jitterSprite.setVelocity(0)
    if (this.cursors.left.isDown) {
      this.jitterSprite.setVelocityX(-300)
    } else if (this.cursors.right.isDown) {
      this.jitterSprite.setVelocityX(300)
    } else if (this.cursors.up.isDown) {
      this.jitterSprite.setVelocityY(-300)
    } else if (this.cursors.down.isDown) {
      this.jitterSprite.setVelocityY(300)
    } else {
      this.jitterSprite.setVelocityY(0)
    }
  }
}
