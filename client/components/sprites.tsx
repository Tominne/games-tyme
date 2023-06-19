import Phaser, { Cameras, DOWN, LEFT, RIGHT } from 'phaser'
import { useQuery } from 'react-query'
import { getWeather } from '../api'
import jitter from './jitter'

export default class libraryScene extends Phaser.Scene {
  platforms?: Phaser.Physics.Arcade.StaticGroup
  jitterSprite!: Phaser.Physics.Arcade.Image
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  cat?: Phaser.Physics.Arcade.Sprite
  keys!: any

  preload() {
    this.load.image('frame1', 'images/dog/run1.png')
    this.load.image('frame2', 'images/dog/run1-5.png')
    this.load.image('frame3', 'images/dog/run2.png')
  }
}
