
// https://www.npmjs.com/package/fs-extra

module.exports = {
    include: [
        {
            src: 'src/assets/',
            dest: 'www/assets/'
        },
        {
            src: 'src/index.html',
            dest: 'www/index.html'
        },
        {
            src: 'src/service-worker.js',
            dest: 'www/service-worker.js'
        },
        {
            src: 'src/browserconfig.xml',
            dest: 'www/browserconfig.xml'
        },
        {
            src: 'src/manifest.json',
            dest: 'www/manifest.json'
        },
        {
            src: 'node_modules/ionic-angular/polyfills/polyfills.js',
            dest: 'www/build/polyfills.js'
        },
        {
            src: 'node_modules/ionicons/dist/fonts/',
            dest: 'www/assets/fonts/'
        },
    ]
};
