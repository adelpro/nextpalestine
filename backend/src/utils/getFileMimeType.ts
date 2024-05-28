export const getFileMimeType = async (file: Express.Multer.File): Promise<string | undefined> => {
  try {
    //const buffer = await fs.promises.readFile(filePath);
    const subarray = Buffer.from(file.buffer.subarray(0, 4));
    const header = subarray.toString('hex');

    switch (header) {
      case '89504e47':
        return 'image/png';
      case '52494646':
      case '57454250':
        return 'image/webp';
      case 'ffd8ffe0':
      case 'ffd8ffe1':
      case 'ffd8ffe2':
      case 'ffd8ffe8':
        return 'image/jpeg';
      default:
        return undefined;
    }
  } catch (err) {
    console.error('Error reading file:', err);
    return undefined;
  }
};
