/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import brk from './break.js';
import characterStyle from './characterStyle.js';
import code from './code.js';
import heading from './heading.js';
import html from './html.js';
import image from './image.js';
import inlineCode from './inlineCode.js';
import link from './link.js';
import list from './list.js';
import listItem from './listItem.js';
import paragraph from './paragraph.js';
import paragraphStyle from './paragraphStyle.js';
import root from './root.js';
import table from './table.js';
import tableRow from './tableRow.js';
import tableCell from './tableCell.js';
import text from './text.js';
import thematicBreak from './thematicBreak.js';

export default {
  blockquote: paragraphStyle('Quote'),
  break: brk,
  code,
  delete: characterStyle('strike'),
  emphasis: characterStyle('italics'),
  strong: characterStyle('bold'),
  underline: characterStyle('underline'),
  subScript: characterStyle('subScript'),
  superScript: characterStyle('superScript'),
  heading,
  html,
  image,
  inlineCode,
  link,
  list,
  listItem,
  paragraph,
  root,
  table,
  tableRow,
  tableCell,
  text,
  thematicBreak,
};
