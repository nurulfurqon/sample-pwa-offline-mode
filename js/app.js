(function () {
  'use strict'

  // var data = 'http://127.0.0.1:8887/data.json'

  const app = {
    container: $('.container'),
    spinner: $('.loader'),
    toast: $('.toast')
  }

  /* var request = new XMLHttpRequest()
  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        // app.container.removeAttribute('hidden')
        app.spinner.setAttribute('hidden', true)
        data = JSON.parse(request.response)
        for (var index = 0; index < data.length; index++) {
          var title = data[index].name
          var desc = data[index].description
          var box = document.createElement('div')
          box.className = 'box'
          box.innerHTML =
            '<div class="box__header">' +
                '<div class="box__header_title">' + title + '</div>' +
            '</div>' +
            '<div class="box__body">' +
                '<div class="box__body_text">' + desc + '</div>' +
            '</div>'
          app.container.appendChild(box)
        }
      } else {
        console.log('data kosong')
      }
    }
  }
  request.open('GET', data)
  request.send() */

  function boxCardTemp (data) {
    const template =
      '<div class="box">' +
        '<div class="box__header">' +
        '<div class="box__header_title">' + data.title + '</div>' +
        '</div>' +
        '<div class="box__body">' +
            '<div class="box__body_text">' + data.body + '</div>' +
        '</div>' +
      '</div>'
    return template
  }

  function boxCard () {
    let list = ''
    const errorTmpt =
      '<div class="error">' +
        '<img class="error__image" src="images/error.png" alt="error data">' +
        '<div class="error__title">' +
          'Error Data !' +
        '</div>' +
      '</div>'
    if (!navigator.onLine) {
      app.spinner.hide()
      app.toast.show()
      const d = localStorage.getItem('dataJson')
      JSON.parse(d).map(function (x) {
        list += boxCardTemp(x)
        return x
      })
      app.container.html(list)
    } else {
      $.ajax({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/posts',
        error: function (err) {
          app.spinner.hide()
          app.container.append(errorTmpt)
          console.log(err)
        }
      })
        .done(function (data) {
          if (!data) {
            app.spinner.hide()
            return app.container.append(errorTmpt)
          }
          app.spinner.hide()
          localStorage.setItem('dataJson', JSON.stringify(data))
          data.map(function (d) {
            list += boxCardTemp(d)
            return d
          })
          app.container.html(list)
        })
    }
  }

  boxCard()

  // TODO add service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(function (reg) {
        console.log('Service Worker Registered!', reg)
      })
      .catch(function (err) {
        console.error('Failed Register Service Worker!', err)
      })
  }
})()
