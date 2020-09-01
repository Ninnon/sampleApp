import { Component, OnDestroy } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { map, tap, startWith, distinctUntilChanged, delay, filter, takeWhile, takeUntil, withLatestFrom, repeatWhen } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { QuestionsService } from '../question/question.service';
import { ResultsService } from '../results/results.service';
import { TimerService } from '../timer/timer.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnDestroy {
  public formControl = new FormControl();
  public showResults: boolean;
  public nextQuestionTimer$: Subscription = this.questionService.answerSubmitted$.pipe(
    withLatestFrom(this.questionService.currentQuestionIndex$, this.questionService.questions$),
    filter((([answerSubmitted]) => answerSubmitted)),
    delay(2500),
    tap(() => {
      this.nextQuestion();
      this.formControl.enable();
      this.timerService.markTimerAsExpired(false);
      this.timerService.startTimer();

    }),
    takeUntil(this.questionService.allQuestionsCompleted$),
    repeatWhen(() => this.resultsService.restartQuiz$)
  ).subscribe();

  public vm$ = combineLatest(
    this.questionService.questions$,
    this.questionService.currentQuestion$,
    this.questionService.currentQuestionIndex$,
    this.questionService.answerSubmitted$,
    this.questionService.currentQuestionCorrectAnswerText$,
    this.resultsService.showResults$,
    this.timerService.timerExpired$.pipe(startWith(false)),
    this.formControl.valueChanges.pipe(startWith(null), distinctUntilChanged()),
    ).pipe(
    map(([questions, currentQuestion, currentQuestionIndex, answerSubmitted, correctAnswerText, showResults, timerExpired, changes]) => ({
      questions,
      currentQuestion,
      currentQuestionIndex,
      answerSubmitted,
      correctAnswerText,
      showResults,
      timerExpired,
      changes,
      isCorrectAnswer: answerSubmitted && currentQuestion.correctAnswer === +this.formControl.value,
      allQuestionsCompleted:  answerSubmitted && (currentQuestionIndex + 1 === questions.length),
      inputHasCurrentValue: changes ? true : false,
    })),
    tap(result => {
      if (result.isCorrectAnswer) {
        this.questionService.addScoreToTotal();
      }
      if (result.allQuestionsCompleted) {
        this.timerService.stopTimer();
        this.questionService.markAllQuestionsAsComplete();
      }
      if (result.timerExpired) {
        this.formControl.disable();
      }
    })
  );

  constructor(private questionService: QuestionsService, private readonly resultsService: ResultsService, private readonly timerService: TimerService) {}

  public ngOnDestroy(): void {
    this.nextQuestionTimer$.unsubscribe();
  }

  public submitAnswer() {
    this.formControl.disable();
    this.questionService.markQuestionAsAnswered();
  }

  public showFinalResults(): void {
    this.formControl.enable();
    this.formControl.reset();
    this.resultsService.showResults();
  }

  private nextQuestion() {
    this.formControl.reset();
    this.questionService.goToNextQuestion();
    this.questionService.markQuestionAsUnanswered();
  }

}
