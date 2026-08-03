import * as migration_20260803_042552_initial from './20260803_042552_initial';
import * as migration_20260803_080235_cloudinary_media_fields from './20260803_080235_cloudinary_media_fields';

export const migrations = [
  {
    up: migration_20260803_042552_initial.up,
    down: migration_20260803_042552_initial.down,
    name: '20260803_042552_initial',
  },
  {
    up: migration_20260803_080235_cloudinary_media_fields.up,
    down: migration_20260803_080235_cloudinary_media_fields.down,
    name: '20260803_080235_cloudinary_media_fields'
  },
];
