import { useMemo, useRef, useState } from 'react'
import './App.css'

type Comment = {
  id: number
  author: string
  text: string
}

type Post = {
  id: number
  image: string
  date: string
  caption: string
  likes: number
  liked: boolean
  comments: Comment[]
}

type Page = 'home' | 'profile'

const avatar =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=85'

const initialPosts: Post[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85',
    date: 'October 18, 2026',
    caption: 'A little quiet between the mountains and the sky. #travel #weekend',
    likes: 248,
    liked: false,
    comments: [
      { id: 1, author: 'maya.travels', text: 'This view is unreal ✨' },
      { id: 2, author: 'alexmorgan', text: 'Adding this to my list!' },
    ],
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85',
    date: 'October 12, 2026',
    caption: 'Found a bit of color on my morning walk. #flowers #littlethings',
    likes: 186,
    liked: true,
    comments: [{ id: 3, author: 'sophiarose', text: 'So lovely 🌷' }],
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
    date: 'October 6, 2026',
    caption: 'Somewhere new, same feeling of being exactly where I should be. #explore',
    likes: 391,
    liked: false,
    comments: [],
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=85',
    date: 'September 29, 2026',
    caption: 'The ocean always knows how to slow everything down. #coast #slowdays',
    likes: 302,
    liked: false,
    comments: [{ id: 4, author: 'jules.jpg', text: 'Need this kind of day.' }],
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85',
    date: 'September 21, 2026',
    caption: 'Take the long way home. #forest #hiking',
    likes: 174,
    liked: false,
    comments: [],
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85',
    date: 'September 14, 2026',
    caption: 'Golden hour, no plans, and nowhere else to be. #sunset',
    likes: 427,
    liked: false,
    comments: [{ id: 5, author: 'nina.k', text: 'The colors! 💛' }],
  },
]

const friends = [
  { name: 'maya.travels', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80', note: 'Liked your photo' },
  { name: 'alexmorgan', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', note: 'Started following you' },
  { name: 'sophiarose', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&q=80', note: 'Liked your photo' },
]

function App() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('imageviewer-demo') === 'true')
  const [page, setPage] = useState<Page>('home')
  const [posts, setPosts] = useState(initialPosts)
  const [username, setUsername] = useState('jordan.lee')
  const [fullName, setFullName] = useState('Jordan Lee')
  const [search, setSearch] = useState('')
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [notice, setNotice] = useState('')

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return posts
    return posts.filter((post) => post.caption.toLowerCase().includes(query))
  }, [posts, search])

  const updatePost = (id: number, updater: (post: Post) => Post) => {
    setPosts((current) => current.map((post) => (post.id === id ? updater(post) : post)))
  }

  const signIn = (name: string) => {
    const cleanName = name.trim().replace(/^@/, '')
    setUsername(cleanName || 'jordan.lee')
    sessionStorage.setItem('imageviewer-demo', 'true')
    setAuthenticated(true)
  }

  const signOut = () => {
    sessionStorage.removeItem('imageviewer-demo')
    setAuthenticated(false)
    setPage('home')
    setSearch('')
  }

  const createPost = (image: string, caption: string) => {
    const hashtags = caption
      .split(/\s+/)
      .filter((word) => word.startsWith('#') && word.length > 1)
    if (hashtags.length === 0 && caption.trim()) {
      setNotice('Your post is ready. Add #hashtags to make it easier to discover.')
    } else {
      setNotice('Your post was added to your ImageViewer gallery.')
    }
    setPosts((current) => [
      {
        id: Date.now(),
        image,
        date: new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
        caption: caption.trim(),
        likes: 0,
        liked: false,
        comments: [],
      },
      ...current,
    ])
    setShowCreate(false)
    window.setTimeout(() => setNotice(''), 4000)
  }

  if (!authenticated) {
    return <Login onSignIn={signIn} />
  }

  const activePost = posts.find((post) => post.id === selectedPost) ?? null
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0)

  return (
    <div className="app">
      <header className="topbar">
        <a className="wordmark" href="#" onClick={(event) => { event.preventDefault(); setPage('home') }}>
          <span className="wordmark-icon">◉</span> imageviewer
        </a>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="Search captions"
            placeholder="Search captions..."
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage('home') }}
          />
          {search && <button className="clear-search" aria-label="Clear search" onClick={() => setSearch('')}>×</button>}
        </label>
        <nav className="top-actions" aria-label="Main navigation">
          <button className={`icon-button ${page === 'home' ? 'active' : ''}`} aria-label="Home" onClick={() => setPage('home')}>⌂</button>
          <button className="icon-button" aria-label="Create post" onClick={() => setShowCreate(true)}>＋</button>
          <button className="icon-button" aria-label="Profile" onClick={() => setPage('profile')}>♡</button>
          <button className="avatar-button" aria-label="Open profile" onClick={() => setPage('profile')}>
            <img src={avatar} alt="" />
          </button>
        </nav>
      </header>

      <main className="layout">
        <section className="main-column">
          {page === 'home' ? (
            <>
              <div className="welcome-row">
                <div>
                  <p className="overline">YOUR PHOTO JOURNAL</p>
                  <h1>Good morning, {fullName.split(' ')[0]}</h1>
                  <p className="subtitle">A little window into the moments you’ve shared.</p>
                </div>
                <button className="primary-button" onClick={() => setShowCreate(true)}><span>＋</span> New post</button>
              </div>
              {search && <p className="search-results">{filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} matching “{search}”</p>}
              <div className="feed">
                {filteredPosts.length ? filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    username={username}
                    onLike={() => updatePost(post.id, (item) => ({ ...item, liked: !item.liked, likes: item.likes + (item.liked ? -1 : 1) }))}
                    onOpen={() => setSelectedPost(post.id)}
                  />
                )) : (
                  <div className="empty-state">
                    <span className="empty-icon">⌕</span>
                    <h2>No posts found</h2>
                    <p>Try another caption or clear your search.</p>
                    <button className="text-button" onClick={() => setSearch('')}>Clear search</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Profile
              username={username}
              fullName={fullName}
              posts={posts}
              totalLikes={totalLikes}
              onEditName={setFullName}
              onSelectPost={(id) => setSelectedPost(id)}
              onCreate={() => setShowCreate(true)}
            />
          )}
        </section>
        <aside className="right-column">
          <div className="profile-summary">
            <button className="summary-user" onClick={() => setPage('profile')}>
              <img src={avatar} alt="" />
              <span><strong>{username}</strong><small>{fullName}</small></span>
            </button>
            <button className="subtle-button" onClick={signOut}>Log out</button>
          </div>
          <section className="suggestions">
            <div className="section-heading"><h2>Today in your circle</h2><span>See all</span></div>
            {friends.map((friend) => (
              <div className="friend-row" key={friend.name}>
                <img src={friend.image} alt="" />
                <div><strong>{friend.name}</strong><small>{friend.note}</small></div>
                <span className="friend-dot" aria-label="Recent activity">•</span>
              </div>
            ))}
          </section>
          <div className="about-card">
            <div className="about-icon">i</div>
            <div><strong>Your memories, together.</strong><p>ImageViewer is a personal demo. Likes and comments reset when you refresh and never change Instagram.</p></div>
          </div>
          <p className="footer-note">ABOUT · HELP · PRIVACY · TERMS<br /><span>© 2026 IMAGEVIEWER</span></p>
        </aside>
      </main>
      {notice && <div className="toast" role="status">{notice}</div>}
      {showCreate && <CreatePost username={username} onClose={() => setShowCreate(false)} onCreate={createPost} />}
      {activePost && (
        <PostDetails
          post={activePost}
          username={username}
          onClose={() => setSelectedPost(null)}
          onLike={() => updatePost(activePost.id, (item) => ({ ...item, liked: !item.liked, likes: item.likes + (item.liked ? -1 : 1) }))}
          onComment={(text) => updatePost(activePost.id, (item) => ({
            ...item,
            comments: [...item.comments, { id: Date.now(), author: username, text }],
          }))}
        />
      )}
    </div>
  )
}

function Login({ onSignIn }: { onSignIn: (name: string) => void }) {
  const [token, setToken] = useState('')
  const [handle, setHandle] = useState('jordan.lee')
  const [showToken, setShowToken] = useState(false)

  return (
    <main className="login-screen">
      <div className="login-art">
        <div className="login-art-copy">
          <a className="wordmark light" href="#"><span className="wordmark-icon">◉</span> imageviewer</a>
          <div><p className="overline">A HOME FOR YOUR MOMENTS</p><h1>See your world<br />a little closer.</h1><p>All your favorite frames, gathered in one place.</p></div>
          <div className="photo-stack">
            <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=85" alt="Mountain landscape" />
            <img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=400&q=85" alt="Flowers in bloom" />
            <img src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=400&q=85" alt="Ocean waves" />
          </div>
          <p className="art-credit">A LITTLE SPACE FOR THE THINGS YOU SEE.</p>
        </div>
      </div>
      <section className="login-panel">
        <div className="login-card">
          <p className="overline">WELCOME BACK</p>
          <h2>Sign in to ImageViewer</h2>
          <p className="login-description">Use a demo profile to explore the app, or enter a token for the learning exercise.</p>
          <form onSubmit={(event) => { event.preventDefault(); onSignIn(handle) }}>
            <label className="field-label" htmlFor="handle">Username</label>
            <div className="input-wrap"><span>@</span><input id="handle" autoComplete="username" value={handle} onChange={(event) => setHandle(event.target.value)} required /></div>
            <label className="field-label token-label" htmlFor="token">Instagram access token <span>OPTIONAL</span></label>
            <div className="input-wrap token-wrap">
              <input id="token" type={showToken ? 'text' : 'password'} placeholder="Paste token (demo only)" value={token} onChange={(event) => setToken(event.target.value)} />
              <button type="button" className="show-token" onClick={() => setShowToken((show) => !show)}>{showToken ? 'Hide' : 'Show'}</button>
            </div>
            <p className="token-note">This standalone learning demo does not send or validate your token.</p>
            <button className="login-submit" type="submit">Continue <span>→</span></button>
          </form>
          <div className="login-divider"><span>OR</span></div>
          <button className="demo-button" onClick={() => onSignIn('jordan.lee')}>Explore with demo account <span>↗</span></button>
          <p className="login-terms">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
        </div>
        <div className="login-bottom"><span>IMAGEVIEWER · COURSE 7</span><span>MADE FOR YOUR MEMORIES</span></div>
      </section>
    </main>
  )
}

function PostCard({ post, username, onLike, onOpen }: { post: Post; username: string; onLike: () => void; onOpen: () => void }) {
  return (
    <article className="post-card">
      <header className="post-header">
        <button className="post-user" onClick={onOpen}><img src={avatar} alt="" /><span><strong>{username}</strong><small>{post.date}</small></span></button>
        <button className="more-button" aria-label="More post options" onClick={onOpen}>···</button>
      </header>
      <button className="post-image-button" onClick={onOpen} aria-label="View post details">
        <img className="post-image" src={post.image} alt={post.caption || 'Photo shared by the user'} />
      </button>
      <div className="post-actions">
        <div className="action-group">
          <button className={`post-action ${post.liked ? 'liked' : ''}`} aria-label={post.liked ? 'Unlike post' : 'Like post'} onClick={onLike}>{post.liked ? '♥' : '♡'}</button>
          <button className="post-action" aria-label="View comments" onClick={onOpen}>▱</button>
          <button className="post-action share-action" aria-label="Share post" onClick={onOpen}>↗</button>
        </div>
        <button className="bookmark-button" aria-label="Save post" onClick={onOpen}>♧</button>
      </div>
      <div className="post-caption">
        <strong>{post.likes.toLocaleString()} likes</strong>
        <p><b>{username}</b> {post.caption}</p>
        {post.comments.length > 0 && <button className="view-comments" onClick={onOpen}>View all {post.comments.length} comments</button>}
        <button className="add-comment" onClick={onOpen}>Add a comment… <span>☺</span></button>
      </div>
    </article>
  )
}

function Profile({ username, fullName, posts, totalLikes, onEditName, onSelectPost, onCreate }: {
  username: string
  fullName: string
  posts: Post[]
  totalLikes: number
  onEditName: (name: string) => void
  onSelectPost: (id: number) => void
  onCreate: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(fullName)

  const saveName = () => {
    if (draft.trim()) onEditName(draft.trim())
    setEditing(false)
  }

  return (
    <div className="profile-page">
      <section className="profile-header">
        <img className="profile-avatar" src={avatar} alt={`${fullName} profile`} />
        <div className="profile-info">
          <div className="profile-title-row"><h1>{username}</h1><button className="secondary-button" onClick={() => { setDraft(fullName); setEditing(true) }}>Edit profile</button><button className="settings-button" aria-label="Settings">⚙</button></div>
          <div className="profile-stats"><span><strong>{posts.length}</strong> posts</span><span><strong>386</strong> followers</span><span><strong>421</strong> following</span></div>
          <div className="profile-bio"><strong>{fullName}</strong><p>Collecting little moments and faraway places ✨<br />Here for the light, the colors, and the stories.</p><a href="#journal">myjournal.example</a></div>
        </div>
      </section>
      <div className="profile-tabs"><button className="selected">▦ <span>POSTS</span></button><button>▤ <span>SAVED</span></button><button>♙ <span>TAGGED</span></button></div>
      {posts.length ? (
        <div className="profile-grid">
          {posts.map((post) => <button key={post.id} className="grid-tile" onClick={() => onSelectPost(post.id)}>
            <img src={post.image} alt={post.caption || 'Photo post'} />
            <span className="tile-overlay"><span>♥ {post.likes}</span><span>▱ {post.comments.length}</span></span>
          </button>)}
        </div>
      ) : (
        <div className="empty-state profile-empty"><span className="empty-icon">▧</span><h2>Share your first photo</h2><p>Your profile grid is ready for a new memory.</p><button className="text-button" onClick={onCreate}>Create a post</button></div>
      )}
      {editing && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(false) }}>
        <section className="edit-dialog" role="dialog" aria-modal="true" aria-labelledby="edit-name-title">
          <button className="dialog-close" aria-label="Close" onClick={() => setEditing(false)}>×</button>
          <p className="overline">YOUR PROFILE</p><h2 id="edit-name-title">Edit your name</h2>
          <label className="field-label" htmlFor="full-name">Full name</label><input className="text-input" id="full-name" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={60} />
          <div className="dialog-actions"><button className="secondary-button" onClick={() => setEditing(false)}>Cancel</button><button className="primary-button" onClick={saveName}>Save changes</button></div>
        </section>
      </div>}
      <p className="profile-footnote">{posts.length} posts · {totalLikes.toLocaleString()} total likes</p>
    </div>
  )
}

function PostDetails({ post, username, onClose, onLike, onComment }: {
  post: Post
  username: string
  onClose: () => void
  onLike: () => void
  onComment: (text: string) => void
}) {
  const [comment, setComment] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const submitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = comment.trim()
    if (!text) return
    onComment(text)
    setComment('')
  }

  return (
    <div className="dialog-backdrop post-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="post-dialog" role="dialog" aria-modal="true" aria-label="Post details">
        <button className="dialog-close post-dialog-close" aria-label="Close" onClick={onClose}>×</button>
        <div className="detail-photo"><img src={post.image} alt={post.caption || 'Post photo'} /></div>
        <div className="detail-panel">
          <header className="post-header detail-header"><button className="post-user"><img src={avatar} alt="" /><span><strong>{username}</strong><small>{post.date}</small></span></button><button className="more-button" aria-label="More options">···</button></header>
          <div className="detail-comments">
            <div className="detail-caption"><img src={avatar} alt="" /><p><strong>{username}</strong> {post.caption}</p></div>
            {post.comments.map((item) => <div className="comment-row" key={item.id}><span className="comment-avatar">{item.author.slice(0, 1).toUpperCase()}</span><p><strong>{item.author}</strong> {item.text}</p><button aria-label="Like comment">♡</button></div>)}
            {!post.comments.length && <p className="no-comments">No comments yet. Start the conversation.</p>}
          </div>
          <div className="detail-footer">
            <div className="post-actions"><div className="action-group"><button className={`post-action ${post.liked ? 'liked' : ''}`} aria-label={post.liked ? 'Unlike post' : 'Like post'} onClick={onLike}>{post.liked ? '♥' : '♡'}</button><button className="post-action" aria-label="Add a comment" onClick={() => inputRef.current?.focus()}>▱</button><button className="post-action share-action" aria-label="Share post">↗</button></div><button className="bookmark-button" aria-label="Save post">♧</button></div>
            <strong className="detail-like-count">{post.likes.toLocaleString()} likes</strong>
            <small className="detail-date">{post.date.toUpperCase()}</small>
            <form className="comment-form" onSubmit={submitComment}><input ref={inputRef} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a comment…" aria-label="Add a comment" /><button disabled={!comment.trim()}>Post</button></form>
          </div>
        </div>
      </section>
    </div>
  )
}

function CreatePost({ username, onClose, onCreate }: { username: string; onClose: () => void; onCreate: (image: string, caption: string) => void }) {
  const [image, setImage] = useState('')
  const [caption, setCaption] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const readImage = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file such as JPG, PNG, or WebP.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('The image must be smaller than 10 MB.')
      return
    }
    const reader = new FileReader()
    reader.onerror = () => setError('The image could not be read. Please try another file.')
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result)
        setError('')
      } else {
        setError('The image could not be read. Please try another file.')
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="create-dialog" role="dialog" aria-modal="true" aria-labelledby="create-title">
        <header className="create-header"><button className="dialog-close" aria-label="Close" onClick={onClose}>×</button><h2 id="create-title">Create a post</h2><button className="share-button" disabled={!image || !caption.trim()} onClick={() => onCreate(image, caption)}>Share</button></header>
        <div className="create-content">
          <div className={`upload-area ${image ? 'has-image' : ''}`} onClick={() => fileRef.current?.click()}>
            {image ? <img src={image} alt="Selected upload preview" /> : <><span className="upload-icon">▧</span><h3>Share a photo with your circle</h3><p>Choose an image from your device</p><span className="select-file">Select from computer</span></>}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(event) => readImage(event.target.files?.[0])} />
          </div>
          <div className="create-form">
            <div className="create-user"><img src={avatar} alt="" /><strong>{username}</strong></div>
            <textarea placeholder="Write a caption… Add #hashtags to help organize your photos." value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={500} aria-label="Post caption" />
            <div className="caption-count">{caption.length}/500</div>
            <button className="upload-change" onClick={() => fileRef.current?.click()}>{image ? 'Choose a different photo' : 'Choose a photo'} <span>↗</span></button>
          </div>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="demo-disclaimer">Posts are saved in this demo session only. They are not published to Instagram.</div>
      </section>
    </div>
  )
}

export default App
