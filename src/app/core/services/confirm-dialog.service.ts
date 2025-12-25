import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  async confirm(message: string, title = 'Confirm', confirmText = 'Yes', cancelText = 'No'): Promise<boolean> {
    const data: ConfirmDialogData = { title, message, confirmText, cancelText };
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      disableClose: true,
      data
    });

    return (await firstValueFrom(ref.afterClosed())) === true;
  }

  async info(message: string, title = 'Info', okText = 'OK'): Promise<void> {
    const data: ConfirmDialogData = { title, message, confirmText: okText };
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '520px',
      disableClose: false,
      data
    });

    await firstValueFrom(ref.afterClosed());
  }
}
