import { Component } from '@angular/core';
import { QuestionsService } from '../question/question.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  public vm$ = combineLatest(this.questionService.questions$, this.questionService.totalQuestionsCorrect$).pipe(
    map(([questions, totalQuestionsCorrect]) => ({
      totalQuestions: questions.length,
      totalQuestionsCorrect,
      percentCorrect: this.getPercent(totalQuestionsCorrect, questions.length),
      hasGoodScore: this.hasGoodScore(totalQuestionsCorrect, questions.length)
    }))
  );
  constructor(private readonly questionService: QuestionsService) { }

  public getPercent(totalQuestionsCorrect: number, totalQuestions: number): number {
    return (100 * totalQuestionsCorrect) / totalQuestions;
  }

  public hasGoodScore(totalQuestionsCorrect: number, totalQuestions: number): boolean {
    return (100 * totalQuestionsCorrect) / totalQuestions > 69;
  }

  public restartQuiz(): void {
    this.questionService.restartQuestions();
  }

}
