/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-disable no-param-reassign */
import crypto from 'crypto';
import { context as fetchAPI, h1 } from '@adobe/helix-fetch';
import processQueue from '@adobe/helix-shared-process-queue';
import { visit } from 'unist-util-visit';
import getDimensions from 'image-size';

function createFetchContext() {
  return process.env.HELIX_FETCH_FORCE_HTTP1
    ? h1()
    : fetchAPI();
}

function hsize(bytes, decimals = 2) {
  if (bytes === 0) {
    return '0   ';
  }
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['  ', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export default async function downloadImages(ctx, tree) {
  const context = createFetchContext();
  const { fetch } = context;

  // gather all image nodes
  const images = [];
  visit(tree, (node) => {
    if (node.type === 'image' && node.url) {
      images.push(node);
    }
    return visit.CONTINUE;
  });
  let count = 0;

  // download images
  await processQueue(images, async (node) => {
    try {
      const ref = crypto.createHash('sha1')
        .update(node.url)
        .digest('hex');
      const key = `${ref}.png`;
      node.data = ctx.images[key];
      if (node.data) {
        return;
      }

      let buffer;
      if (node.url.startsWith('data:image/png;base64,')) {
        buffer = Buffer.from(node.url.split(',').pop(), 'base64');
      } else {
        const idx = String(count).padStart(2, ' ');
        count += 1;
        ctx.log.info(`[${idx}] GET ${node.url}`);
        const ret = await fetch(node.url);
        if (!ret.ok) {
          const text = await ret.text();
          ctx.log.error(`[${idx}] ${ret.status} ${text}`);
          return;
        }
        buffer = await ret.buffer();
        ctx.log.info(`[${idx}] ${ret.status} ${hsize(buffer.length).padStart(10)} ${ret.headers.get('content-type')}`);
      }

      node.data = {
        key,
        buffer,
        dimensions: getDimensions(buffer),
      };
      ctx.images[key] = node.data;
    } catch (error) {
      ctx.log.error(`Cannot download image ${node.url}: ${error.message}`);
    }
  }, 8);

  // reset fetch context
  context.reset();
}
