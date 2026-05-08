import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Title from '../db/Title.model.js'
import dotenv from "dotenv";
dotenv.config();

const GENRES = ["action","thriller","drama","comedy","sci-fi","horror","romance","documentary","fantasy","crime"];
const LANGUAGES = ["Hindi","English","Tamil","Telugu","Malayalam","Bengali","Kannada"];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI!);
  await Title.deleteMany({});

  const titles = Array.from({ length: 200 }, () => {
    const type = faker.helpers.arrayElement(["movie", "series"] as const);
    const pickedGenres = faker.helpers.arrayElements(GENRES, { min: 1, max: 3 });

    return {
      type,
      name: faker.helpers.fake(
        type === "movie"
          ? `${faker.word.adjective()} ${faker.word.noun()}`
          : `${faker.word.noun()} of ${faker.word.noun()}`
      ),
      description: faker.lorem.sentences(2),
      language: faker.helpers.arrayElement(LANGUAGES),
      isLive: faker.datatype.boolean({ probability: 0.4 }),
      genres: pickedGenres,
      releaseYear: faker.number.int({ min: 1990, max: 2024 }),
      thumbnailUrl: faker.image.url(),
    };
  });

  await Title.insertMany(titles);
  console.log(`✅ Seeded ${titles.length} titles`);
  await mongoose.disconnect();
}

seed().catch(console.error);