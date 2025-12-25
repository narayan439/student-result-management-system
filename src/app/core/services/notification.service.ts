import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  info(message: string, action = 'OK', durationMs = 3000): void {
    this.open(message, action, { duration: durationMs });
  }

  success(message: string, action = 'OK', durationMs = 3000): void {
    this.open(message, action, { duration: durationMs });
  }

  warn(message: string, action = 'OK', durationMs = 3500): void {
    this.open(message, action, { duration: durationMs });
  }

  error(message: string, action = 'OK', durationMs = 4500): void {
    this.open(message, action, { duration: durationMs });
  }

  private open(message: string, action: string, config: MatSnackBarConfig): void {
    this.snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      ...config
    });
  }
}
