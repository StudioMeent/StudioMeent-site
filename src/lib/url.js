/* Paths in content.js are written without a leading slash ("projects/x/", "base/images/y.jpg").
   This turns them into links that work from every page. */
export const href = p => !p || /^([a-z]+:|\/|#)/i.test(p) ? p : "/" + p;
