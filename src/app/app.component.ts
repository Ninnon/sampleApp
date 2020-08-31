import { Component } from '@angular/core';
import { QuestionsService } from './question/question.service';
import { combineLatest } from 'rxjs';
import { map, tap, startWith, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ResultsService } from "./results/results.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public formControl = new FormControl();
  public showResults: boolean;

  public vm$ = combineLatest(
    this.questionService.questions$,
    this.questionService.currentQuestion$,
    this.questionService.currentQuestionIndex$,
    this.questionService.answerSubmitted$,
    this.resultsService.showResults$,
    this.formControl.valueChanges.pipe(startWith(null), distinctUntilChanged()),
    ).pipe(
    map(([questions, currentQuestion, currentQuestionIndex, answerSubmitted, showResults, changes]) => ({
      questions,
      currentQuestion,
      currentQuestionIndex,
      answerSubmitted,
      showQuestionResults: showResults,
      changes,
      isCorrectAnswer: answerSubmitted && currentQuestion.correctAnswer === +this.formControl.value,
      allQuestionsCompleted:  answerSubmitted && (currentQuestionIndex + 1 === questions.length),
      inputHasCurrentValue: changes ? true : false,
    })),
    tap(result => {
      if (result.isCorrectAnswer) {
        this.questionService.addScoreToTotal();
      }
    })
  );

  constructor(private questionService: QuestionsService, private readonly resultsService: ResultsService) {}

  public submitAnswer() {
    this.formControl.disable();
    this.questionService.markQuestionAsAnswered();
  }

  public showFinalResults(): void {
    this.formControl.enable();
    this.formControl.reset();
    this.resultsService.showResults();
  }

  public nextQuestion() {
    this.formControl.enable();
    this.formControl.reset();
    this.questionService.goToNextQuestion();
    this.questionService.markQuestionAsUnanswered();
  }

}
