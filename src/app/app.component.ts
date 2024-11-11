import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public x: number = 0;
  public y: number = 0;
  private gamepadIndex: number | null = null;
  private gamepadPollInterval: any;

  readonly WHEEL_ID: number = 0
  readonly RIGHT_PEDAL_ID: number = 6
  readonly LEFT_PEDAL_ID: number = 5


  ngOnInit(): void {
    console.log("AppComponent Initialized");
  }

  ngOnDestroy(): void {
    if (this.gamepadPollInterval) {
      clearInterval(this.gamepadPollInterval);
    }
  }

  startGamepadDetection(): void {
    console.log("Gamepad detection started");

    window.addEventListener('gamepadconnected', (event: any) => {
      this.gamepadIndex = event.gamepad.index;
      console.log(`Gamepad connected at index ${this.gamepadIndex}`);
      this.startGamepadPolling();
    });

    window.addEventListener('gamepaddisconnected', (event: any) => {
      if (event.gamepad.index === this.gamepadIndex) {
        this.gamepadIndex = null;
        console.log('Gamepad disconnected');
        clearInterval(this.gamepadPollInterval);
      }
    });
  }

  startGamepadPolling(): void {
    console.log("Started polling");

    if (this.gamepadPollInterval) {
      clearInterval(this.gamepadPollInterval);
    }

    this.gamepadPollInterval = setInterval(() => {
      if (this.gamepadIndex === null) return;  // Ensure the index is not null before accessing

      const gamepad = navigator.getGamepads()[this.gamepadIndex];
      if (gamepad) {
        this.x = Math.round(gamepad.axes[this.WHEEL_ID] * 255);  // -1.0 - 1.0 range
        this.y = Math.round((gamepad.axes[this.RIGHT_PEDAL_ID] - gamepad.axes[this.LEFT_PEDAL_ID]) * (255 / 2));  // -2.0 - 2.0 range

        console.log(`Steering (X): ${this.x}, Pedals (Y): ${this.y}`);
      }
    }, 100);  // Poll every 100ms
  }
}
