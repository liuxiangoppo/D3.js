export default class EasyDom {

    constructor(selector) {
        this.selector = selector;
    }

    getDom() {
        return this.$selector;
    }

    queryById(id) {
        if (id.substr(0, 1) !== '#') {
            id = '#' + id;
        }
        this.$selector = document.querySelector(id);
        return this;
    }

    queryByClassName(className) {
        return this;
    }

    queryByTagName() {
        return this;
    }

    width(width) {
        return this;
    }

    height(height) {
        return this;
    }

    addClass() {
        return this;
    }

    removeClass() {
        return this;
    }

    /**
     * 给当前的dom设置id
     * @param {*} id 
     */
    id(id) {
        return this;
    }

    /**
     * 获取当前dom的数组长度
     * 非链式调用
     */
    getSize() {
        const size = 0;
        return size;
    }

    text(text) {
        this.$selector.innerText = text;
        return this;
    }

    /**
     * 设置innerHtml内容
     * @param {*} html html字符串
     */
    html(html) {
        return this;
    }

    /**
     * 设置样式
     * @param {*} style 样式对象
     */
    style(style) {
        return this;
    }

    remove() {
        return this;
    }

    hide() {
        this.$selector.style.display = 'none';
        return this;
    }

    show() {
        this.$selector.style.display = 'block';
        return this;
    }

    on() {

    }

    bind() {

    }

    addEventerListener() {

    }
}