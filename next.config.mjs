/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  output: "standalone",
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    additionalData: `@import "./src/styles/_helpers.scss";`,
  },
};

export default nextConfig;
