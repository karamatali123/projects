import type { Direction } from "@/lib/types";

export const DIRECTIONS = ["UP", "DOWN", "LEFT", "RIGHT"] as const;

export const DIRECTION_LABEL: Record<Direction, string> = {
  UP: "Up",
  DOWN: "Down",
  LEFT: "Left",
  RIGHT: "Right",
};

export const DIRECTION_GLYPH: Record<Direction, string> = {
  UP: "↑",
  DOWN: "↓",
  LEFT: "←",
  RIGHT: "→",
};

export const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
};

export const DIRECTION_KEY: Record<Direction, string> = {
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
};
