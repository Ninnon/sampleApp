import { Component, ɵConsole } from '@angular/core';
import { IQuestion, QuestionsService } from './questions.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent {
  public questions$: Observable<IQuestion[]> = this.questionService.questions$;
  private answerSubmittedBs: BehaviorSubject<boolean> = new BehaviorSubject(null);
  public answerSubmitted$: Observable<boolean> = this.answerSubmittedBs.asObservable();
  public currentQuestionIndex$ = this.questionService.currentQuestionIndex$;
  public answerControl = new FormControl();

  public vm$ = combineLatest(
    this.questions$,
    this.questionService.currentQuestion$,
    this.questionService.currentQuestionIndex$,
    this.answerSubmitted$,
    ).pipe(
    map(([questions, currentQuestion, currentQuestionIndex, answerSubmitted]) => ({
      questions,
      currentQuestion,
      currentQuestionIndex,
      isCorrectAnswer: answerSubmitted && currentQuestion.correctAnswer === +this.answerControl.value,
      answerSubmitted,
      allQuestionsCompleted : answerSubmitted && currentQuestionIndex + 1 === questions.length
    })),
    tap(result => {
      if (result.isCorrectAnswer) {
        this.questionService.addScoreToTotal();
      }
      if (result.allQuestionsCompleted) {
        console.log("all questions answered");
      }
    })
  );


  constructor(private readonly questionService: QuestionsService) { }

  public submitAnswer() {
    // combineLatest(this.questions$, this.questionService.currentQuestion$).pipe(
    //   // map(() => {})
    //   tap(([questions, currentQuestion]) => {
    //     console.log("here");
    //     if (currentQuestion.correctAnswer === +this.answerControl.value) {
    //       this.questionService.addScoreToTotal();
    //     }
    //     console.log("questions", questions);
    //     console.log("currentQuestion", currentQuestion);
    //   })
    // ).subscribe();
    this.currentQuestionIndex$
    this.answerSubmittedBs.next(true);
    this.answerControl.disable();
  }

  public showFinalResults(): void {
    this.questionService.markAllQuestionsAsAnswered();
  }

  public nextQuestion() {
    this.questionService.goToNextQuestion();
    this.answerSubmittedBs.next(false);
    this.answerControl.enable();
    this.answerControl.reset();
  }
}
