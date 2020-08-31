import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  private showResultsBs: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public showResults$ = this.showResultsBs.asObservable();

  constructor() { }

  public resetResults(): void {
    this.showResultsBs.next(false);
  }

  public showResults(): void {
    this.showResultsBs.next(true);
  }
}
