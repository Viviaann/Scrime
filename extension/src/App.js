import logo from './logo.svg';
import './App.css';
import Popup from './components/Popup';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [timerHours, setTimerHours] = useState('00');
  const [timerMinutes, setTimerMinutes] = useState('00');
  const [timerSeconds, setTimerSeconds] = useState('00');

  let interval = useRef();
  const startTimer = () => {
    const curTime = new Date('May 20, 2020 00:00:00');
    interval = setInterval( () => {
      const futureTime = new Date();
      // futureTime.setMinutes(curTime.getMinutes());
      const distance = futureTime.getTime() - curTime.getTime();

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)));
      const minutes = Math.floor((distance % (1000 * 60 * 60) / (1000 * 60)));
      const seconds = Math.floor((distance % (1000 * 60) / 1000));
      if(distance < 0) {
        clearInterval(interval.current);
      } else {
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    }, 1000); 
  };
  // componentDidMount
   useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval.current);
    };
   });
  return (
    <div className="App">
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <h3>Break Time</h3>
        </Popup>
        <section className="timer-container">
          <section className="timer">
            <div> 
              <h2>Countdown Timer</h2>
            </div>
            <div>
              <section>
                <p>{timerHours}</p>
                <p><small>Hours</small></p>
              </section>
              <span>:</span>
              <section>
                <p>{timerMinutes}</p>
                <p><small>Minutes</small></p>
              </section>
              <span>:</span>
              <section>
                <p>{timerSeconds}</p>
                <p><small>Seconds</small></p>
              </section>
            </div>
          </section>
          <button onClick={() => setButtonPopup(true)}>Normal Popup Button</button>
        </section>
    </div>
  );
}

export default App;
