# Merch Mockup Generator

A modern web application for creating professional merchandise mockups with AI-powered logo placement. Upload your logo, select from various product templates (t-shirts, hoodies, tote bags, etc.), and generate high-quality mockups instantly.

## Features

- **Logo Upload**: Support for PNG, JPG, and SVG image formats
- **Product Templates**: Pre-built templates for apparel, accessories, and home goods
- **AI Smart Placement**: Uses Google Gemini AI to suggest optimal logo positioning
- **Real-time Adjustments**: Interactive controls for scale, opacity, and position
- **High-Quality Export**: Export mockups as PNG images
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **AI Integration**: Google Gemini API
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)
- **Build Tool**: Vite

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bg
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload Logo**: Click the upload button or drag and drop your logo image.
2. **Select Template**: Choose from available product categories (Apparel, Accessories, Home & Living).
3. **Adjust Placement**: Use the sliders to adjust logo scale, opacity, and position.
4. **AI Smart Placement**: Click the "AI Smart Placement" button for AI-suggested optimal positioning.
5. **Export**: Click the export button to download your mockup as a PNG image.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run clean` - Clean build directory
- `npm run lint` - Run TypeScript type checking

## Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key for AI features

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   └── MockupCanvas.tsx  # Main canvas component
├── services/
│   └── aiService.ts  # Google Gemini AI integration
├── App.tsx          # Main application component
├── constants.ts     # Mockup templates data
├── types.ts         # TypeScript type definitions
└── main.tsx         # Application entry point
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.