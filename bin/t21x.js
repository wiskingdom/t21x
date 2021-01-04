#! /usr/bin/env node

'use strict';

/* import modules */
const premark = require('../scripts/premark');
const split = require('../scripts/split');

/* main */
const programType = process.argv[2];
const inputDataPath = process.argv[3];
const inputAssignPath = programType === 'split' ? process.argv[3] : null;
console.log(process.argv);
const programMap = {
  premark: premark.main,
  split: split.main,
};

if (programMap[programType]) {
  programMap[programType](inputDataPath, inputAssignPath);
} else {
  console.log('arg err');
}
