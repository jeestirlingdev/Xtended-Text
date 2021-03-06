/*************************
 * 
 * HTML Contents
 * https://github.com/psalmody/html-contents
 * MIT License
 * Adapted in include articleId parameter
 */

const htmlContents = function(toc, options) {
  options = Object.assign({}, {
    top: 2,           // biggest header to include in outline - default H2
    bottom: 3,        // smallest header to include in outline - default H3
    addIds: true,     // addIds - yes by default to H* that don't have them
    addLinks: true,   // addLinks - 
    listType: 'u',    // 'u' or 'o' - (u)nordered or (o)rdered list type
    articleId: 'ocxt-Article',    // id of the container to search
    filter: false     // CSS style selector to exclude from outline
  }, options)

  //shared functions
  const getLevel = function(str) {
    return parseInt(str.replace(/[a-z,A-Z]/g,''))
  }
  //create listitem html
  const listItem = function(el, level) {
    let li = '<li data-level="' + level + '">'
    if (options.addLinks) li += '<a href="#' + el.id + '">'
    li += el.textContent
    if (options.addLinks) li += '</a>'
    li += '</li>'
    return li
  }

  //toc of contents - remove # if necessary
  let TOCS = document.querySelectorAll(toc)

  //get levels in between top and bottom - make query string
  let lvls = []
  for (let i = options.top; i <= options.bottom; i++) {
    lvls.push('h' + i)
  }

  //select all levels
  let container = document.getElementById(options.articleId);
  let hs = container.querySelectorAll(lvls.join(','))
  //let hs = document.querySelectorAll(lvls.join(','))
  let headers

  //if filter?
  if (options.filter instanceof Function) {
    let arr = Array.prototype.slice.call(hs)
    headers = arr.filter(options.filter)
  } else if (options.filter instanceof String) {
    let arr = Array.prototype.slice.call(hs)
    headers = arr.filter(function(el) {
      return !el.matches(options.filter)
    })
  } else {
    headers = Array.prototype.slice.call(hs)
  }

  //add ids if necessary
  if (options.addIds) {
    //keep track of ids
    let ids = []
    headers.forEach(function(el) {
      //if it has an id already, just add that to the array
      if (el.id) return ids.push(el.id)
      //id will be the textcontent without non-letter characters in lower case
      let id = el.textContent.replace(/[^a-zA-Z]/g, '').toLowerCase() + 'Header'
      while(ids.indexOf(id) !== -1) {
        //add zs to the end until we have a unique id
        id = id + 'z'
      }
      //ready to be tracked
      ids.push(id)
      //okay we can set now
      el.id = id
    })
  }

  //make list
  //current level
  let prevLevel = options.top
  let html = '<' + options.listType + 'l>'
  headers.forEach(function(h) {
    let currentLevel = getLevel(h.tagName)
    let li = listItem(h, currentLevel)
    //if we're still at level
    if (currentLevel === prevLevel) {
      html += li
    } else if (currentLevel < prevLevel) {
      //if we've gone back up
      html += ('</' + options.listType + 'l>').repeat(prevLevel - currentLevel) + li
    } else {
      //we've gone down
      html += '<' + options.listType + 'l>' + li
    }
    prevLevel = currentLevel
  })

  // insert in multiple places if that was used
  for (var i = 0; i < TOCS.length; i++) {
    TOCS[i].insertAdjacentHTML('beforeend', html)
  }
  
}