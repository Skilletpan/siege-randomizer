export function loadPortrait(operatorKey) {
  const showEasterEgg = Math.floor(Math.random() * 50) === 0;

  if (showEasterEgg) return require(`@/assets/portraits/${operatorKey}_2.png`);
  return require(`@/assets/portraits/${operatorKey}.png`);
}

export function loadIcon(operatorKey) {
  return require(`@/assets/icons/${operatorKey}.png`);
}
