import Phaser, { Cameras, DOWN, LEFT, RIGHT } from 'phaser'

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

  async preload() {
    function jsonp(url, callback) {
      const script = document.createElement('script')
      script.src = url + '?callback=' + callback.name
      document.body.appendChild(script)
    }

    function handleData(data) {
      // handle data here
      console.log(data)
    }

    const locationInput = document.createElement('input')
    document.body.appendChild(locationInput)

    const submitButton = document.createElement('button')
    submitButton.textContent = 'Get Location Weather'
    document.body.appendChild(submitButton)

    submitButton.addEventListener('click', () => {
      const location = locationInput.value
      const url = `http://localhost:3002/api/weather/${location}`
      jsonp(url, handleData)
    })

    this.load.image('wonderlandDoor', 'images/wonderlandDoor.png')
    this.load.image('ground', 'images/grassFloor.png')
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
    function getScaleValues(
      backgroundImage: Phaser.GameObjects.Image,
      camera: Phaser.Cameras.Scene2D.Camera
    ) {
      const scaleX = camera.width / backgroundImage.width
      const scaleY = camera.height / backgroundImage.height
      return [scaleX, scaleY]
    }
    function calculateGameSize() {
      const targetAspectRatio = 30 / 16
      const windowAspectRatio = window.innerWidth / window.innerHeight
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

      return { gameWidth, gameHeight }
    }

    //canvas size
    const canvas = this.sys.game.canvas
    canvas.style.position = 'absolute'
    canvas.style.left = '50%'
    canvas.style.top = '50%'
    canvas.style.transform = 'translate(-50%, -50%)'

    canvas.style.zIndex = '2'

    const { gameWidth, gameHeight } = calculateGameSize()

    //video background library
    this.video = this.add.video(gameWidth / 2, gameHeight / 2, 'library')
    const [scaleX, scaleY] = getScaleValues(this.video, this.cameras.main)
    this.video.setScale(scaleX, scaleY)
    this.video.play()
    this.input.on('pointerdown', () => {
      this.video.play()
    })

    this.input.keyboard.on('keydown-SPACE', () => {
      this.video.play()
    })

    // update the size of the video whenever the size of the canvas changes

    //jitter sprite
    const x = this.scale.width / 2
    const y = this.scale.height / 2

    this.jitterSprite = this.physics.add.sprite(x, y, 'jitter1')
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
    const initialScale = 1.5 / 8
    this.jitterSprite.setScale(initialScale, initialScale)

    // Set the position of the jitter sprite

    this.cursors = this.input.keyboard.createCursorKeys()

    //table
    const tables = this.physics.add.staticGroup()
    tables.create(this.scale.width / 2, (this.scale.height * 4) / 5, 'table')

    // Add colliders and overlaps for each table in the group
    tables.getChildren().forEach((table) => {
      this.physics.add.collider(this.jitterSprite, table, () => {
        // Cast the body property to the ArcadeBody2D type
        const jitterSpriteBody = this.jitterSprite
          .body as Phaser.Physics.Arcade.Body
        const tableBody = table.body as Phaser.Physics.Arcade.Body

        // Access the touching property
        if (jitterSpriteBody.touching.down && tableBody.touching.up) {
          // The jitterSprite is landing on the table
          jitterSpriteBody.setVelocityY(0)
        }
      })
    })

    //cat
    this.Cat = this.physics.add.image(gameWidth, gameHeight, 'cat')
    this.Cat.setOrigin(0.1, 1)
    this.Cat.setCollideWorldBounds(true)
    this.Cat.setScale(initialScale, initialScale)
    this.input.keyboard.on('keydown-SPACE', () => {
      this.Cat.play()
    })

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
        this.switchToCafeScene()
      }
    })
  }

  update() {
    this.input.keyboard.on('keydown-UP', () => {
      this.jitterSprite.setVelocityY(-5000)
    })
    if (this.cursors.left.isDown) {
      this.jitterSprite.setVelocityX(-300)
    } else if (this.cursors.right.isDown) {
      this.jitterSprite.setVelocityX(300)
    } else {
      this.jitterSprite.setVelocityX(0)
    }
    if (this.cursors.down.isDown) {
      this.jitterSprite.setVelocityY(300)
    } else {
      this.jitterSprite.setVelocityY(0)
    }
  }
}
