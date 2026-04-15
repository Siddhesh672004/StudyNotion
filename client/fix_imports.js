const fs = require('fs');
const path = require('path');
function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}
walkDir('src').forEach(f => {
    let txt = fs.readFileSync(f, 'utf8');
    txt = txt.replace(/(?:["'])((?:\.\.\/)*|(?:\.\/)*)*(?:store\/)?(?:slices\/)([\w-]+)(?:["'])/g, (match, prefix, sliceName) => {
        let rel = path.relative(path.dirname(f), path.resolve('src/store/slices')).replace(/\\/g, '/');
        if (!rel.startsWith('.')) rel = './' + rel;
        return '"' + rel + '/' + sliceName + '"';
    });
    fs.writeFileSync(f, txt);
});
