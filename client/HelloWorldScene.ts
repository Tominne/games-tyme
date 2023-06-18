import Phaser, { Cameras, DOWN, LEFT, RIGHT } from 'phaser'
import { useQuery } from 'react-query'
import { getWeather } from './api'

export default class HelloWorldScene extends Phaser.Scene {
  private platforms?: Phaser.Physics.Arcade.StaticGroup
  private logo!: Phaser.Physics.Arcade.Image
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private cat?: Phaser.Physics.Arcade.Sprite
  keys!: any

  constructor() {
    super({ key: 'helloWoldScene' })
  }

  preload() {
    getWeather()
    this.load.image('farm', 'images/farm.png')
    this.load.image('cafeGif', 'images/cafe.gif')
    this.load.image('living room', 'images/livingroom.jpg')
    this.load.image('cafe1', 'images/devcafe/cafe1.png')
    this.load.image('cafe2', 'images/devcafe/cafe2.png')
    this.load.image('cafe3', 'images/devcafe/cafe3.png')
    this.load.image('jim1', 'images/jitter/jim1.png')
    this.load.image('jitter2', 'images/jitter/jitter2.png')
    this.load.image('jitter3', 'images/jitter/jitter3.png')
    this.load.image('jitter4', 'images/jitter/jitter4.png')
    this.load.image('jitter5', 'images/jitter/jitter5.png')
    this.load.image('jitter6', 'images/jitter/jitter6.png')
    this.load.image('frame1', 'images/dog/run1.png')
    this.load.image('frame2', 'images/dog/run1-5.png')
    this.load.image('frame3', 'images/dog/run2.png')
  }

  create() {
    //sizing
    const targetAspectRatio = 30 / 16
    const windowAspectRatio = window.innerWidth / window.innerHeight

    let gameWidth = window.innerWidth
    let gameHeight = window.innerHeight

    if (windowAspectRatio > targetAspectRatio) {
      gameWidth = gameHeight * targetAspectRatio
    } else {
      gameHeight = gameWidth / targetAspectRatio
    }

    this.scale.setGameSize(gameWidth, gameHeight)

    const canvas = this.sys.game.canvas
    canvas.style.position = 'absolute'
    canvas.style.left = '50%'
    canvas.style.top = '50%'
    canvas.style.transform = 'translate(-50%, -50%)'

    const farmBackground = this.add.image(0, 0, 'farm')
    farmBackground.setOrigin(0, 0)

    const livingRoomBackground = this.add.image(0, 0, 'living room')
    livingRoomBackground.setOrigin(0, 0)

    const cafeBackground = this.add.image(0, 0, 'cafeGif')
    cafeBackground.setOrigin(0, 0)
    cafeBackground.setVisible(true)

    this.anims.create({
      key: 'cafeAnimation',
      frames: [{ key: 'cafe1' }, { key: 'cafe2' }, { key: 'cafe3' }],
      frameRate: 0.2,
      repeat: -1,
    })

    this.anims.create({
      key: 'jitterAnimation',
      frames: [
        { key: 'jim1' },
        { key: 'jitter2' },
        { key: 'jitter3' },
        { key: 'jitter4' },
        { key: 'jitter5' },
        { key: 'jitter6' },
      ],
      frameRate: 2,
      repeat: -1,
    })

    const cafe = this.add.sprite(0, 0, 'cafe1')
    cafe.play('cafeAnimation')
    cafe.setPosition(this.scale.width / 2, cafe.width / 2)
    const [cafeScaleX, cafeScaleY] = getScaleValues(cafe, this.cameras.main)
    cafe.setDepth(0)
    cafe.setVisible(false)
    cafe.setScale(cafeScaleX, cafeScaleY + 0.2)

    const logo = this.add.sprite(0, 0, 'jim1')
    logo.play('jitterAnimation')
    logo.setPosition(this.scale.width / 2, logo.width / 2)
    logo.setDepth(1)
    logo.setVisible(true)
    logo.setName('Player')

    function getScaleValues(
      backgroundImage: Phaser.GameObjects.Image,
      camera: Phaser.Cameras.Scene2D.Camera
    ) {
      const scaleX = camera.width / backgroundImage.width
      const scaleY = camera.height / backgroundImage.height
      return [scaleX, scaleY]
    }
    livingRoomBackground.setVisible(false)

    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height)
    const [farmScaleX, farmScaleY] = getScaleValues(
      farmBackground,
      this.cameras.main
    )
    const [livingRoomScaleX, livingRoomScaleY] = getScaleValues(
      livingRoomBackground,
      this.cameras.main
    )
    const [CafeScaleX, CafeScaleY] = getScaleValues(
      livingRoomBackground,
      this.cameras.main
    )
    farmBackground.setScale(farmScaleX, farmScaleY)
    livingRoomBackground.setScale(livingRoomScaleX, livingRoomScaleY)
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
        logo.x,
        logo.y
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
        livingRoomBackground.setVisible(true)
        cafeBackground.setVisible(false)
        mySprite.setVisible(false)
        cafe.setVisible(false)
      } else if (livingRoomBackground.visible) {
        farmBackground.setVisible(false)
        livingRoomBackground.setVisible(false)
        cafeBackground.setVisible(true)
        mySprite.setVisible(true)
        cafe.setVisible(false)
      } else if (cafeBackground.visible) {
        farmBackground.setVisible(false)
        livingRoomBackground.setVisible(false)
        cafeBackground.setVisible(false)
        mySprite.setVisible(false)
        cafe.setVisible(true)
      } else {
        farmBackground.setVisible(true)
        livingRoomBackground.setVisible(false)
        cafeBackground.setVisible(false)
        mySprite.setVisible(false)
        cafe.setVisible(false)
      }
    })

    this.keys = this.input.keyboard.addKeys({
      A: Phaser.Input.Keyboard.KeyCodes.A,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      W: Phaser.Input.Keyboard.KeyCodes.W,
      S: Phaser.Input.Keyboard.KeyCodes.S,
    })
  }

  update() {
    if (this.keys.A.isDown) {
      this.logo.setVelocityX(-300)
    } else if (this.keys.D.isDown) {
      this.logo.setVelocityX(300)
    } else {
      this.logo.setVelocityX(0)
    }

    if (this.keys.W.isDown) {
      this.logo.setVelocityY(-300)
    } else if (this.keys.S.isDown) {
      this.logo.setVelocityY(300)
    } else {
      this.logo.setVelocityY(0)
    }
  }
}
