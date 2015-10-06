/*global define */

import Dataset from './dataset';


/**
 * For now, just go from es6 land to a global. We prolly want to do
 * some sort of check to make sure that we're not
 */
window.Dataset = Dataset;
