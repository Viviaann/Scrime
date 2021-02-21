import React from 'react';
import Timer from 'react-compound-timer';
import '../styles/PopupFocusMode.css';

/*global chrome*/
class PopupFocusMode extends React.Component {
  constructor() {
    super();
    this.state = {
      isFocusModeEnabled: false,
      defaultTime: 1200000,
      passedTime: 0,
    };
  }

  componentDidMount = () => {
    /** set the state that focusMode is started or not */
    chrome.storage.sync.get('isFocusModeEnabled', (obj) => {
      this.setState({ isFocusModeEnabled: obj.isFocusModeEnabled });
    });
    /** start the clocktime to be the initclocktime */
    chrome.storage.sync.get('initClockTime', (obj) => {
      this.setState({ initClockTime: obj.initClockTime });
    });
  };

  render() {
    const { hideFocusMode } = this.props;
    /** set the following to be the current state
     * isFocusModeEnabled: decide whether the focus mode start or end
     * defaultime: the 1 hour default value for focus mode
     * initClockTime: the time when the focus mode is launched
     * passedTime: the amount of time passed by
     */
    const {
      isFocusModeEnabled,
      defaultTime,
      initClockTime,
      passedTime,
    } = this.state;
    const buttonText = isFocusModeEnabled ? 'Stop\nScrime' : 'Start\nScrime';

    const endFocusMode = () => {
      this.setState({ isFocusModeEnabled: false });
      chrome.storage.sync.set({ isFocusModeEnabled: false });
      chrome.runtime.sendMessage({ msg: 'end' });
    };

    const startFocusMode = (clock) => {
      /** update the state and set chrome storage to start focus mode */
      this.setState({ isFocusModeEnabled: true });
      chrome.storage.sync.set({ shouldDisplayFocusMode: true });
      chrome.storage.sync.set({ isFocusModeEnabled: true });
      /** pass in the time for the initial time of the clock */
      chrome.storage.sync.set({ initClockTime: clock });
      /** set chrome storage to start focus mode */
      chrome.runtime.sendMessage({ msg: 'start' });
    };

    const getStartingTime = () => {
      const {defaultTime} = this.state;
      /** How much time to start clock with */
      if (isFocusModeEnabled) {
        return initClockTime;
      }
      return defaultTime;
    };

    const getPassedTime = () => {
      /** get the passed time */
      chrome.runtime.sendMessage({ msg: 'get' }, (response) => {
        if (response) this.setState({ passedTime: response.time });
      });

      /** update the clock time */
      const newClockTime = initClockTime - passedTime;
      if (newClockTime > 0) {
        return newClockTime;
      }
      return 0;
    };

    return (
      <div className="popupFocusMode">
        <div className="popupFocusModeTitle">
          <h2>
            <strong>Scrime Mode</strong>
          </h2>
        </div>
        <Timer
          // Note this is only set ONCE
          initialTime={getStartingTime()} /** get the starting time */
          direction="backward"
          startImmediately={false}
          formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
        >
          {({ start, stop, setTime, getTime }) => (
            <>
              <div className="popupFocusModeBodyContainer">
                <div
                  className="popupFocusModeTimer"
                  data-testid="timer-button"
                >
                  <Timer.Hours formatValue={(value) => `${value}`} />
                  :
                  <Timer.Minutes />
                  :
                  <Timer.Seconds />
                </div>
              </div>
              <div className="popupFocusModeBtnContainer">
                <button
                  className="popupFocusModeButton btn"
                  type="button"
                  onClick={() => {
                    if (isFocusModeEnabled) {
                      stop();
                      endFocusMode();
                      hideFocusMode();
                    } else {
                      start();
                      // Set initial time so we can set a new time when popup is reopened
                      startFocusMode(getTime());
                    }
                  }}
                >
                  {buttonText}
                </button>
                <br />
                {isFocusModeEnabled ? (
                  [start(), setTime(getPassedTime())] // Where we get time from background
                ) : (
                  <button
                    type="button"
                    className="popupFocusModeBackButton btn"
                    onClick={() => {
                      hideFocusMode();
                    }}
                  >
                    Go Back
                  </button>
                )}
                <br />
              </div>
            </>
          )}
        </Timer>
      </div>
    );
  }
}
export default PopupFocusMode;
