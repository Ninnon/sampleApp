import { Injectable } from '@angular/core';
import { Subject, timer, Observable } from 'rxjs';
import { tap, repeatWhen, takeUntil, map, filter } from 'rxjs/operators';
import { QuestionsService } from '../question/question.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private startTimerSubject: Subject<void> = new Subject();
  public startTimer$: Observable<void> = this.startTimerSubject.asObservable();
  private stopTimerSubject: Subject<void> = new Subject();
  public stopTimer$: Observable<void> = this.stopTimerSubject.asObservable();
  private timerExpiredSubject: Subject<boolean> = new Subject();
  public timerExpired$: Observable<boolean> = this.timerExpiredSubject.asObservable();
  public countdownStart = 15;

  public answerSubmitted$ = this.questionService.answerSubmitted$.pipe(
    filter(answerSubmitted => answerSubmitted),
    tap(() => this.stopTimer())
  );

  public timeRemainingToAnswer$: Observable<number> =  timer(0, 1000).pipe(
    map((i) => this.countdownStart - i),
    tap(value => {
      if (value < 0) {
        this.stopTimer();
        this.markTimerAsExpired(true);
        this.questionService.markQuestionAsAnswered();
      }
    }),
    takeUntil(this.stopTimerSubject),
    repeatWhen(() => this.startTimerSubject)
  );

  constructor(private readonly questionService: QuestionsService) { }

  public startTimer(): void {
    this.startTimerSubject.next();
  }

  public markTimerAsExpired(expired: boolean): void {
    this.timerExpiredSubject.next(expired);
  }

  public stopTimer(): void {
    this.stopTimerSubject.next();
  }
}
