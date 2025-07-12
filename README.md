# NASA Astronomy Picture of the Day Viewer

A beautiful web application that displays NASA's Astronomy Picture of the Day with smooth animations and a modern UI.

## Features

- 🌌 View NASA's Astronomy Picture of the Day
- 📅 Search for images by specific dates
- ✨ Smooth animations powered by GSAP
- 🎨 Modern, responsive design
- 🔒 Secure API key management using environment variables

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy your NASA API key to the `.env` file:
   ```
   NASA_API_KEY=your_nasa_api_key_here
   ```
   - Get your free API key from [NASA API Portal](https://api.nasa.gov/)

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Development

For development with auto-restart:
```bash
npm run dev
```

## Security

- API keys are stored in `.env` file (not committed to version control)
- Server-side API key handling prevents client-side exposure
- `.gitignore` ensures sensitive files are not tracked

## API

The application uses NASA's APOD (Astronomy Picture of the Day) API:
- Endpoint: `https://api.nasa.gov/planetary/apod`
- Documentation: [NASA APOD API](https://api.nasa.gov/)

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Animations:** GSAP (GreenSock Animation Platform)
- **Backend:** Node.js, Express.js
- **Environment Management:** dotenv
- **Icons:** Material Icons
- **Fonts:** Exo 2, Orbitron (Google Fonts)

## File Structure

```
├── public/
│   └── index.html      # Main HTML file
├── src/
│   ├── css/
│   │   └── style.css   # Styles and animations
│   ├── js/
│   │   └── script.js   # Frontend JavaScript
│   └── assets/
│       └── rocket.svg  # Rocket icon
├── server.js           # Express server
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (not in git)
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## License

MIT License - feel free to use this project for learning and development! 