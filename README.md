# Next.js 12.1.0

## DEMO
連結：https://day805-nextjs-12-1-0-osacg46o0-kairis7854.vercel.app/
![image](Readme.png)
<br>


## 筆記：Next.js 12.1.0

官網：https://nextjs.org/

## 目錄
Next.js\
基本\
0.[安裝](#安裝)\
1.[Pages](#Pages)\
2.[數據獲取](#數據獲取)\
3.[css相關](#css相關)\
4.[Layout](#Layout)\
5.[圖片優化](#圖片優化)\
6.[字體優化](#字體優化)\
7.[public資料夾](#public資料夾)\
8.[ESLint](#ESLint)\
進階\
1.[動態路由](#動態路由)\

註：next-auth/firebase-adapter 使用環境為 next-auth v3 與 firebase v8\
NextAuth\
[筆記 NextAuth](#筆記-NextAuth)\
Firebase-authentication\
[筆記 Firebase-authentication](#筆記-Firebase-authentication)\
Google-Cloud-Platform\
[筆記 Google-Cloud-Platform](#筆記-Google-Cloud-Platform)\
Vercel\
[筆記 Vercel](#筆記-Vercel)

react-responsive-carousel\
[筆記 react-responsive-carousel](#筆記-react-responsive-carousel)\
react-player \
[筆記 react-player ](#筆記-react-player)\
tailwind-scrollbar-hide\
[筆記 tailwind-scrollbar-hide](#筆記-tailwind-scrollbar-hide)\
heroIcon\
[筆記 heroIcons](#筆記-heroIcons)



## 基本
## 安裝
```js
npx create-next-app
# or
yarn create next-app
```

## Pages
```js
//pages/about.js 
function About() {
  return <div>About</div>
}

export default About
```
↑ pages資料夾下的檔案，會變成路由檔案。例如，在網址欄輸入 /about 得到對應 pages/about.js 的頁面

動態路由\
pages資料夾下含 [ ] 中括號的，例如 pages/posts/[id].js ，代表可匹配網址為 /posts/1、/posts/2、/post/abc 等等頁面


Next.js 預渲染分兩種\
靜態生成(推薦)：HTML 生成在 build 時間，並且重複使用即使在每次請求時\
服務端渲染：HTML 生成在每次請求時


```js
function About() {
  return <div>About</div>
}

export default About
```
↑靜態生成，無帶數據的
```js
function Blog({ posts }) {
  // Render posts...
}

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}

export default Blog
```
↑靜態生成，頁面內容依賴於外部數據
```js
// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}
```
↑靜態生成，頁面路徑依賴於外部數據
```js
function Post({ post }) {
  // Render post...
}

export async function getStaticPaths() {
  // ...
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // Pass post data to the page via props
  return { props: { post } }
}

export default Post
//getStaticPaths 返回 params 數據
//getStaticProps 接收 params 數據，後返回 post 數據
```
↑靜態生成，getStaticPaths 與 getStaticProps 複合使用
```js
function Page({ data }) {
  // Render data...
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default Page
```
↑服務器渲染

## 數據獲取
getServerSideProps 使用\
使用時機：只用在請求的數據需要預渲染的頁面。\
getServerSideProps在伺服器執行，請求邏輯請放在裡面，避免降低性能

getStaticProps 使用\
使用時機：數據來自數據庫、數據來自文件系統、數據可以公開緩存（不是用戶特定的）

getStaticProps 使用\
使用時機：數據可以公開緩存（不是用戶特定的）

自動刷新靜態頁面 getStaticProps 中的 revalidate 使用
```js
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  }
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}

export default Blog
```
↑ 每隔10秒，若有請求，生成新頁面

## css相關
```js
//globals.css
* {
    padding: 0;
    margin: 0;
}

//pages/_app.js
import '../globals.css'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```
↑ 添加全局樣式，資料夾位置必須為 pages/_app.js
```js
//components/Button.module.css

/*
You do not need to worry about .error {} colliding with any other `.css` or
`.module.css` files!
*/
.error {
  color: white;
  background-color: red;
}

//components/Button.js

export function Button() {
  return (
    <button
      type="button"
      // Note how the "error" class is accessed as a property on the imported
      // `styles` object.
      className={styles.error}
    >
      Destroy
    </button>
  )
}
```
↑ css模塊化方法

```js
//安裝
npm install sass
```
↑ Scss 使用\
更多請參考：https://nextjs.org/docs/basic-features/built-in-css-support
```js
function HiThere() {
  return <p style={{ color: 'red' }}>hi there</p>
}

export default HiThere
```
↑ Css in js 基本\
更多請參考：https://nextjs.org/docs/basic-features/built-in-css-support

## Layout
```js
// components/layout.js
import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

// pages/_app.js
import Layout from '../components/layout'

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
```
↑ 單一 layout。將每個頁面賦予 Navbar 與 Footer。並且當頁面變動時，保存 Navbar 與 Footer 狀態，例如 input、value 等等
```js
// pages/index.js
import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'

export default function Page() {
  return {
    /** Your content */
  }
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  )
}

// pages/_app.js
export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
```
↑ 多種 layout。getLayout 的使用

## 圖片優化 
```js
import Image from 'next/image'
import profilePic from '../public/me.png'

function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src={profilePic}
        alt="Picture of the author"
        // width={500} automatically provided
        // height={500} automatically provided
        // blurDataURL="data:..." automatically provided
        // placeholder="blur" // Optional blur-up while loading
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}
```
↑ 引入本地圖片
```js
import Image from 'next/image'

function Header() {
    return (
        <div className=''>
            <Image src='/images/logo.svg' width={80} height={80} className=''/>
        </div>
    )
}

export default Header
```
↑ 補充。在 src='/images/logo.svg' 屬性中，直接取 public 路徑下的圖片
## 字體優化 
```js
// pages/_document.js

import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
```
↑ 引入方式
```js
// next.config.js

module.exports = {
  optimizeFonts: false,
}
```
↑ 禁用方式
## public資料夾
Next.js 提供了 public 資料夾放專門靜態資料，例如 robots.txt、favicon.ico、my.html等等\
注意：public名稱不能更改
## ESLint
```js
//.eslintrc
{
  "extends": "next/core-web-vitals",
  "rules": {
    "@next/next/no-img-element": "off"
    // Other rules
  }
}
```
↑ 添加規則

## 筆記 NextAuth
官網 https://next-auth.js.org/

安裝
```js
npm install --save next-auth
```
```js
//pages/api/auth/[...nextauth].js

import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
})
```
↑ 指定位置，創建 `[...nextauth].js`
```js
//.env.local
GOOGLE_ID=xxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxx

//由 筆記 Firebase-authentication 第五步 獲得 ID 與 金鑰
```
↑ 根目錄創建 `.env.local`

```js
//_app.js
import { Provider } from "next-auth/client";

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;

//index.js
import { useSession } from 'next-auth/client'

export default function Home() {
  const {session} = useSession()

  return (
    <div >
        ...
    </div>
  )
}

export async function getServerSideProps(content) {
  const session = await getSession(content)

  return {
    props: {
      session,
    }
  }
}
```
↑ 分享 session

\
Adapters 使用
```js
npm install @next-auth/firebase-adapter@canary
```
↑安裝
```js
import NextAuth from "next-auth"
import Providers from "next-auth/providers"
//引入 Adapter 和 db
import { FirebaseAdapter } from "@next-auth/firebase-adapter"
import { db } from '../../../firebase'

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  //配置
  adapter: FirebaseAdapter(db),
})
```
↑使用
## 筆記 Firebase-authentication
官網 https://console.firebase.google.com/

安裝
```js
npm install firebase
```
1.官網>新增專案(輸入名稱)>google分析不勾選>確定\
2.官網>選專案設定(齒輪圖案)>選網頁程式(</>圖案)>輸入名稱>Hosting不勾選(用別的發佈)\
3.官網>回專案設定(齒輪圖案)>複製金鑰
```js
//這是金鑰
const firebaseConfig = {
  apiKey: "",
  authDomain: "day805-nextjs.firebaseapp.com",
  projectId: "day805-nextjs",
  storageBucket: "day805-nextjs.appspot.com",
  messagingSenderId: "",
  appId: ""
};
```
4.本地repo>根目錄創 firebase.js
```js
//firebase.js
import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "",
    authDomain: "day805-nextjs.firebaseapp.com",
    projectId: "day805-nextjs",
    storageBucket: "day805-nextjs.appspot.com",
    messagingSenderId: "",
    appId: ""
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

export { db };
```
5.官網>進入 authentication>選擇 google 驗證>選擇啟用>將 Web SDK 的 ID 與金鑰帶入本地 `.env.local`文件內

## 筆記 Google-Cloud-Platform
選擇專案>選擇 API 和服務>選擇憑證>選擇 OAuth 2.0 內的 Web client >\
1.JS授權內>URLs 添加 http://localhost:3000 與託管網址 https://day805-nextjs-12-1-0-osacg46o0-kairis7854.vercel.app

2.重定URL內>URLs 添加下方代碼給的網址 http://localhost:3000/api/auth/callback/google 
與託管網址 https://day805-nextjs-12-1-0-osacg46o0-kairis7854.vercel.app/api/auth/callback/google
```js
import { signIn } from 'next-auth/client'
//signIn 執行後的彈窗內容 the redirect URL in the request：網址
```
3.修改 .env.local
```js
//.env.local
GOOGLE_ID=xxxxxxxxxxx
GOOGLE_SECRET=xxxxxxxxxxxx
NEXTAUTH_URL=http://localhost:3000

HOST=http://localhost:3000
```

## 筆記 Vercel
官網 https://vercel.com/

1.選擇專案\
2.將 .env 內資料添加到 Environment Variables\
3.發佈\
4.Environment Variables 再添加 NEXTAUTH_URL 值為託管網址 https://day805-nextjs-12-1-0-osacg46o0-kairis7854.vercel.app/


## 筆記 react-responsive-carousel
官網 https://www.npmjs.com/package/react-responsive-carousel

安裝
```js
npm install react-responsive-carousel
```
## 筆記 tailwind-scrollbar-hide
官網 https://www.npmjs.com/package/tailwind-scrollbar-hide

安裝
```js
npm install tailwind-scrollbar-hide
```
配置
```js
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('tailwind-scrollbar-hide')
    // ...
  ]
}
```
使用
```js
<div class="w-4 scrollbar-hide">...</div>
```
## 筆記 react-player 
官網 https://www.npmjs.com/package/react-player

安裝
```js
npm install react-player 
```
使用
```js
class ResponsivePlayer extends Component {
  render () {
    return (
      <div className='player-wrapper'>
        <ReactPlayer
          className='react-player'
          url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
          width='100%'
          height='100%'
        />
      </div>
    )
  }
}
.player-wrapper {
  position: relative;
  padding-top: 56.25% /* Player ratio: 100 / (1280 / 720) */
}

.react-player {
  position: absolute;
  top: 0;
  left: 0;
}
```
## 筆記 heroIcons
官網 https://heroicons.com/

安裝
```js
npm install @heroicons/react
```
