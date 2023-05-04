import { x } from 'y';
import { ann } from 'y';

const config = require('config.json');
const css = require('style.css');

// this should be picked up
const oldPackage = require('config.js');

export function hello(name: string) {
    return `hi ${name}!`;
}
