import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
  private platforms?: Phaser.Physics.Arcade.StaticGroup
  private logo!: Phaser.Physics.Arcade.Image
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private cat?: Phaser.Physics.Arcade.Sprite
  constructor() {
    super('hello-world')
  }

  preload() {
    this.load.image('farm', 'images/farm.png')
    this.load.image('livingRoom', 'images/livingroom.jpg')
    this.load.image('Cafe', 'images/cafe.gif')
    this.load.image('logo', 'images/nappyman.png')
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

    const livingRoomBackground = this.add.image(0, 0, 'livingRoom')
    livingRoomBackground.setOrigin(0, 0)

    const cafeBackground = this.add.image(0, 0, 'Cafe')
    cafeBackground.setOrigin(0, 0)

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
    this.logo = this.physics.add.image(800, 900, 'logo')
    const logoScaleX = (gameWidth / this.logo.width) * 0.2
    const logoScaleY = (gameHeight / this.logo.height) * 0.4
    this.logo.setScale(logoScaleX, logoScaleY)
    this.logo.setVelocity(50, 200)
    this.logo.setBounce(1, 1)
    this.logo.setCollideWorldBounds(true)
    this.logo.setName('Player')

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
    mySprite.setVisible(false)
    const dialogueText = this.add.text(0, 0, '')
    //activating talk
    this.input.keyboard.on('keydown-C', () => {
      const distance = Phaser.Math.Distance.Between(
        mySprite.x,
        mySprite.y,
        this.logo.x,
        this.logo.y
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
      } else if (livingRoomBackground.visible) {
        farmBackground.setVisible(false)
        livingRoomBackground.setVisible(false)
        cafeBackground.setVisible(true)
        mySprite.setVisible(true)
      } else {
        farmBackground.setVisible(true)
        livingRoomBackground.setVisible(false)
        cafeBackground.setVisible(false)
        mySprite.setVisible(false)
      }
    })
  }
  update() {
    if (this.cursors.left.isDown) {
      this.logo.setVelocityX(-300)
    } else if (this.cursors.right.isDown) {
      this.logo.setVelocityX(300)
    } else {
      this.logo.setVelocityX(0)
    }

    if (this.cursors.up.isDown) {
      this.logo.setVelocityY(-300)
    } else if (this.cursors.down.isDown) {
      this.logo.setVelocityY(300)
    } else {
      this.logo.setVelocityY(0)
    }
  }
}
