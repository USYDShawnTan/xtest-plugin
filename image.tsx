import React from 'react';
import { Picture } from 'yunzai/utils';
import Help from './views/help.tsx';

export class Image extends Picture {
    constructor() {
        super(); // 继承实例
        this.Pup.start();
    }
    /**
     * 创建帮助页面
     * @returns {Promise}
     */
    createHelp() {
        const Address = this.Com.create(<Help />, {
            html_name: `help.html`,
        });
        return this.Pup.render(Address, {
            tab: 'section'
        });
    }
}
export const image = new Image();
