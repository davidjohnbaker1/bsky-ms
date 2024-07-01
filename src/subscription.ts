import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'

const matchText: string[] = [
  // Twitter tags  
  '#musicscience',
  '#musicscience',
  'musicscience',
  'music and science',
  'icmpc17',
  '#icmpc17',
  'icmpc2023',
  'icmpc23',
  '#icmpc2023',
  '#icmpc23',
  // Round 2 
  'ICMPC',
  'ICMPC 2023',
  'icmpc',
  'ESCOM12',
  'escom12',
  '#escom12',
  '#ESCOM12',
  'SMPC2024',
  '#SMPC2024',
  '#smpc2024',
  'smpc2024',
  'SMPC24',
  '#SMPC24',
  // Emoji Crossing
  '🎧 🧪 ',
  '🎧 🔬 ',
  '🎧 🧬 ',
  '🎧 ⚕️',
  '🎧 🥼 ',
  '🎧 📏 ',
  '🎧 ⚙️',
  '🎵 🔬 ',
  '🎵 🧪 ',
  '🎵 🧬 ',
  '🎵 ⚕️',
  '🎵 🥼 ',
  '🎵 📏 ',
  '🎻 🧠 ', // Psyche addition 
  '🎵 🧠 ', // Sinead addition
  '🎧 🧠 ',
  '🎵 ⚙️',
]

const matchPatterns: RegExp[] = [
  //
]

// Include high profile music science users here to always include their posts
const matchUsers: string[] = [
  //
]

// Exclude posts from these users
const bannedUsers: string[] = [
  //
]


export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return
    const ops = await getOpsByType(evt)

    const postsToDelete = ops.posts.deletes.map((del) => del.uri)
    const postsToCreate = ops.posts.creates
      .filter((create) => {
        const txt = create.record.text.toLowerCase()
        return (
          (matchText.some((term) => txt.includes(term)) ||
            matchPatterns.some((pattern) => pattern.test(txt)) ||
            matchUsers.includes(create.author)) &&
          !bannedUsers.includes(create.author)
        )
      })
      .map((create) => {
        console.log(`Found post by ${create.author}: ${create.record.text}`)

        return {
          uri: create.uri,
          cid: create.cid,
          replyParent: create.record?.reply?.parent.uri ?? null,
          replyRoot: create.record?.reply?.root.uri ?? null,
          indexedAt: new Date().toISOString(),
        }
      })

    if (postsToDelete.length > 0) {
      await this.db
        .deleteFrom('post')
        .where('uri', 'in', postsToDelete)
        .execute()
    }
    if (postsToCreate.length > 0) {
      await this.db
        .insertInto('post')
        .values(postsToCreate)
        .onConflict((oc) => oc.doNothing())
        .execute()
    }
  }
}
