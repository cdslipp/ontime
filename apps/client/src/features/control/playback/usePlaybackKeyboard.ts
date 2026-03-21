import { useEffect, useRef } from 'react';
import { Playback, TimerPhase } from 'ontime-types';

import { setPlayback } from '../../../common/hooks/useSocket';

import { getPlaybackControlState, PlaybackControlInput } from './playbackControl.utils';

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea';
}

interface UsePlaybackKeyboardInput {
  playback: Playback;
  numEvents: number;
  selectedEventIndex: number | null;
  timerPhase: TimerPhase;
}

export function usePlaybackKeyboard(input: UsePlaybackKeyboardInput) {
  const lastEscapeRef = useRef(0);

  // Store input in a ref so the event handler always sees latest values
  const inputRef = useRef(input);
  inputRef.current = input;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (isEditableElement(event.target)) return;

      if (event.key === ' ') {
        const { disableGo, goAction } = getPlaybackControlState(inputRef.current);
        if (disableGo) return;
        event.preventDefault();
        goAction();
        return;
      }

      if (event.key === 'Escape') {
        const { playback } = inputRef.current;
        if (playback !== Playback.Play && playback !== Playback.Pause) return;

        event.preventDefault();
        const now = Date.now();
        if (now - lastEscapeRef.current < 500) {
          setPlayback.stop();
          lastEscapeRef.current = 0;
        } else {
          setPlayback.pause();
          lastEscapeRef.current = now;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}
