// not used directly, but needed to load polyfills: https://github.com/vercel/next.js/discussions/13678
import next from 'next';

import { setConfig } from 'next/config';
import config from './next.config';

setConfig(config)
