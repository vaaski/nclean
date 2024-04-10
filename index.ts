import type { Dirent } from "node:fs"
import { readdir, rmdir } from "node:fs/promises"
import { join } from "node:path"

const [, , ...args] = process.argv
const base = args[0] ?? process.cwd()

const entries = await readdir(base, { withFileTypes: true })
const folders = entries.filter((entry) => entry.isDirectory())

const eligibleFolders: Dirent[] = []

for (const folder of folders) {
  const subEntries = await readdir(join(base, folder.name), { withFileTypes: true })
  const nodeModules = subEntries.find((entry) => {
    return entry.isDirectory() && entry.name === "node_modules"
  })

  if (nodeModules) eligibleFolders.push(folder)
}

console.log("Cleaning folders:")
console.log(eligibleFolders.map((f) => f.name))

for (const folder of eligibleFolders) {
  console.log(`Cleaning ${folder.name}`)
  await rmdir(join(base, folder.name, "node_modules"), { recursive: true })
}
