import Phaser, { Cameras, DOWN, LEFT, RIGHT } from 'phaser'
import { useQuery } from 'react-query'

import jitter from './jitter'
import { Physics } from 'phaser'
export default class libraryScene extends Physics.Arcade.Sprite {
  platforms?: Phaser.Physics.Arcade.StaticGroup
  jitterSprite!: Phaser.Physics.Arcade.Image
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  cat?: Phaser.Physics.Arcade.Sprite
  keys!: any

  protected hp = 100
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.getBody().setCollideWorldBounds(true)
  }
  public getDamage(value?: number): void {
    this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: 3,
      yoyo: true,
      alpha: 0.5,
      onStart: () => {
        if (value) {
          this.hp = this.hp - value
        }
      },
      onComplete: () => {
        this.setAlpha(1)
      },
    })
  }
  public getHPValue(): number {
    return this.hp
  }
  protected checkFlip(): void {
    if (this.body.velocity.x < 0) {
      this.scaleX = -1
    } else {
      this.scaleX = 1
    }
  }
  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body
  }
}
