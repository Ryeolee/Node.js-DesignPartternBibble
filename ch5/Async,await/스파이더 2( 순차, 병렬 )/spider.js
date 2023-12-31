import { promises as fsPromises } from 'fs'
import { dirname } from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename, getPageLinks } from './utils.js'
import { promisify } from 'util'

const mkdirpPromises = promisify(mkdirp)

async function download (url, filename) {
  console.log(`Downloading ${url}`)
  const { text: content } = await superagent.get(url)
  await mkdirpPromises(dirname(filename))
  await fsPromises.writeFile(filename, content)
  console.log(`Downloaded and saved: ${url}`)
  return content
}


async function spiderLinks (currentUrl, content, nesting) {
    if (nesting === 0) {
      return
    }
    const links = getPageLinks(currentUrl, content)

    for (const link of links) {
      await spider(link, nesting - 1)
    }

    // links.forEach( async function iteration(link) {              // 안티 패턴 ( 순차 )
    //     await spider(link, nesting - 1)
    // });


    // const promises = links.map(link => spider(link, nesting - 1))       // 병렬 실행 ( 오류 시 바로 오류가 나지 않고 모든 요청 처리 후 오류가 남 비추천)
    // for(const promise of promises){
    //   await promise
    // }

    const promises = links.map(link => spider(link, nesting - 1))  

    return Promise.all(promises)




    




  }

  
  export async function spider (url, nesting) {
    const filename = urlToFilename(url)
    let content
    try {
      content = await fsPromises.readFile(filename, 'utf8')
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err
      }
  
      content = await download(url, filename)
    }
  
    return spiderLinks(url, content, nesting)
  }