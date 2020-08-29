import _ from 'lodash'

import beep1 from './beep1.m4a'
import beep2 from './beep2.m4a'
import boop1 from './boop1.m4a'
import boop2 from './boop2.m4a'
import clap1 from './clap1.m4a'
import clap2 from './clap2.m4a'
import clap4 from './clap4.m4a'

export const ClapPattern = [1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0]

export class AudioPool {
  constructor(audioFiles) {
    this.audioFiles = audioFiles
    this.audios = _.range(50).map((_) => new Audio(this.randomClap()))
    this.isLoaded = false
  }

  randomClap() {
    let idx = _.random(0, this.audioFiles.length - 1)
    return this.audioFiles[idx]
  }

  play() {
    let next = this.audios.shift()
    next.play()
    this.audios.push(next)
  }
}

export class Clapper {
  constructor(key = null, pattern = ClapPattern, poolName = 'claps') {
    this.key = key || _.uniqueId('clapper')
    this.pattern = pattern
    this.poolName = poolName
  }

  beat(index) {
    if (this.pattern[index]) {
      Pools[this.poolName].play()
    }
  }

  setPoolName(poolName) {
    this.poolName = poolName
  }

  phase() {
    const phasePattern = [..._.tail(this.pattern), _.head(this.pattern)]
    return new Clapper(this.key, phasePattern, this.poolName)
  }
}

export const Pools = {
  claps: new AudioPool([clap1, clap2, clap4]),
  beepboop: new AudioPool([beep1, beep2, boop1, boop2]),
}
