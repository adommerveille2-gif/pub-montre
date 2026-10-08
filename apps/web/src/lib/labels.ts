export function difficultyLabel(value: string): string {
  switch (value) {
    case "EASY":
      return "Facile";
    case "MEDIUM":
      return "Intermédiaire";
    case "HARD":
      return "Difficile";
    case "EXPERT":
      return "Expert";
    default:
      return value;
  }
}
