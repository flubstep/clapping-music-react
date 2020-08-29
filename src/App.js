import React, {useState, useEffect} from 'react'
import {ClapPattern, Clapper} from './audio'

import {
  PauseCircleOutline,
  PlayCircleOutline,
  AddCircleOutline,
  RemoveCircleOutline,
  RotateLeft,
} from '@material-ui/icons'

import './App.css'

const BPM = 200

const EIGHTH_NOTE_SVG = '/8thNote.svg'
const EIGHTH_REST_SVG = '/8thRest.svg'

function Footer({poolName, setPoolName}) {
  return (
    <div className="Footer">
      <>
        But what is{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://en.wikipedia.org/wiki/Clapping_Music"
        >
          clapping music?
        </a>
      </>
      <span style={{marginLeft: 12}}>
        <button
          className="audio-selector"
          onClick={() => setPoolName('claps')}
          disabled={poolName === 'claps'}
        >
          Claps
        </button>
        {' or '}
        <button
          className="audio-selector"
          onClick={() => setPoolName('beepboop')}
          disabled={poolName === 'beepboop'}
        >
          BeepBoop
        </button>
      </span>
    </div>
  )
}

function App() {
  const [musicians, setMusicians] = useState([new Clapper()])
  const [isPlaying, setIsPlaying] = useState(false)
  const [index, setIndex] = useState(-1)
  const [poolName, setPoolName] = useState('claps')

  useEffect(() => {
    function beat() {
      const nextIndex = (index + 1) % ClapPattern.length
      setIndex(nextIndex)
      for (const musician of musicians) {
        // Wait in order to *sort of* account for animation + sound delay
        setTimeout(() => musician.beat(nextIndex), 40)
      }
    }
    const interval = isPlaying ? setInterval(beat, 60000 / BPM / 2) : null
    return () => clearInterval(interval)
  }, [isPlaying, index, musicians])

  useEffect(() => {
    for (const musician of musicians) {
      musician.setPoolName(poolName)
    }
  }, [poolName, musicians])

  function start() {
    setIsPlaying(true)
  }

  function stop() {
    setIsPlaying(false)
    setIndex(-1)
  }

  function phase(musicianIndex) {
    setMusicians([
      ...musicians.slice(0, musicianIndex),
      musicians[musicianIndex].phase(),
      ...musicians.slice(musicianIndex + 1),
    ])
  }

  function add() {
    setMusicians([...musicians, new Clapper()])
  }

  function remove(removeIndex) {
    setMusicians([
      ...musicians.slice(0, removeIndex),
      ...musicians.slice(removeIndex + 1),
    ])
  }

  return (
    <div className="IndexPage ">
      <div className="flex-centered column">
        {isPlaying ? (
          <PauseCircleOutline
            onClick={stop}
            className="clickable material-icon"
            style={{fontSize: 60}}
          />
        ) : (
          <PlayCircleOutline
            onClick={start}
            className="clickable material-icon"
            style={{fontSize: 60}}
          />
        )}
        {musicians.map((m, idx) => (
          <div className="Musician">
            <RotateLeft
              onClick={() => phase(idx)}
              fontSize="medium"
              className="clickable material-icon"
            />
            <div className="flex-centered" onClick={() => phase(idx)}>
              {m.pattern.map((note, noteIdx) => {
                const src = note ? EIGHTH_NOTE_SVG : EIGHTH_REST_SVG
                const isCurrent = noteIdx === index && note && isPlaying
                return (
                  <div
                    className={
                      'Musician__note-container flex-centered' +
                      (isCurrent ? ' current' : '')
                    }
                  >
                    <img
                      role="presentation"
                      alt="note"
                      className="Musician__note"
                      src={src}
                    />
                  </div>
                )
              })}
            </div>
            <RemoveCircleOutline
              onClick={() => remove(idx)}
              fontSize="medium"
              className="clickable material-icon"
            />
          </div>
        ))}
        <div className="flex-centered">
          <AddCircleOutline
            onClick={add}
            fontSize="medium"
            className="clickable material-icon"
          />
        </div>
      </div>
      <Footer poolName={poolName} setPoolName={setPoolName} />
    </div>
  )
}

export default App
