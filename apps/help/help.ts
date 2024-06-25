import { Plugin } from 'yunzai/core'
import { Segment } from 'yunzai/core'
import { image } from '../../image.tsx'
export default class App extends Plugin {
    constructor() {
        super()
        this.priority = 700
        this.rule = [
            {
                reg: /^(#|\/)?小谈帮助/,
                fnc: this.hello.name
            },
        ]
    }
    async hello() {
        const img = await image.createHelp()
        // 判断是否成功
        if (typeof img !== 'boolean') {
            // 图片
            this.e.reply(Segment.image(img))
        } else {
            this.e.reply('你好')
        }
    }
}