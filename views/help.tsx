import React from 'react';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const url = require('../resources/help/main.png');
import { helpList } from '../resources/help/helplist.js';

export default function Help() {
  return (
    <section className="h-[1000px] w-[800px] relative overflow-hidden">
      <div className="bg-cover bg-center h-full w-full absolute top-0 left-0" style={{ backgroundImage: `url(${url})` }}></div>
      <div className="text-white flex flex-col justify-center items-center relative z-10">
        <div className="flex flex-col gap-4 w-4/5 max-w-2xl p-5">
          {helpList.map((group, groupIndex) => (
            <div key={groupIndex} className="bg-black bg-opacity-50 rounded-lg p-3 mb-3">
              <h2 className="mb-3 text-xl font-extrabold">{group.group}</h2>
              <div className="grid grid-cols-3 gap-2">
                {group.list.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-white bg-opacity-10 rounded-md p-2">
                    <p className="font-bold text-base">{item.title}</p>
                    <p className="text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <footer className="text-center mt-5">
          Created By Yunzai-Bot 4.0.0 & xiaotan-Plugin 4.0.0
        </footer>
      </div>
    </section>
  );
};

