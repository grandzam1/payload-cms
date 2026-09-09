import * as migration_20260803_042552_initial from './20260803_042552_initial';
import * as migration_20260803_080235_cloudinary_media_fields from './20260803_080235_cloudinary_media_fields';
import * as migration_20260805_013000_admin_ia from './20260805_013000_admin_ia';
import * as migration_20260805_035400_media_alt_optional from './20260805_035400_media_alt_optional';
import * as migration_20260808_050958_drafts_pages_posts from './20260808_050958_drafts_pages_posts';
import * as migration_20260909_074502_pages_blocks_appearance from './20260909_074502_pages_blocks_appearance';
import * as migration_20260909_074901_pages_blocks_reviews from './20260909_074901_pages_blocks_reviews';
import * as migration_20260909_075428_pages_blocks_access_tier from './20260909_075428_pages_blocks_access_tier';
import * as migration_20260909_075550_site_settings_marquee from './20260909_075550_site_settings_marquee';
import * as migration_20260909_090726_media_folders from './20260909_090726_media_folders';

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
  {
    up: migration_20260805_035400_media_alt_optional.up,
    down: migration_20260805_035400_media_alt_optional.down,
    name: '20260805_035400_media_alt_optional',
  },
  {
    up: migration_20260808_050958_drafts_pages_posts.up,
    down: migration_20260808_050958_drafts_pages_posts.down,
    name: '20260808_050958_drafts_pages_posts',
  },
  {
    up: migration_20260909_074502_pages_blocks_appearance.up,
    down: migration_20260909_074502_pages_blocks_appearance.down,
    name: '20260909_074502_pages_blocks_appearance',
  },
  {
    up: migration_20260909_074901_pages_blocks_reviews.up,
    down: migration_20260909_074901_pages_blocks_reviews.down,
    name: '20260909_074901_pages_blocks_reviews',
  },
  {
    up: migration_20260909_075428_pages_blocks_access_tier.up,
    down: migration_20260909_075428_pages_blocks_access_tier.down,
    name: '20260909_075428_pages_blocks_access_tier',
  },
  {
    up: migration_20260909_075550_site_settings_marquee.up,
    down: migration_20260909_075550_site_settings_marquee.down,
    name: '20260909_075550_site_settings_marquee',
  },
  {
    up: migration_20260909_090726_media_folders.up,
    down: migration_20260909_090726_media_folders.down,
    name: '20260909_090726_media_folders',
  },
]
