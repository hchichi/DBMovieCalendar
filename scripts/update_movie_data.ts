import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Define the directory path
const directoryPath = path.resolve(__dirname, '..', 'data', 'movies');

// Function to update all JSON files in the directory
async function updateAllMovies() {
  try {
    const files = fs.readdirSync(directoryPath);
    const jsonFiles = files.filter(file => /^cal\d{4}\.json$/.test(file));

    // Process files sequentially
    for (const file of jsonFiles) {
      const filePath = path.join(directoryPath, file);
      console.log(`Processing file: ${file}`);

      // Read the file content
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      let movies = JSON.parse(fileContent);

      const updatedMovies = [];

      // Process each movie
      for (const movie of movies) {
        if (!movie.link) {
          updatedMovies.push(movie);
          continue;
        }

        const idMatch = movie.link.match(/subject\/(\d+)/);
        if (!idMatch) {
          updatedMovies.push(movie);
          continue;
        }

        const id = idMatch[1];
        const { comment, calendar } = movie; // Retain original comment and calendar

        try {
          // Fetch movie data from API
          const response = await axios.get(`https://mmovie.imarkr.com/douban/api/movie/${id}`);
          const data = response.data;

          console.log(`Updated movie: ${data.title || data.original_title}`);

          updatedMovies.push({
            title: data.title || null,
            originTitle: data.original_title || null,
            calendar, // Retain original calendar
            link: movie.link,
            pic: {
              normal: data.pic?.normal || null,
              large: data.pic?.large || null,
            },
            rating: data.rating ? { value: data.rating.value || null } : null,
            comment, // Retain original comment
            intro: data.intro || null,
            languages: data.languages || [],
            genres: data.genres || [],
            pubdate: data.pubdate || null,
            year: data.year || null,
            is_tv: data.is_tv || false,
          });
        } catch (error) {
          console.error(`Failed to fetch movie data for ID: ${id}, trying TV endpoint...`);

          try {
            // Fetch TV data from API
            const tvResponse = await axios.get(`https://mmovie.imarkr.com/douban/api/tv/${id}`);
            const tvData = tvResponse.data;

            console.log(`Updated TV show: ${tvData.title || tvData.original_title}`);

            updatedMovies.push({
              title: tvData.title || null,
              originTitle: tvData.original_title || null,
              calendar, // Retain original calendar
              link: movie.link,
              pic: {
                normal: tvData.pic?.normal || null,
                large: tvData.pic?.large || null,
              },
              rating: tvData.rating ? { value: tvData.rating.value || null } : null,
              comment, // Retain original comment
              intro: tvData.intro || null,
              languages: tvData.languages || [],
              genres: tvData.genres || [],
              pubdate: tvData.pubdate || null,
              year: tvData.year || null,
              is_tv: tvData.is_tv || false,
            });
          } catch (tvError) {
            console.error(`Failed to fetch data for ID: ${id} from both endpoints.`);
            // If both requests fail, keep the original movie data
            updatedMovies.push(movie);
          }
        }
      }

      // Write the updated data back to the file
      fs.writeFileSync(filePath, JSON.stringify(updatedMovies, null, 2), 'utf-8');
      console.log(`Updated file: ${file}`);
    }

    console.log('All files updated successfully!');
  } catch (error) {
    console.error('Error updating movies:', error);
  }
}

// Run the update function
updateAllMovies();
