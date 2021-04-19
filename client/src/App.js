import './App.css';
import ServoControl from './components/ServoControl';
import Typography from '@material-ui/core/Typography';

function App() {
  return (
    <div className="App">
      
      <Typography
        color="textSecondary"
        variant="h1"
      >
        Servo Control
      </Typography>

      <ServoControl />

    </div>
  );
}

export default App;
