import path from 'path'
import { URL } from 'url'
import slug from 'slug'
import mkdirp from 'mkdirp'
import { urlToFilename, getPageLinks } from './utils.js'





export function urlToFilename (url) {
  const parsedUrl = new URL(url)
  const urlPath = parsedUrl.pathname.split('/')
    .filter(function (component) {
      return component !== ''
    })
    .map(function (component) {
      return slug(component, { remove: null })
    })
    .join('/')
  let filename = path.join(parsedUrl.hostname, urlPath)
  if (!path.extname(filename).match(/htm/)) {
    filename += '.html'
  }

  return filename
}