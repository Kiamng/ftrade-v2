export function getImageData(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];

  if (!file) {
    return null;
  }

  const displayUrl = URL.createObjectURL(file);

  return { file, displayUrl };
}
