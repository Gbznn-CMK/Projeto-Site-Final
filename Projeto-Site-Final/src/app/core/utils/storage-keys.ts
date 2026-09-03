/**
 * Centralized storage key definitions.
 *
 * All services and utilities that persist to localStorage must use these
 * keys so the prefix and every entity key stay in sync across the app.
 */
export const STORAGE_PREFIX = 'nahora_';

export const StorageKeys = {
  USUARIOS: `${STORAGE_PREFIX}usuarios`,
  PRESTADORES: `${STORAGE_PREFIX}prestadores`,
  SERVICOS: `${STORAGE_PREFIX}servicos`,
  AGENDAMENTOS: `${STORAGE_PREFIX}agendamentos`,
  DISPONIBILIDADES: `${STORAGE_PREFIX}disponibilidades`,
  BLOQUEIOS: `${STORAGE_PREFIX}bloqueios`,
  CHAMADOS: `${STORAGE_PREFIX}chamados`,
  FAVORITOS: `${STORAGE_PREFIX}favoritos`,
  TOKEN: `${STORAGE_PREFIX}token`,
  INITIALIZED: `${STORAGE_PREFIX}initialized`
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
