// A global object

// Useful against import hell

var glob: any = window['glob'] || {}

window['glob'] = glob;

export default glob;