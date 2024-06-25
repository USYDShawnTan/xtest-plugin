import React from 'react';
import { createDynamicComponent } from 'yunzai/utils';

const dynamic = createDynamicComponent(import.meta.url);
const Help = (await dynamic('./views/help.tsx')).default;

const Config = [
  {
    url: '/help',
    element: <Help />,
  },
];

export default Config;
