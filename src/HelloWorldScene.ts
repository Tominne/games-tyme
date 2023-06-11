import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
  private logo!: Phaser.Physics.Arcade.Image
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super('hello-world')
  }

  preload() {
    this.load.image('farm', 'images/farm.png')
    this.load.image('livingRoom', 'images/livingroom.jpg')
    this.load.image('Cafe', 'images/cafe.gif')
    this.load.image('logo', 'images/nappyman.png')
    this.load.spritesheet('mySpriteSheet', 'images/snake.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
  }

  create() {
    const x = 5
    const y = 2
    const mySprite = this.add.sprite(x, y, 'mySpriteSheet')
    this.scale.setGameSize(window.innerWidth, window.innerHeight)
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

    this.logo = this.physics.add.image(800, 900, 'logo')

    this.logo.setVelocity(50, 200)
    this.logo.setBounce(1, 1)
    this.logo.setCollideWorldBounds(true)
    this.logo.setName('Player')

    this.cursors = this.input.keyboard.createCursorKeys()
    this.input.keyboard.on('keydown-D', () => {
      if (farmBackground.visible) {
        farmBackground.setVisible(false)
        livingRoomBackground.setVisible(true)
        cafeBackground.setVisible(false)
      } else if (livingRoomBackground.visible) {
        farmBackground.setVisible(false)
        livingRoomBackground.setVisible(false)
        cafeBackground.setVisible(true)
      } else {
        farmBackground.setVisible(true)
        livingRoomBackground.setVisible(false)
        cafeBackground.setVisible(false)
      }
    })
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
