import { Injectable } from '@angular/core';

// @Injectable({ providedIn: 'root' })
export class LoggingService {
  lastLog: string;

  log(message: string) {
    console.log(message);
    this.lastLog = message;
  }
}
