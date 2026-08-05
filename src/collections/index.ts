import { Pages } from './Pages'
import { Posts } from './Posts'
import { Categories } from './Categories'
import { Media } from './Media'
import { Users } from './Users'

/** Collection order mirrors sidebar groups in admin.manifest.ts */
export const collections = [Pages, Posts, Categories, Media, Users]
