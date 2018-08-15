import config from '../config'

export default () => {
    const {
        pageWidth,
        pageHeight
    } = config
    const body = document.querySelector('body')
    body.style.width = `${pageWidth}px`
    body.style.height = `${pageHeight}px`
    const x = window.innerWidth / pageWidth
    const y = window.innerHeight / pageHeight
    body.style.transform = `scale(${x}, ${y})`
}
