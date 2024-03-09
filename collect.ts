// IIFE - immediate invoke function expression
;(async function () {
  function wait(ms: number) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  let links = document.querySelectorAll('a')

  for (let link of links) {
    if (link.href.includes('/p/') && link.href.includes('/liked_by/')) {
      let dialogs = document.querySelectorAll('[role="dialog"]')
      if (dialogs.length != 0) {
        console.log('unexpected dialog, before click, stopping')
        break
      }
      link.scrollIntoView({ block: 'center', behavior: 'smooth' })
      await wait(500)
      link.click()
      console.log('waiting for dialog ...')
      for (;;) {
        await wait(500)
        dialogs = document.querySelectorAll('[role="dialog"]')
        if (dialogs.length == 2) {
          break
        }
        console.log('still waiting dialog ...')
      }
      console.log('dialog appeared')
      let usernames = new Set<string>()
      for (;;) {
        let lastUserCount = usernames.size
        let spanList = document.querySelectorAll<HTMLSpanElement>(
          '[role="dialog"] span[dir="auto"]',
        )
        let lastSpan
        for (let span of spanList) {
          if (span.children.length == 0 && span.innerText.length > 0) {
            lastSpan = span
            console.log(span.innerText)
            usernames.add(span.innerText)
          }
        }

        if (lastSpan) {
          lastSpan.scrollIntoView({
            block: 'center',
            behavior: 'smooth',
          })
        } else {
          console.log('still waiting liker list to be loaded')
        }
        await wait(500)

        let newUserCount = usernames.size
        if (lastSpan && newUserCount == lastUserCount) {
          break
        }
      }

      let closeButton = dialogs[0].querySelector<HTMLElement>(
        '[role="button"][aria-label="Close"]',
      )
      if (!closeButton) {
        console.log('unexpected case, failed to find close button in dialog')
        return
      }
      closeButton.click()
      console.log('wait until dialog is closed...')
      for (;;) {
        await wait(500)
        dialogs = document.querySelectorAll('[role="dialog"]')
        if (dialogs.length == 0) {
          break
        }
        console.log('still waiting dialog to be closed...')
      }
      console.log('finished this post')
    }
  }
})()
