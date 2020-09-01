import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  private showResultsBs: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private restartQuizSubject: Subject<void> = new Subject();
  public restartQuiz$ = this.restartQuizSubject.asObservable();
  public showResults$ = this.showResultsBs.asObservable();

  constructor() { }

  public resetResults(): void {
    this.showResultsBs.next(false);
    this.restartQuizSubject.next();
  }

  public showResults(): void {
    this.showResultsBs.next(true);
  }
}
