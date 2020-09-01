import { Component } from '@angular/core';
import { tap, takeUntil, filter, repeatWhen } from 'rxjs/operators';
import { TimerService } from './timer.service';
import { QuestionsService } from '../question/question.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  public timer$ = this.timerService.timeRemainingToAnswer$;
  public answerSubmitted: any = this.questionService.answerSubmitted$.pipe(
    filter(answerSubmitted => answerSubmitted),
    tap(() => this.timerService.stopTimer()),
    takeUntil(this.timerService.stopTimer$),
    repeatWhen(() => this.timerService.startTimer$)
  ).subscribe();

  constructor(private readonly timerService: TimerService, private readonly questionService: QuestionsService) { }

}
