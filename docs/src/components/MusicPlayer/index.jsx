import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './styles.module.css';

const API = 'https://api.jamendo.com/v3.0';
const CLIENT_ID = 'f179259e';

function formatTime(seconds) {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${m}:${s}`;
}

export default function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const containerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const tags = ['chillout+relaxing', 'ambient', 'chillout', 'relaxing', ''];
    (async () => {
      for (const tag of tags) {
        try {
          const res = await fetch(
            `${API}/tracks/?client_id=${CLIENT_ID}&format=json&limit=20` +
            `${tag ? `&tags=${tag}` : ''}&audioformat=mp32&order=popularity_total`
          );
          const data = await res.json();
          if (data.results?.length) {
            setTracks(data.results);
            break;
          }
        } catch {}
      }
    })();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handlers = {
      timeupdate: () => setProgress(audio.currentTime),
      loadedmetadata: () => setDuration(audio.duration),
      ended: () => {
        setPlaying(false);
        setIdx((i) => (i + 1) % (tracks.length || 1));
      },
      play: () => setPlaying(true),
      pause: () => setPlaying(false),
    };

    Object.entries(handlers).forEach(([event, handler]) =>
      audio.addEventListener(event, handler)
    );

    return () => {
      Object.entries(handlers).forEach(([event, handler]) =>
        audio.removeEventListener(event, handler)
      );
      audio.pause();
      audio.src = '';
    };
  }, [tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    const track = tracks[idx];
    if (!audio || !track) return;
    audio.src = track.audio;
    audio.load();
    setProgress(0);
    setDuration(0);
    audio.play().catch(() => {});
  }, [idx, tracks]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.paused ? audio.play().catch(() => {}) : audio.pause();
  }, []);

  const currentTrack = tracks[idx] || null;
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className={styles.player} ref={containerRef}>
      <button
        className={`${styles.btn} ${playing ? styles.btnOn : ''}`}
        onClick={() => tracks.length && setOpen(!open)}
        type="button"
        aria-label="音乐播放器"
      >
        <span className={styles.note}>♫</span>
      </button>

      {open && currentTrack && (
        <div className={styles.dropdown}>
          <div className={styles.bar}>
            <div className={styles.info}>
              <div className={styles.cover}>
                {currentTrack.album_image ? (
                  <img src={currentTrack.album_image} alt="" className={styles.coverImg} />
                ) : (
                  '♪'
                )}
              </div>
              <div className={styles.text}>
                <div className={styles.title}>{currentTrack.name}</div>
                <div className={styles.artist}>{currentTrack.artist_name}</div>
              </div>
            </div>
            <div className={styles.controls}>
              <button
                className={styles.ctrl}
                onClick={() => setIdx((idx - 1 + tracks.length) % tracks.length)}
                type="button"
              >
                ⏮
              </button>
              <button className={styles.play} onClick={togglePlay} type="button">
                {playing ? '⏸' : '▶'}
              </button>
              <button
                className={styles.ctrl}
                onClick={() => setIdx((idx + 1) % tracks.length)}
                type="button"
              >
                ⏭
              </button>
            </div>
            <div className={styles.progress}>
              <span className={styles.time}>{formatTime(progress)}</span>
              <div className={styles.barBg}>
                <div className={styles.barFill} style={{ width: `${progressPercent}%` }} />
              </div>
              <span className={styles.time}>{formatTime(duration)}</span>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.list}>
            {tracks.map((track, i) => (
              <button
                key={track.id}
                className={`${styles.item} ${i === idx ? styles.itemActive : ''}`}
                onClick={() => setIdx(i)}
                type="button"
              >
                <span className={styles.itemIcon}>{i === idx ? '▶' : '♪'}</span>
                <span className={styles.itemTitle}>
                  {track.name} — {track.artist_name}
                </span>
                <span className={styles.itemDur}>{formatTime(track.duration)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
