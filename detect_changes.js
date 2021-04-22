const fs = require('fs');

const getDependencies = () => {
  const keyDependencieName = '@progress/kendo-';

  const rawdata = fs.readFileSync('package.json');
  const package = JSON.parse(rawdata);

  const dependencies = Object.keys(package.dependencies).filter(x => x.includes(keyDependencieName));
  const devDependencies = Object.keys(package.devDependencies).filter(x => x.includes(keyDependencieName));

  const arrOfDependencies = {};
  for (const dep of dependencies) {
    const obj = {};
    arrOfDependencies[dep] = package.dependencies[dep];
  }
  for (const dep of devDependencies) {
    const obj = {};
    arrOfDependencies[dep] = package.devDependencies[dep];
  }
  console.log(arrOfDependencies);
  return arrOfDependencies;
}

const updateSnapshot = (filename) => {
  console.log(`Updating file ${filename}`);
  packageObj = getDependencies()
  fs.writeFile(filename, JSON.stringify(packageObj), (err) => {
    if (err) throw err;
    console.log(`File ${filename} Saved!`);
  });
}

const getSnapShot = () => {
  const filename = 'snapshot.json';
  let packageObj = {};
  try {
    if (fs.existsSync(filename)) {
      const rawdata = fs.readFileSync('snapshot.json');
      packageObj = JSON.parse(rawdata);
    } else {
      updateSnapshot(filename)
    }
  } catch (err) {
    console.error(err);
  }
  return packageObj;
}

const snapshotDiff = () => {
  const snapshot = getSnapShot();
  const packageDependencies = getDependencies();
  let diff = '';
  for (const dep of Object.keys(snapshot)) {
    if (snapshot.length != packageDependencies.length || snapshot[dep] != packageDependencies[dep]) {
       diff += `Dependency version change: ${dep} \n   - snapshot version: ${snapshot[dep]}  \n   - package version: ${packageDependencies[dep]} \n\n`;
    }
  }
  return diff;
}

console.log(snapshotDiff());
