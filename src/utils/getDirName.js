// import.meta
export default function getDirName(meta) {
  return new URL(".", meta.url).pathname;
}
