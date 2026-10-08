/** Contrôles sur les modèles 3D anatomiques avant tout stockage. */

/** Un fichier GLB commence par l'en-tête « glTF » suivi de la version 2. */
export function isGlbBuffer(bytes: Uint8Array): boolean {
  return bytes.length >= 12 && bytes[0] === 0x67 && bytes[1] === 0x6c && bytes[2] === 0x54 && bytes[3] === 0x46 &&
    bytes[4] === 2 && bytes[5] === 0 && bytes[6] === 0 && bytes[7] === 0;
}

/** Un nom de structure sert de clé vers une maille du modèle : lettres, chiffres, tirets et tirets bas. */
export function isValidMeshName(name: string): boolean {
  return /^[A-Za-z0-9_.-]{1,80}$/.test(name);
}
