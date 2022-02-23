# Next.js 12.1.0

## DEMO
連結：

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

進階\
1.[動態路由](#動態路由)\

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
pages資料夾下含 [ ] 中括號的，例如 pages/posts/[id].js ，代表可匹配網址為 /posts/1、/posts/2、/post/abc 等等頁面\
更多請參考：1.[動態路由](#動態路由)

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