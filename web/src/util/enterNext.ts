// 自定义下一行的指令
export const enterNext = (app: any) => {
  app.directive('enter-next', {
    beforeMount(el: any) {
      el.addEventListener("keypress", (e: any) => {
        if (e.charCode === 13 || e.code === 'Enter') {
          const dom = document.getElementsByTagName('input')
          for (let i = 0; i < dom.length; i++) {
            if (dom[i] == document.activeElement) {
              if (i == dom.length) return
              if (!dom[i + 1]) return
              if (dom[i + 1].localName === 'input') {
                dom[i + 1].focus()
                return
              }
            }
          }
        }
      })
    }
  })
}