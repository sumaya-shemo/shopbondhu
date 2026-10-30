const fs = require("fs");
const path = require("path");
const dirs = ["src/pages", "src/components"];
for (const dir of dirs) {
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".jsx")) continue;
    const src = fs.readFileSync(path.join(dir, file), "utf8");
    const set = new Set();
    const re = /className=(?:"([^"]*)"|\{`([^`]*)`\}|\{([^}]*)\})/g;
    let m;
    while ((m = re.exec(src))) {
      const txt = m[1] || m[2] || m[3] || "";
      txt.split(/\s+/).forEach((t) => {
        t = t.replace(/\$\{[^}]*\}/g, "");
        if (/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(t)) set.add(t);
      });
    }
    console.log("### " + dir + "/" + file);
    console.log([...set].sort().join(" "));
    console.log();
  }
}
