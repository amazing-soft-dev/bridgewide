"use client";

import { useEffect, useEffectEvent } from "react";

/**
 * One scroll and resize listener for the whole page, driving one
 * `requestAnimationFrame` per frame. Every pinned section subscribes a task
 * instead of adding its own listeners.
 *
 * A task runs in the read phase (measure the DOM) and may return a function
 * for the write phase (set styles or state). All reads finish before any
 * write starts, so the sections never force layout against each other.
 */
export type FrameTask = () => void | (() => void);

const tasks = new Set<FrameTask>();
let frame = 0;
let attached = false;

function run() {
  frame = 0;
  const writes: (() => void)[] = [];
  tasks.forEach((task) => {
    const write = task();
    if (write) writes.push(write);
  });
  writes.forEach((write) => write());
}

export function requestScrollFrame() {
  if (!frame) frame = requestAnimationFrame(run);
}

function attach() {
  window.addEventListener("scroll", requestScrollFrame, { passive: true });
  window.addEventListener("resize", requestScrollFrame);
  attached = true;
}

function detach() {
  window.removeEventListener("scroll", requestScrollFrame);
  window.removeEventListener("resize", requestScrollFrame);
  attached = false;
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
}

export function subscribeScrollFrame(task: FrameTask) {
  tasks.add(task);
  if (!attached) attach();
  requestScrollFrame();
  return () => {
    tasks.delete(task);
    if (tasks.size === 0) detach();
  };
}

/**
 * Runs `task` on the shared scroll frame while `enabled`. The latest task is
 * always used, so callers can pass an inline function.
 */
export function useScrollFrame(task: FrameTask, enabled = true) {
  const run = useEffectEvent(task);

  useEffect(() => {
    if (!enabled) return;
    return subscribeScrollFrame(() => run());
  }, [enabled]);
}

/** 0 at the top of the viewport, 1 once the track's bottom reaches it. */
export function trackProgress(track: HTMLElement) {
  const rect = track.getBoundingClientRect();
  const scrollable = rect.height - window.innerHeight;
  const passed = Math.min(Math.max(-rect.top, 0), Math.max(scrollable, 0));
  return scrollable > 0 ? passed / scrollable : 0;
}

/** Maps `value` from [start, start + span] onto [0, 1]. */
export function ramp(value: number, start: number, span: number) {
  return Math.min(1, Math.max(0, (value - start) / span));
}
