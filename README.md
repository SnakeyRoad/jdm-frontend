# JDM CMAS Exercise Tracker

A web application for tracking and monitoring CMAS (Childhood Myositis Assessment Scale) exercises for children with Juvenile Dermatomyositis (JDM). The application allows kids to record their exercise scores and doctors to monitor their progress.

## Features

- User authentication for both kids and doctors
- Interactive CMAS exercise tracking with 14 standardized tasks
- Real-time score calculation and visualization
- Kid-friendly interface with animations and sound effects
- Progress visualization with charts and percentages
- Doctor dashboard for monitoring patient progress and interpreting scores
- Data export capabilities (CSV format)
- Responsive design for desktop and mobile devices

## About CMAS

The Childhood Myositis Assessment Scale (CMAS) is a validated tool for measuring muscle strength and endurance in children with Juvenile Dermatomyositis. The scale includes 14 standardized tasks, with a maximum score of 53 points. Higher scores indicate better muscle function.

Score interpretation:
- 0-19: Severe impairment
- 20-34: Moderate impairment
- 35-49: Mild impairment
- 50-52: Normal function

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/SnakeyRoad/jdm-frontend.git
cd jdm-frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Test Credentials

### For Kids:
- Username: `testkid`
- Password: `pass`

### For Doctors:
- Username: `drhouse`
- Password: `pass`

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (not recommended)

## Project Structure

```
src/
├── components/         # React components
│   ├── common/        # Shared components (Header, Footer, Confetti, etc.)
│   ├── Login/         # Authentication components
│   ├── Tasks/         # CMAS task components
│   ├── Welcome/       # Welcome screens
│   ├── Completion/    # Task completion screens
│   └── DoctorView/    # Doctor dashboard components
├── contexts/          # React contexts for state management
├── utils/             # Utility functions (API, CSV export, etc.)
└── App.jsx            # Main application component
```

## Technologies Used

- React.js for the UI
- React Router for navigation
- React Context API for state management
- Tailwind CSS for styling
- Recharts for data visualization
- Web Audio API for sound effects

## Future Improvements

- Backend integration for persistent data storage
- Multi-language support
- Multiple user profiles per account
- Historical data tracking and trend analysis
- Printable reports for healthcare providers
- Integration with wearable devices or motion sensors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Create React App
- CMAS task definitions based on validated clinical assessments
- Designed with input from healthcare professionals
- Special thanks to all who contribute to care for children with JDM
