// Lista de skyboxes disponibles con imágenes reales
export const skyboxes = [
  { id: "night", name: "Noche", nameEn: "Night", image: "./skyboxes/night.png" },
  { id: "aurora", name: "Aurora Boreal", nameEn: "Aurora", image: "./skyboxes/aurora.png" },
  { id: "moonlight", name: "Luz de Luna", nameEn: "Moonlight", image: "./skyboxes/moonlight.png" },
  { id: "space-blue", name: "Espacio Azul", nameEn: "Space Blue", image: "./skyboxes/space-blue.png" },
  { id: "universe", name: "Universo", nameEn: "Universe", image: "./skyboxes/universe.png" },
  { id: "pink-sunrise", name: "Amanecer Rosa", nameEn: "Pink Sunrise", image: "./skyboxes/pink-sunrise.png" },
  { id: "beautiful", name: "Hermoso", nameEn: "Beautiful", image: "./skyboxes/beautiful.png" },
  { id: "neonsky", name: "Neón", nameEn: "Neon Sky", image: "./skyboxes/neonsky.png" },
  { id: "neonsky2", name: "Neón 2", nameEn: "Neon Sky 2", image: "./skyboxes/neonsky2.png" },
  { id: "hades", name: "Hades", nameEn: "Hades", image: "./skyboxes/hades.png" },
  { id: "spooky", name: "Espeluznante", nameEn: "Spooky", image: "./skyboxes/spooky.png" },
  { id: "goodnight", name: "Buenas Noches", nameEn: "Goodnight", image: "./skyboxes/goodnight.png" },
  { id: "overcast", name: "Nublado", nameEn: "Overcast", image: "./skyboxes/overcast.png" },
  { id: "hazy", name: "Brumoso", nameEn: "Hazy", image: "./skyboxes/hazy.png" },
  { id: "blue", name: "Azul", nameEn: "Blue", image: "./skyboxes/blue.png" },
  { id: "light-blue", name: "Azul Claro", nameEn: "Light Blue", image: "./skyboxes/light-blue.png" },
  { id: "cyan", name: "Cian", nameEn: "Cyan", image: "./skyboxes/cyan.png" },
  { id: "orange", name: "Naranja", nameEn: "Orange", image: "./skyboxes/orange.png" },
  { id: "red", name: "Rojo", nameEn: "Red", image: "./skyboxes/red.png" },
  { id: "chill-pink", name: "Rosa Relajante", nameEn: "Chill Pink", image: "./skyboxes/chill-pink.png" },
  { id: "light-pink", name: "Rosa Claro", nameEn: "Light Pink", image: "./skyboxes/light-pink.png" },
  { id: "chill-gray", name: "Gris Relajante", nameEn: "Chill Gray", image: "./skyboxes/chill-gray.png" },
  { id: "pandora", name: "Pandora", nameEn: "Pandora", image: "./skyboxes/pandora.png" },
  { id: "chromakey", name: "Chroma Key", nameEn: "Chroma Key", image: "./skyboxes/chromakey.png" },
  { id: "emo", name: "Emo", nameEn: "Emo", image: "./skyboxes/emo.png" },
];

// Skyboxes destacados para el onboarding (los 4 más populares)
export const featuredSkyboxes = [
  skyboxes.find(s => s.id === "night")!,
  skyboxes.find(s => s.id === "aurora")!,
  skyboxes.find(s => s.id === "space-blue")!,
  skyboxes.find(s => s.id === "pink-sunrise")!,
];
