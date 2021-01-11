export default function humanReadableSize(bytes) {
  const names = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  let rest = bytes;

  for (const size in names) {
    if (rest > 1024) {
      rest = Number((rest / 1024).toPrecision(3));
    } else {
      return `${rest} ${names[size]}`;
    }
  }

  return `${rest} ${names[names.length - 1]}`;
}
