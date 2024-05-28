import * as ExifReader from 'exifreader';

async function getExifData(url: string): Promise<any | undefined> {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const tags = ExifReader.load(arrayBuffer);

    if (tags) {
      const artist = tags.Artist ? tags.Artist.description : 'Unknown Artist';
      const license = tags.License
        ? tags.License.description
        : 'Unknown License';

      return {
        artist,
        license,
        rawExifData: tags, // If you need the complete EXIF data
      };
    } else {
      throw new Error('No EXIF data found for the image.');
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export default getExifData;
