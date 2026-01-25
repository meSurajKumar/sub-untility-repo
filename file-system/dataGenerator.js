import fs from 'fs'

const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const writeFile = (name, data) => {
  fs.writeFileSync(name, JSON.stringify(data, null, 2));
  console.log(`${name} created with ${data.length} records`);
};

/* ---------- animalInfo.json ---------- */
const animalInfo = Array.from({ length: random(200, 500) }, (_, i) => ({
  id: i + 1,
  name: `Animal_${i + 1}`,
  species: ["Mammal", "Bird", "Reptile", "Fish"][random(0, 3)],
  lifespan: random(1, 80),
  isWild: Math.random() > 0.5
}));

/* ---------- carInfo.json ---------- */
const carInfo = Array.from({ length: random(200, 500) }, (_, i) => ({
  id: i + 1,
  brand: ["Tesla", "BMW", "Audi", "Toyota", "Tata"][random(0, 4)],
  model: `Model_${random(100, 999)}`,
  year: random(2000, 2025),
  electric: Math.random() > 0.6
}));

/* ---------- climateInfo.json ---------- */
const climateInfo = Array.from({ length: random(200, 500) }, (_, i) => ({
  id: i + 1,
  city: `City_${i + 1}`,
  temperature: random(-10, 50),
  humidity: random(10, 100),
  condition: ["Sunny", "Rainy", "Cloudy", "Snowy"][random(0, 3)]
}));

/* ---------- collageInfo.json ---------- */
const collageInfo = Array.from({ length: random(200, 500) }, (_, i) => ({
  id: i + 1,
  name: `College_${i + 1}`,
  city: `City_${random(1, 50)}`,
  establishedYear: random(1950, 2022),
  studentsCount: random(500, 20000)
}));

/* ---------- userInfo.json ---------- */
const userInfo = Array.from({ length: random(200, 500) }, (_, i) => ({
  id: i + 1,
  name: `User_${i + 1}`,
  email: `user${i + 1}@example.com`,
  age: random(18, 60),
  isActive: Math.random() > 0.3
}));

writeFile("animalInfo.json", animalInfo);
writeFile("carInfo.json", carInfo);
writeFile("climateInfo.json", climateInfo);
writeFile("collageInfo.json", collageInfo);
writeFile("userInfo.json", userInfo);
