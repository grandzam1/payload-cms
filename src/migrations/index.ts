import * as migration_20260803_042552_initial from './20260803_042552_initial';
import * as migration_20260803_080235_cloudinary_media_fields from './20260803_080235_cloudinary_media_fields';
import * as migration_20260805_013000_admin_ia from './20260805_013000_admin_ia';

export const migrations = [
  {
    up: migration_20260803_042552_initial.up,
    down: migration_20260803_042552_initial.down,
    name: '20260803_042552_initial',
  },
  {
    up: migration_20260803_080235_cloudinary_media_fields.up,
    down: migration_20260803_080235_cloudinary_media_fields.down,
    name: '20260803_080235_cloudinary_media_fields',
  },
  {
    up: migration_20260805_013000_admin_ia.up,
    down: migration_20260805_013000_admin_ia.down,
    name: '20260805_013000_admin_ia',
  },
]
