// A global object

// Prevent import hell

// Don't know where to put something?

var glob: any = window['glob'] || {}

window['glob'] = glob;

export default glob;