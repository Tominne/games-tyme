import Phaser, { Cameras, DOWN, LEFT, RIGHT } from 'phaser'
import { useQuery } from 'react-query'

export default class jitter extends Phaser.Scene {
  platforms?: Phaser.Physics.Arcade.StaticBody
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  keys!: any
  jitterSprite!: Phaser.Physics.Arcade.Sprite

  preload() {
    this.load.image('jitter1', 'images/jitter/jitter1.png')
    this.load.image('jitter2', 'images/jitter/jitter2.png')
    this.load.image('jitter3', 'images/jitter/jitter3.png')
    this.load.image('jitter4', 'images/jitter/jitter4.png')
    this.load.image('jitter5', 'images/jitter/jitter5.png')
    this.load.image('jitter6', 'images/jitter/jitter6.png')
  }

  create() {
    //jitter
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

    //jitter sprite
    const jitterSprite = this.add.sprite(0, 0, 'jitter1')
    jitterSprite.play('jitterAnimation')
  }
}
