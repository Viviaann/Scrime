/*global chrome*/
import React from 'react';
import Button from 'react-bootstrap/Button';
import '../styles/Popup.css';
import PopupFocusMode from './PopupFocusMode';

class Popup extends React.Component {
  constructor() {
    super();
    this.state = {
      shouldDisplayFocusMode: false,
    };
  }

  componentDidMount() {
    /** set the state for shouldDisplayFocusMode */
    chrome.storage.sync.get(
      'shouldDisplayFocusMode',
      (obj) => {
        const { shouldDisplayFocusMode } = obj;
        this.setState({ shouldDisplayFocusMode });
      }
    );
  }

  displayFocusMode = () => {
    console.log("displaying")
    this.setState({ shouldDisplayFocusMode: true });
    chrome.storage.sync.set({ shouldDisplayFocusMode: false });
  };

  hideFocusMode = () => {
    console.log("hiding")
    this.setState({ shouldDisplayFocusMode: false });
    chrome.storage.sync.set({ shouldDisplayFocusMode: false });
  };

  render() {
    const {shouldDisplayFocusMode} = this.state;
    return (
      <div className="popupContainer">
        {shouldDisplayFocusMode ? (
          /** if should not display focusmode */
          <PopupFocusMode
            hideFocusMode={this.hideFocusMode}
          />
        ) : (
          <div>
            <div>
              <h2>
                <strong>Scrime</strong>
              </h2>
            </div>
            <div className="btnContainer">
              <Button
                type="button"
                className="startBtn"
                onClick={this.displayFocusMode}
              >
                Start Scrime
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Popup;
