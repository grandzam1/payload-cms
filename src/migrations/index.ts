import * as migration_20260803_042552_initial from './20260803_042552_initial';

export const migrations = [
  {
    up: migration_20260803_042552_initial.up,
    down: migration_20260803_042552_initial.down,
    name: '20260803_042552_initial'
  },
];
