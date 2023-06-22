import { table } from '@webassemblyjs/ast/lib/nodes'
import Phaser, { Cameras, DOWN, LEFT, RIGHT } from 'phaser'

export default class libraryScene extends Phaser.Scene {
  private platforms?: Phaser.Physics.Arcade.StaticBody
  private logo!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private cat?: Phaser.Physics.Arcade.Sprite
  jitterSprite
  Cat
  emitter

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
    this.load.image('bees', 'images/bees.png')
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
    //sounds
    this.load.audio('cafeSound', 'sounds/cafeSounds.mp3')
    this.load.audio('beeSounds', 'sounds/bee-buzzing-sound.mp3')
  }

  async create() {
    const cafeSound = this.sound.add('cafeSound')
    cafeSound.play()
    function getScaleValues(
      backgroundImage: Phaser.GameObjects.Image,
      camera: Phaser.Cameras.Scene2D.Camera
    ) {
      const scaleX = camera.width / backgroundImage.width
      const scaleY = camera.height / backgroundImage.height
      return [scaleX, scaleY]
    }
    function calculateGameSize() {
      const gameWidth = window.innerWidth
      const gameHeight = window.innerHeight

      return { gameWidth, gameHeight }
    }

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
    await this.jitterSprite.play('jitterAnimation')
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
    const table = tables.create(
      this.scale.width / 2,
      (this.scale.height * 4) / 5,
      'table'
    )
    table.setScale(1.2, 1)
    table.setVisible(false)
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

    //sounds
    let particleSounds = true

    this.emitter = this.add.particles('bees').createEmitter({
      speed: 150,
      quantity: 0.0001,
      scale: { start: 1, end: 0 },
    })
    this.emitter.stop()
    const beeSound = this.sound.add('beeSounds')

    // emit particles around the player when they jump
    this.input.keyboard.on('keydown-SPACE', () => {
      this.emitter.setPosition(this.jitterSprite.x, this.jitterSprite.y)
      this.emitter.start()
      if (particleSounds) {
        beeSound.play()
      }
      // stop emitting particles after 3 seconds
      this.time.delayedCall(3000, () => {
        this.emitter.stop()
        beeSound.stop()
      })
    })
    //sounds switch

    const soundSwitch = this.add.text(10, 10, 'Particle Sounds: ON', {
      color: '#ffffff',
      stroke: '#ff0000',
      strokeThickness: 2,
    })
    soundSwitch.setInteractive()
    soundSwitch.on('pointerdown', () => {
      particleSounds = !particleSounds
      soundSwitch.text = `Particle Sounds: ${particleSounds ? 'ON' : 'OFF'}`
    })
    //cat
    this.Cat = this.physics.add.image(gameWidth / 2.1, gameHeight / 1.3, 'cat')
    this.Cat.setOrigin(0.1, 1)
    this.Cat.setCollideWorldBounds(true)
    this.Cat.setScale(initialScale + 0.13, initialScale + 0.13)
    this.input.keyboard.on('keydown-SPACE', () => {
      this.Cat.play()
    })
    this.physics.add.collider(this.Cat, table)

    const door = this.add.sprite(0, 0, 'wonderlandDoor')
    door.setOrigin(0, 1)
    door.setScale(0.2)
    door.setPosition(0, this.scale.height)
    door.setInteractive()
    this.input.keyboard.on('keydown-C', () => {
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
